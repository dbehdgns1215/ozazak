# -*- coding: utf-8 -*-
import csv
import os
import sys
from datetime import datetime

# Windows 콘솔 인코딩 문제 해결
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# 파일 경로
RECRUITMENT_CSV = r'C:\Users\SSAFY\Downloads\공고_크롤링_1차 (1).csv'
LOGO_CSV = r'c:\SSAFY\GONGTONG\S14P11B205\ai\company_logos\logo_urls.csv'
OUTPUT_SQL = r'c:\SSAFY\GONGTONG\S14P11B205\ai\V20260130164612__insert_company_recruitment_question_data.sql'




def escape_sql_string(value):
    """SQL 문자열 이스케이프 처리"""
    if value is None or value == '':
        return 'NULL'
    # 작은따옴표를 두 개로 이스케이프
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def map_company_size(classification):
    """기업 분류를 숫자로 매핑"""
    if not classification or classification.strip() == '':
        return 3  # 중소기업
    
    classification = classification.strip()
    if classification == '대기업':
        return 1
    elif classification == '중견기업':
        return 2
    else:
        return 3  # 기타는 중소기업으로 처리



def parse_date(date_str):
    """날짜 문자열을 PostgreSQL 형식으로 변환"""
    if not date_str or date_str.strip() == '':
        return 'NULL'
    
    try:
        date_str = date_str.strip()
        
        # "2026년 1월 6일 09:00" 형식 파싱
        if '년' in date_str and '월' in date_str and '일' in date_str:
            # "일" 기준으로 분리
            # "2026년 1월 6일" + " 09:00" 분리
            if '일' in date_str:
                parts = date_str.split('일', 1)
                date_part = parts[0] + '일'  # "2026년 1월 6일"
                time_part = parts[1].strip() if len(parts) > 1 and parts[1].strip() else None
            else:
                date_part = date_str
                time_part = None
            
            # "2026년 1월 6일" -> "2026 1 6"
            date_only = date_part.replace('년', ' ').replace('월', ' ').replace('일', '')
            date_parts = [p.strip() for p in date_only.split() if p.strip()]
            
            if len(date_parts) == 3:
                year, month, day = date_parts
                formatted_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                
                if time_part:
                    return f"'{formatted_date} {time_part}'"
                else:
                    return f"'{formatted_date}'"
        
        return 'NULL'
    except Exception as e:
        print(f"Date parsing error: {date_str} - {e}")
        return 'NULL'


def parse_datetime(datetime_str):
    """수집일시를 PostgreSQL timestamp 형식으로 변환"""
    if not datetime_str or datetime_str.strip() == '':
        return 'NULL'
    
    try:
        # "2026-01-22 22:05" 형식
        datetime_str = datetime_str.strip()
        return f"'{datetime_str}:00'"  # 초 추가
    except Exception as e:
        print(f"Datetime parsing error: {datetime_str} - {e}")
        return 'NULL'


def parse_questions(count_str, questions_str, char_max_str):
    """
    문항 데이터를 파싱하여 리스트로 반환
    
    Args:
        count_str: 문항 개수
        questions_str: "|"로 구분된 질문들
        char_max_str: "|"로 구분된 최대 글자수들 (예: "1000 | 1000 | 1000")
    
    Returns:
        [(질문내용, 최대글자수), ...] 리스트
    """
    try:
        # 문항 개수가 0이거나 비어있으면 빈 리스트 반환
        if not count_str or str(count_str).strip() == '' or int(count_str) == 0:
            return []
        
        count = int(count_str)
        
        # 질문 파싱
        if not questions_str or questions_str.strip() == '':
            return []
        
        questions = [q.strip() for q in questions_str.split('|')]
        
        # 최대 글자수 파싱
        char_maxes = []
        if char_max_str and char_max_str.strip():
            char_maxes = [int(c.strip()) for c in char_max_str.split('|') if c.strip()]
        
        # 결과 생성 (최소 개수만큼만)
        result = []
        actual_count = min(count, len(questions), len(char_maxes) if char_maxes else len(questions))
        
        for i in range(actual_count):
            question = questions[i] if i < len(questions) else ''
            char_max = char_maxes[i] if i < len(char_maxes) else None
            
            if question:  # 빈 질문은 제외
                result.append((question, char_max))
        
        return result
    
    except Exception as e:
        print(f"Question parsing error: count={count_str}, questions={questions_str[:50] if questions_str else 'None'}..., char_max={char_max_str[:50] if char_max_str else 'None'}... - {e}")
        return []


