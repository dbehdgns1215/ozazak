import csv
import sys
import datetime
from datetime import datetime

# Input/Output filenames
INPUT_CSV = '공고_크롤링_2차.csv'
OUTPUT_SQL = '../back/infra/src/main/resources/db/migration/V20260204000000__insert_2nd_crawling_data.sql'

def escape_sql(text):
    if not text:
        return ""
    # Standard SQL escape for single quotes
    return text.replace("'", "''")

def format_date(date_str):
    if not date_str:
        return "NULL"
    try:
        # Expected: 2026년 1월 24일 10:00 or similar
        clean_str = date_str.replace('년', '-').replace('월', '-').replace('일', '').strip()
        parts = clean_str.split(' ')
        if len(parts) >= 2:
            ymd = parts[0]
            time_part = parts[1]
            
            ymd_parts = ymd.split('-')
            year = ymd_parts[0].strip()
            month = ymd_parts[1].strip().zfill(2)
            day = ymd_parts[2].strip().zfill(2)
            
            if ':' in time_part:
                h, m = time_part.split(':')
                return f"'{year}-{month}-{day} {h.zfill(2)}:{m.zfill(2)}:00'"
        return "NULL"
    except:
        return "NULL"

def format_created_at(date_str):
    if not date_str:
        return "NOW()"
    try:
        # CSV '수집일시' usually: 2026-01-28 14:22:11 or 2026-02-03 10:43
        if len(date_str.split(':')) == 2:
             # Missing seconds
             dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
             return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'"
        else:
             datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
             return f"'{date_str}'"
    except:
        return "NOW()"

def truncate_position(text):
    if not text:
        return ""
    if len(text) > 500:
        return text[:497] + "..."
    return text

def generate_sql():
    grouped_data = {} # 공고_ID -> { rows: [], first_row: ... }

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
            rec_id_csv = row[0] # 공고_ID
            
            if rec_id_csv not in grouped_data:
                grouped_data[rec_id_csv] = {
                    'first_row': row,
                    'positions': []
                }
            
            # Add position (직무명 is index 3)
            position = row[3].strip()
            if position and position not in grouped_data[rec_id_csv]['positions']:
                grouped_data[rec_id_csv]['positions'].append(position)

    print(f"Found {len(grouped_data)} unique recruitments (grouped by ID).")

    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("-- Migration Script for 2nd Crawling Data\n")
        f.write("-- Generated on " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n")
        f.write("-- Strategy: Group by 공고_ID, deduplicate positions, use dynamic IDs to avoid collisions\n\n")
        
        # Reset sequences to max existing ID + 1 to avoid collisions
        f.write("-- Reset sequences to avoid ID collisions\n")
        f.write("SELECT setval('company_company_id_seq', COALESCE((SELECT MAX(company_id) FROM company), 1));\n")
        f.write("SELECT setval('recruitment_recruitment_id_seq', COALESCE((SELECT MAX(recruitment_id) FROM recruitment), 1));\n")
        f.write("SELECT setval('question_question_id_seq', COALESCE((SELECT MAX(question_id) FROM question), 1));\n\n")
        
        count = 0
        for rec_id_csv, data in grouped_data.items():
            row = data['first_row']
            positions = data['positions']
            
            # Basic info from first row
            company_name = row[1]
            title = escape_sql(row[2])
            
            # Map company attributes
            # size mapping: 大기업->1, 中견기업->2, else->3
            raw_size = row[6]
            size_val = 3
            if raw_size and '대기업' in raw_size:
                size_val = 1
            elif raw_size and '중견기업' in raw_size:
                size_val = 2
            
            location = escape_sql(row[7])
            company_img_url = escape_sql(row[15])
            
            # Positions merged
            merged_position = ", ".join(positions)
            merged_position = truncate_position(escape_sql(merged_position))
            
            started_at = format_date(row[4])
            ended_at = format_date(row[5])
            
            questions_str = row[9] 
            apply_url = escape_sql(row[11])
            poster_url = row[12]
            created_at = format_created_at(row[14])
            
            # Content merging
            content_parts = []
            if poster_url:
                content_parts.append(poster_url)
            
            if questions_str:
                formatted_qs = escape_sql(questions_str.replace('|', '\n\n'))
                content_parts.append(formatted_qs)
            
            full_content = "\n\n".join(content_parts)
            full_content = escape_sql(full_content)
            
            company_name_esc = escape_sql(company_name)
            
            # Generate DO block
            f.write(f"-- Recruitment {count + 1}: {title} (ID: {rec_id_csv})\n")
            f.write("DO $$\n")
            f.write("DECLARE\n")
            f.write("    v_company_id bigint;\n")
            f.write("    v_recruitment_id bigint;\n")
            f.write("BEGIN\n")
            
            # 1. Company
            # Schema: company_id, name, img, location, size (No created_at/modified_at)
            f.write(f"    SELECT company_id INTO v_company_id FROM company WHERE name = '{company_name_esc}';\n")
            f.write("    IF v_company_id IS NULL THEN\n")
            f.write(f"        INSERT INTO company (name, img, location, size) VALUES ('{company_name_esc}', '{company_img_url}', '{location}', {size_val}) RETURNING company_id INTO v_company_id;\n")
            f.write("    END IF;\n\n")
            
            # 2. Recruitment
            f.write(f"    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) \n")
            f.write(f"    VALUES (v_company_id, '{title}', '{full_content}', {started_at}, {ended_at}, '{apply_url}', '{merged_position}', {created_at}) \n")
            f.write("    RETURNING recruitment_id INTO v_recruitment_id;\n\n")
            
            # 3. Questions
            if questions_str:
                qs = questions_str.split('|')
                limits_str = row[10]
                limits = []
                if limits_str:
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
            
    print(f"Generated SQL for {count} recruitments.")

if __name__ == '__main__':
    generate_sql()
