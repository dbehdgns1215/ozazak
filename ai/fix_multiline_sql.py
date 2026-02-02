"""
SQL 파일의 멀티라인 INSERT 문을 한 줄로 변환하는 스크립트
"""

def fix_multiline_sql(input_file, output_file):
    """
    SQL 파일에서 멀티라인 INSERT 문을 한 줄로 변환
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 줄바꿈을 공백으로 변환 (세미콜론으로 끝나는 경우만 줄바꿈 유지)
    lines = content.split('\n')
    result_lines = []
    current_line = ''
    
    for line in lines:
        stripped = line.rstrip('\r\n')
        
        # 주석이나 빈 줄은 그대로 유지
        if stripped.startswith('--') or not stripped.strip():
            if current_line:
                result_lines.append(current_line)
                current_line = ''
            result_lines.append(stripped)
            continue
        
        # INSERT 문 처리
        if current_line:
            current_line += ' ' + stripped
        else:
            current_line = stripped
        
        # 세미콜론으로 끝나면 한 문장 완성
        if current_line.rstrip().endswith(';'):
            result_lines.append(current_line)
            current_line = ''
    
    # 마지막 라인 처리
    if current_line:
        result_lines.append(current_line)
    
    # 파일 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result_lines))
    
    print(f"Fixed SQL saved to: {output_file}")

if __name__ == "__main__":
#     input_sql = "c:\\SSAFY\\GONGTONG\\S14P11B205\\ai\\V20260130164612__insert_company_recruitment_question_data.sql"
#     output_sql = "c:\\SSAFY\\GONGTONG\\S14P11B205\\ai\\V20260130164612__insert_company_recruitment_question_data.sql"
    
    fix_multiline_sql(input_sql, output_sql)