def main():
    print("SQL generation started...")
    
    # 1. logo_urls.csv 읽기
    print("Loading logo_urls.csv...")
    logo_dict = {}
    with open(LOGO_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            company_name = row['기업명'].strip()
            logo_url = row['로고URL'].strip()
            logo_dict[company_name] = logo_url
    
    print(f"Loaded {len(logo_dict)} company logos")
    
    # 2. 공고 CSV 읽기
    print("Loading recruitment data...")
    recruitment_data = []
    company_set = {}  # {기업명: {location, size}}
    
    with open(RECRUITMENT_CSV, 'r', encoding='utf-8-sig') as f:  # UTF-8 BOM 문제 해결
        reader = csv.DictReader(f)
        for row in reader:
            recruitment_data.append(row)
            
            company_name = row['기업명'].strip()
            if company_name not in company_set:
                company_set[company_name] = {
                    'location': row['근무지'].strip() if row['근무지'] else None,
                    'size': row['기업_분류'].strip() if row['기업_분류'] else None
                }
    
    print(f"Loaded {len(recruitment_data)} recruitments from {len(company_set)} companies")
    
    # 3. SQL 파일 생성
    print(f"Generating SQL file: {OUTPUT_SQL}")
    
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("-- ========================================\n")
        f.write("-- Recruitment Data Insertion SQL\n")
        f.write(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("-- ========================================\n\n")
        
        # COMPANY 테이블 INSERT
        f.write("-- ========================================\n")
        f.write("-- 1. COMPANY Table Data\n")
        f.write("-- ========================================\n\n")
        
        company_count = 0
        for company_name, info in company_set.items():
            img_url = logo_dict.get(company_name, None)
            
            company_name_escaped = escape_sql_string(company_name)
            img_escaped = escape_sql_string(img_url)
            location_escaped = escape_sql_string(info['location'])
            # 기업 분류를 숫자로 매핑: 대기업=1, 중견기업=2, 중소기업=3
            size_value = map_company_size(info['size'])
            
            sql = f"INSERT INTO company (name, img, location, size) VALUES ({company_name_escaped}, {img_escaped}, {location_escaped}, {size_value});\n"
            f.write(sql)
            company_count += 1
        
        f.write(f"\n-- {company_count} companies inserted\n\n")
        
        # 3. Recruitment 데이터 생성
        f.write("-- ========================================\n")
        f.write("-- 2. RECRUITMENT Table Data\n")
        f.write("-- ========================================\n\n")
        
        recruitment_count = 0
        recruitment_id = 1  # 1부터 시작하는 autoincrement
        recruitment_map = {}  # CSV 공고_ID -> DB recruitment_id 매핑 (question용)
        
        for row in recruitment_data:
            csv_recruitment_id = row['공고_ID'].strip()  # CSV의 원본 공고_ID
            company_name = row['기업명'].strip()
            title = row['공고_제목'].strip() if row['공고_제목'] else None
            
            # Poster와 설명을 content로 결합
            poster_url = row['포스터'].strip() if row['포스터'] else None
            description = row['공고_본문'].strip() if row['공고_본문'] else None
            
            if poster_url and description:
                content = f"{poster_url}\n\n{description}"
            elif poster_url:
                content = poster_url
            elif description:
                content = description
            else:
                content = None
            
            # 날짜 파싱
            started_at = parse_date(row['시작일'])
            ended_at = parse_date(row['마감일'])
            
            # URL
            apply_url = row['URL'].strip() if row['URL'] else None
            
            # 생성일
            created_at = parse_datetime(row['수집일시'])
            
            # SQL 이스케이프
            title_escaped = escape_sql_string(title)
            content_escaped = escape_sql_string(content)
            apply_url_escaped = escape_sql_string(apply_url)
            
            # recruitment INSERT (DB의 autoincrement ID 사용)
            sql = (
                f"INSERT INTO recruitment (recruitment_id, company_id, title, content, started_at, ended_at, apply_url, created_at) "
                f"VALUES ({recruitment_id}, (SELECT company_id FROM company WHERE name = {escape_sql_string(company_name)}), "
                f"{title_escaped}, {content_escaped}, {started_at}, {ended_at}, {apply_url_escaped}, {created_at});\n"
            )
            f.write(sql)
            
            # CSV 공고_ID와 DB recruitment_id 매핑 저장 (question INSERT용)
            if csv_recruitment_id not in recruitment_map:
                recruitment_map[csv_recruitment_id] = []
            recruitment_map[csv_recruitment_id].append({
                'db_id': recruitment_id,
                'questions': parse_questions(
                    row['문항_개수'],
                    row['문항_질문'],
                    row['문항_글자수']
                )
            })
            
            recruitment_id += 1  # 다음 ID로 증가
            recruitment_count += 1
        
        f.write(f"\n-- {recruitment_count} recruitments inserted\n\n")
        
        # 4. Question 데이터 생성
        f.write("-- ========================================\n")
        f.write("-- 3. QUESTION Table Data\n")
        f.write("-- ========================================\n\n")
        
        question_count = 0
        # recruitment_map의 각 항목을 순회
        for csv_id, recruitment_list in recruitment_map.items():
            for recruitment_info in recruitment_list:
                db_recruitment_id = recruitment_info['db_id']
                questions = recruitment_info['questions']
                
                # 각 질문마다 INSERT (order_val은 0부터 시작)
                for order_val, (question_content, char_max) in enumerate(questions):
                    question_escaped = escape_sql_string(question_content)
                    char_max_value = char_max if char_max is not None else 'NULL'
                    
                    sql = (
                        f"INSERT INTO question (recruitment_id, content, order_val, char_max) "
                        f"VALUES ({db_recruitment_id}, {question_escaped}, {order_val}, {char_max_value});\n"
                    )
                    f.write(sql)
                    question_count += 1
        
        f.write(f"\n-- {question_count} questions inserted\n\n")
        
        # 통계
        logo_matched = len([c for c in company_set.keys() if c in logo_dict])
        f.write("-- ========================================\n")
        f.write("-- Statistics\n")
        f.write("-- ========================================\n")
        f.write(f"-- Companies: {company_count}\n")
        f.write(f"-- Recruitments: {recruitment_count}\n")
        f.write(f"-- Questions: {question_count}\n")
        f.write(f"-- Logo matched: {logo_matched}/{company_count} ({logo_matched/company_count*100:.1f}%)\n")
        f.write("-- ========================================\n")
    
    print(f"\nSQL file generated successfully!")
    print(f"File location: {OUTPUT_SQL}")
    print(f"Statistics:")
    print(f"  - Companies: {company_count}")
    print(f"  - Recruitments: {recruitment_count}")
    print(f"  - Questions: {question_count}")
    print(f"  - Logo matched: {logo_matched}/{company_count}")


if __name__ == '__main__':
    main()
