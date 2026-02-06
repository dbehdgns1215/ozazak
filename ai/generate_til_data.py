import random
import re
from datetime import datetime

# Streak SQL 파일들을 읽어서 각 유저의 활동 날짜 추출
def parse_streak_dates(sql_file):
    """Streak SQL 파일에서 account_id별 활동 날짜 추출"""
    user_dates = {}
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # INSERT VALUES 패턴 찾기
    # (account_id, 'YYYY-MM-DD', daily_count, 'created_at')
    pattern = r'\((\d+),\s*\'([\d-]+)\',\s*\d+,\s*\'[\d\s:-]+\'\)'
    matches = re.findall(pattern, content)
    
    for account_id, activity_date in matches:
        account_id = int(account_id)
        if account_id not in user_dates:
            user_dates[account_id] = []
        user_dates[account_id].append(activity_date)
    
    return user_dates

# 두 streak 파일에서 날짜 추출
print("Streak 데이터 파싱 중...")
streak_file1 = '../back/infra/src/main/resources/db/migration/V20260131153000__insert_streak_data.sql'
streak_file2 = '../back/infra/src/main/resources/db/migration/V20260131164000__insert_job_seeker_streak.sql'

user_activity_dates = {}

# 첫 번째 파일 (account 1~29)
dates1 = parse_streak_dates(streak_file1)
user_activity_dates.update(dates1)
print(f"파일 1: {len(dates1)}명의 유저 날짜 추출")

# 두 번째 파일 (account 30~49)
dates2 = parse_streak_dates(streak_file2)
user_activity_dates.update(dates2)
print(f"파일 2: {len(dates2)}명의 유저 날짜 추출")

print(f"총 {len(user_activity_dates)}명의 유저 활동 날짜 추출 완료\n")

# 유저별 페르소나 및 주제 (account 4~49)
user_data = {
    4: {"topics": ["Spring", "Java", "Database"]},
    5: {"topics": ["Python", "Django", "PostgreSQL"]},
    6: {"topics": ["React", "JavaScript", "TypeScript"]},
    7: {"topics": ["Spring Boot", "JPA", "AWS"]},
    8: {"topics": ["React", "NextJS", "TailwindCSS"]},
    9: {"topics": ["Docker", "Kubernetes", "Jenkins"]},
    10: {"topics": ["Spring", "Java", "MySQL"]},
    11: {"topics": ["React", "JavaScript", "CSS"]},
    12: {"topics": ["Spring Boot", "JPA", "Redis"]},
    13: {"topics": ["Python", "Pandas", "SQL"]},
    14: {"topics": ["React", "NodeJS", "MongoDB"]},
    15: {"topics": ["Figma", "CSS", "Design"]},
    16: {"topics": ["Python", "JavaScript", "Git"]},
    17: {"topics": ["Product", "Agile", "Management"]},
    18: {"topics": ["Architecture", "Microservices", "DDD"]},
    19: {"topics": ["Startup", "MVP", "Strategy"]},
    20: {"topics": ["Testing", "Selenium", "JUnit"]},
    21: {"topics": ["Docker", "Kubernetes", "AWS"]},
    22: {"topics": ["Security", "Hacking", "OWASP"]},
    23: {"topics": ["Unity", "CSharp", "GameDesign"]},
    24: {"topics": ["Python", "MachineLearning", "Statistics"]},
    25: {"topics": ["AWS", "GCP", "Cloud"]},
    26: {"topics": ["DeepLearning", "PyTorch", "NLP"]},
    27: {"topics": ["Swift", "iOS", "UIKit"]},
    28: {"topics": ["Solidity", "Ethereum", "Web3"]},
    29: {"topics": ["Leadership", "SystemDesign", "Architecture"]},
    30: {"topics": ["Java", "Algorithm", "DataStructure"]},
    31: {"topics": ["Spring", "REST API", "MySQL"]},
    32: {"topics": ["Java", "JSP", "Servlet"]},
    33: {"topics": ["Spring", "MyBatis", "Oracle"]},
    34: {"topics": ["DistributedSystems", "Algorithm", "CPP"]},
    35: {"topics": ["React", "TypeScript", "NextJS"]},
    36: {"topics": ["OpenSource", "Git", "React"]},
    37: {"topics": ["Algorithm", "CPP", "CompetitiveProgramming"]},
    38: {"topics": ["HTML", "CSS", "JavaScript"]},
    39: {"topics": ["Product", "UserResearch", "Analytics"]},
    40: {"topics": ["Java", "Spring", "Algorithm"]},
    41: {"topics": ["Python", "DataAnalysis", "Pandas"]},
    42: {"topics": ["Research", "MachineLearning", "Paper"]},
    43: {"topics": ["Java", "Spring", "JPA"]},
    44: {"topics": ["JavaScript", "React", "TypeScript"]},
    45: {"topics": ["React", "Vue", "Frontend"]},
    46: {"topics": ["NodeJS", "Express", "MongoDB"]},
    47: {"topics": ["Unity", "CSharp", "GameDevelopment"]},
    48: {"topics": ["Python", "TensorFlow", "Kaggle"]},
    49: {"topics": ["React", "NodeJS", "PostgreSQL"]},
}

# SQL 생성
community_sql = []
tag_sql = []
community_id = 1

