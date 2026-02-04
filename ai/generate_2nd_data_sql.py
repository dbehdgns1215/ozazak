import csv
import sys
import datetime
from datetime import datetime

# Input/Output filenames
INPUT_CSV = '공고_크롤링_2차.csv'
# New migration file
OUTPUT_SQL = '../back/infra/src/main/resources/db/migration/V20260204120000__replace_2nd_crawling_data.sql'

def escape_sql(text):
    if not text:
        return ""
    # Standard SQL escape for single quotes
    return text.replace("'", "''")

def format_date(date_str):
    if not date_str or not date_str.strip():
        return "NULL"
    try:
        # Expected: 2026년 1월 24일 10:00
        clean_str = date_str.replace('년', ' ').replace('월', ' ').replace('일', ' ').strip()
        clean_str = ' '.join(clean_str.split()) 
        dt = datetime.strptime(clean_str, "%Y %m %d %H:%M")
        return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'"
    except Exception as e:
        try:
             dt = datetime.strptime(date_str.strip(), "%Y-%m-%d")
             return f"'{dt.strftime('%Y-%m-%d 00:00:00')}'"
        except:
             pass
        return "NULL"

def format_created_at(date_str):
    if not date_str:
        return "NOW()"
    try:
        if len(date_str.split(':')) == 2:
             dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
             return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'"
        else:
             datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
             return f"'{date_str}'"
    except:
        return "NOW()"

def generate_sql():
    rows = []
    titles_to_delete = set()

    print("Reading CSV...")
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        try:
            header = next(reader) # Skip header
        except StopIteration:
            print("Empty CSV file.")
            return
        
        for row in reader:
            if not row: continue
            
            # Skip if title (index 2) is empty
            if not row[2] or not row[2].strip():
                continue
                
            rows.append(row)
            # Title is index 2
            titles_to_delete.add(row[2])

    print(f"Found {len(rows)} rows to insert.")

    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("-- Migration Script for 2nd Crawling Data (REPLACEMENT)\n")
        f.write("-- Generated on " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n")
        f.write("-- Strategy: Delete existing data by Title, then Insert each CSV row as 1 Recruitment\n\n")
        
        # 1. Clean up existing data
        if titles_to_delete:
            f.write("-- 1. Cleanup existing data (based on Titles from CSV)\n")
            f.write("DO $$\n")
            f.write("DECLARE\n")
            f.write("    v_title text;\n")
            f.write("BEGIN\n")
            f.write("    -- Delete questions linked to recruitments with these titles\n")
            f.write("    DELETE FROM question WHERE recruitment_id IN (SELECT recruitment_id FROM recruitment WHERE title IN (\n")
            
            title_list = list(titles_to_delete)
            for i, t in enumerate(title_list):
                comma = "," if i < len(title_list) - 1 else ""
                f.write(f"        '{escape_sql(t)}'{comma}\n")
            f.write("    ));\n\n")
            
            f.write("    DELETE FROM recruitment WHERE title IN (\n")
            for i, t in enumerate(title_list):
                comma = "," if i < len(title_list) - 1 else ""
                f.write(f"        '{escape_sql(t)}'{comma}\n")
            f.write("    );\n")
            f.write("END $$;\n\n")

        # 2. Reset sequences
        f.write("-- Reset sequences to avoid ID collisions\n")
        f.write("SELECT setval('company_company_id_seq', COALESCE((SELECT MAX(company_id) FROM company), 1));\n")
        f.write("SELECT setval('recruitment_recruitment_id_seq', COALESCE((SELECT MAX(recruitment_id) FROM recruitment), 1));\n")
        f.write("SELECT setval('question_question_id_seq', COALESCE((SELECT MAX(question_id) FROM question), 1));\n\n")
        
        # 3. Process each row
        count = 0
        for row in rows:
            company_name = row[1]
            title = escape_sql(row[2])
            position = escape_sql(row[3])
            
            raw_size = row[6]
            size_val = 3
            if raw_size and '대기업' in raw_size:
                size_val = 1
            elif raw_size and '중견기업' in raw_size:
                size_val = 2
            
            location = escape_sql(row[7])
            started_at = format_date(row[4])
            ended_at = format_date(row[5])
            
            questions_str = row[9]
            limits_str = row[10]
            apply_url = escape_sql(row[11])
            poster_url = row[12]
            text_content = row[13]
            created_at = format_created_at(row[14])
            
            # Content merging: Poster (+ newline) + Text
            content_parts = []
            if poster_url and poster_url.strip():
                # User requested raw URL, not markdown image syntax
                content_parts.append(poster_url.strip())
            
            if text_content and text_content.strip():
                content_parts.append(text_content)
                
            full_content = "\n\n".join(content_parts)
            full_content = escape_sql(full_content)
            
            company_img_url = ""
            if len(row) > 15:
                company_img_url = escape_sql(row[15])

            company_name_esc = escape_sql(company_name)
            
            f.write(f"-- Row {count + 1}: {title} - {position}\n")
            f.write("DO $$\n")
            f.write("DECLARE\n")
            f.write("    v_company_id bigint;\n")
            f.write("    v_recruitment_id bigint;\n")
            f.write("BEGIN\n")
            
            f.write(f"    SELECT company_id INTO v_company_id FROM company WHERE name = '{company_name_esc}';\n")
            f.write("    IF v_company_id IS NULL THEN\n")
            f.write(f"        INSERT INTO company (name, img, location, size) VALUES ('{company_name_esc}', '{company_img_url}', '{location}', {size_val}) RETURNING company_id INTO v_company_id;\n")
            f.write("    END IF;\n\n")
            
            f.write(f"    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) \n")
            f.write(f"    VALUES (v_company_id, '{title}', '{full_content}', {started_at}, {ended_at}, '{apply_url}', '{position}', {created_at}) \n")
            f.write("    RETURNING recruitment_id INTO v_recruitment_id;\n\n")
            
            if questions_str and questions_str.strip():
                qs = questions_str.split('|')
                
                limits = []
                if limits_str and limits_str.strip():
                    limits = limits_str.split('|')
                
                for idx, q_text in enumerate(qs):
                    q_text_esc = escape_sql(q_text.strip())
                    if not q_text_esc: continue
                    
                    limit_val = 500
                    if idx < len(limits):
                        try:
                            val = limits[idx].strip()
                            if val and val.isdigit():
                                limit_val = int(val)
                        except:
                            pass
                    
                    f.write(f"    INSERT INTO question (recruitment_id, content, order_val, char_max) \n")
                    f.write(f"    VALUES (v_recruitment_id, '{q_text_esc}', {idx}, {limit_val});\n")
            
            f.write("END $$;\n\n")
            count += 1
            
    print(f"Generated SQL for {count} rows.")

if __name__ == '__main__':
    generate_sql()
