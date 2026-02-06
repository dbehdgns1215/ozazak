import random

# 공고 ID 목록
recruitment_ids = [3, 7, 9, 10, 12, 13, 14, 24, 25, 39, 40, 46, 47, 57, 58, 71, 75, 80, 85, 86, 87]

# User 정보
users = [
    {"id": 1, "type": "admin"},
    {"id": 2, "type": "admin"},
    {"id": 3, "type": "admin"},
    {"id": 4, "type": "test"},
    {"id": 5, "type": "test"},
    {"id": 6, "type": "test"},
]

# 회사/포지션 템플릿
companies = ["NHN Cloud", "로레알", "KB국민은행", "이노션", "롯데글로벌로지스", "일화", "SK키파운드리", "건설공제조합", "유비쿼스", "한국토요타"]
positions = ["개발자", "마케터", "인턴", "신입", "경력", "HR", "기획자", "관리자"]

# 자소서 문항 템플릿
questions_template = [
    {"content": "지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.", "char_max": 1000},
    {"content": "본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.", "char_max": 1500},
    {"content": "해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.", "char_max": 1200},
    {"content": "팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.", "char_max": 1000},
    {"content": "본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.", "char_max": 800},
]

# 답변 템플릿
def generate_essay_content(char_max):
    base_texts = {
        800: "저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.",
        1000: "저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.",
        1200: "저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.",
        1500: "저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다."
    }
    closest = min([800, 1000, 1200, 1500], key=lambda x: abs(x - char_max))
    return base_texts[closest][:char_max]

# SQL 생성
sql_lines = []
sql_lines.append("-- " + "="*60)
sql_lines.append("-- Cover Letter Test Data Insertion SQL")
sql_lines.append("-- Generated: 2026-02-02 (Fixed)")
sql_lines.append("-- Users: 1-3 (admin), 4-6 (test)")
sql_lines.append("-- Each user: minimum 5 coverletters")
sql_lines.append("-- IMPORTANT: Follows exact business logic")
sql_lines.append("-- version_title = 'v1' (lowercase, as per service)")
sql_lines.append("-- " + "="*60)
sql_lines.append("")

for user in users:
    user_id = user["id"]
    user_type = user["type"]
    
    sql_lines.append(f"-- {'='*60}")
    sql_lines.append(f"-- USER {user_id}: {user_type}")
    sql_lines.append(f"-- {'='*60}")
    sql_lines.append("")
    
    # 각 유저당 5~7개의 자소서 생성
    num_coverletters = random.randint(5, 7)
    selected_recruitments = random.sample(recruitment_ids, num_coverletters)
    
    for cl_idx, recruitment_id in enumerate(selected_recruitments, 1):
        company = random.choice(companies)
        position = random.choice(positions)
        title = f"{company} {position} 지원"
        
        sql_lines.append(f"-- ==================== Coverletter {cl_idx} ====================")
        sql_lines.append(f"-- Step 1: Create Coverletter")
        sql_lines.append(f"INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)")
        sql_lines.append(f"VALUES ({user_id}, {recruitment_id}, '{title}', false, NULL, NOW(), NOW(), NULL);")
        sql_lines.append("")
        
        # 각 자소서당 2~4개의 문항 생성
        num_questions = random.randint(2, 4)
        selected_questions = random.sample(questions_template, num_questions)
        
        # 현재 coverletter를 참조하기 위한 변수
        cl_ref = f"(SELECT coverletter_id FROM coverletter WHERE account_id={user_id} AND recruitment_id={recruitment_id} ORDER BY created_at DESC LIMIT 1)"
        
        for q_idx, question_data in enumerate(selected_questions, 1):
            question_content = question_data["content"]
            char_max = question_data["char_max"]
            essay_content = generate_essay_content(char_max)
            essay_content_safe = essay_content.replace("'", "''")
            
            sql_lines.append(f"-- Step 2-{q_idx}: Create Question {q_idx} and Essay {q_idx}")
            
            # Question 생성
            sql_lines.append(f"INSERT INTO question (recruitment_id, content, order_val, char_max)")
            sql_lines.append(f"VALUES ({recruitment_id}, '{question_content}', {q_idx}, {char_max});")
            sql_lines.append("")
            
            # Essay 생성 - 방금 생성한 question 참조
            # PostgreSQL에서 마지막 삽입된 question을 찾는 안전한 방법:
            # 같은 recruitment_id에서 order_val이 q_idx인 가장 최근 question
            question_ref = f"(SELECT question_id FROM question WHERE recruitment_id={recruitment_id} AND order_val={q_idx} ORDER BY question_id DESC LIMIT 1)"
            
            sql_lines.append(f"INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)")
            sql_lines.append(f"VALUES (")
            sql_lines.append(f"    {cl_ref},")
            sql_lines.append(f"    {question_ref},")
            sql_lines.append(f"    '{essay_content_safe}',")
            sql_lines.append(f"    1,")
            sql_lines.append(f"    'v1',")  # FIXED: lowercase as per CreateCoverletterService
            sql_lines.append(f"    true,")
            sql_lines.append(f"    NULL")
            sql_lines.append(f");")
            sql_lines.append("")
        
        sql_lines.append("")

sql_lines.append("-- " + "="*60)
sql_lines.append("-- END OF SQL")
sql_lines.append("-- " + "="*60)

# 파일로 저장
output = "\n".join(sql_lines)
with open('cover_letter_data.sql', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"SQL generated successfully! Total lines: {len(sql_lines)}")
print(f"Fixed: version_title = 'v1' (lowercase)")
print(f"Fixed: Safer question reference using order_val")