for account_id in range(4, 50):  # 4~49
    if account_id not in user_activity_dates:
        print(f"경고: Account {account_id}의 streak 데이터 없음")
        continue
    
    activity_dates = user_activity_dates[account_id]
    if len(activity_dates) < 5:
        print(f"경고: Account {account_id}의 활동 날짜가 5개 미만 ({len(activity_dates)}개)")
        continue
    
    persona = user_data[account_id]
    topics = persona["topics"]
    
    # 각 유저당 5~8개의 TIL 생성
    num_tils = min(random.randint(5, 8), len(activity_dates))
    
    # 활동 날짜 중에서 랜덤하게 선택 (중복 없이)
    selected_dates = random.sample(activity_dates, num_tils)
    # 날짜 순으로 정렬
    selected_dates.sort()
    
    for til_date_str in selected_dates:
        # 주제 선택
        topic = random.choice(topics)
        
        # 제목 생성
        title = f"{topic} 학습 정리 및 실습"
        
        # 긴 내용 생성 (1000~4000자)
        sections = [
            f"# {title}",
            f"\n오늘은 {topic}에 대해 깊이 공부하고 실습했다.",
            f"\n## 학습 배경\n\n최근 프로젝트를 진행하면서 {topic}의 필요성을 느꼈다. 기본 개념부터 실전 활용까지 체계적으로 정리해보기로 했다.",
            f"\n## 주요 학습 내용\n\n### 1. 기본 개념\n\n{topic}는 현대 소프트웨어 개발에서 매우 중요한 기술이다. 핵심 개념을 정리하면 다음과 같다:\n\n- 기본 원리와 동작 방식\n- 주요 특징과 장단점\n- 실무 활용 사례",
            f"\n### 2. 실습 예제\n\n간단한 예제 코드를 작성해봤다.\n\n```\n// {topic} 예제 코드\n// 실제 동작하는 코드로 학습\n```",
            f"\n### 3. 주의사항\n\n{topic}를 사용할 때 다음 사항들을 주의해야 한다:\n\n1. 성능 최적화 고려사항\n2. 보안 관련 이슈\n3. 베스트 프랙티스\n4. 흔한 실수와 해결 방법",
            f"\n## 실전 활용\n\n실제 프로젝트에 적용해보면서 다음과 같은 점들을 배웠다:\n\n- 이론과 실전의 차이\n- 문제 해결 과정\n- 성능 개선 방법\n- 코드 리팩토링 경험",
            f"\n## 추가 학습 자료\n\n더 깊이 공부하기 위해 다음 자료들을 참고할 예정이다:\n\n- 공식 문서\n- 유명 블로그 포스팅\n- YouTube 강의\n- 관련 서적",
            f"\n## 느낀 점\n\n{topic}를 공부하면서 많은 것을 배웠다. 처음에는 어렵게 느껴졌지만, 차근차근 학습하니 이해가 되었다. 실무에서 활용할 수 있을 것 같아 기대된다. 앞으로도 꾸준히 학습하고 실습해야겠다.",
            f"\n## 다음 학습 계획\n\n- 고급 기능 학습\n- 실전 프로젝트 적용\n- 성능 최적화 연구\n- 관련 기술 스택 확장",
            f"\n#{topic} #TIL #개발공부 #취준생 #학습정리"
        ]
        
        content = "\n".join(sections)
        
        # SQL 생성 (작은 따옴표 이스케이프)
        content_escaped = content.replace("'", "''")
        title_escaped = title.replace("'", "''")
        
        # datetime 형식으로 변환 (시간도 추가)
        hour = random.randint(18, 23)  # TIL은 보통 저녁에 작성
        minute = random.randint(0, 59)
        til_datetime = f"{til_date_str} {hour:02d}:{minute:02d}:00"
        
        community_sql.append(
            f"({account_id}, '{title_escaped}', '{content_escaped}', {random.randint(0, 50)}, 0, FALSE, '{til_datetime}', NULL, NULL)"
        )
        
        # 태그 추가
        tags = [topic, "TIL", "개발공부", "학습정리"]
        for tag in tags:
            tag_sql.append(f"({community_id}, '{tag}')")
        
        community_id += 1

# SQL 파일 생성
output = []
output.append("-- ========================================")
output.append("-- Community TIL 데이터 삽입")
output.append("-- 생성일: 2026-01-31")
output.append("-- 설명: 46명 유저의 TIL 글 (각 5~8개)")
output.append("-- community_code=0 (TIL)")
output.append("-- 중요: TIL 작성 날짜는 각 유저의 streak 활동 날짜와 일치")
output.append("-- ========================================\n")
output.append("INSERT INTO community (account_id, title, content, view, community_code, is_hot, created_at, updated_at, deleted_at) VALUES")
output.append(",\n".join(community_sql))
output.append(";\n\n")

output.append("-- ========================================")
output.append("-- Community Tag 데이터")
output.append("-- ========================================\n")
output.append("INSERT INTO community_tag (community_id, name) VALUES")
output.append(",\n".join(tag_sql))
output.append(";")

with open('V20260131171000__insert_til_data.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f"\n✅ TIL 데이터 생성 완료!")
print(f"총 {len(community_sql)}개의 TIL 생성")
print(f"총 {len(tag_sql)}개의 태그 생성")
print(f"평균 {len(community_sql) / 46:.1f}개 TIL per user")
print(f"\n✨ 모든 TIL 날짜는 해당 유저의 streak 활동 날짜와 일치합니다!")
