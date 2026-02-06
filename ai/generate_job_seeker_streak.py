import random
from datetime import datetime, timedelta

# 날짜 범위: 2025-01-01 ~ 2026-01-31
start_date = datetime(2025, 1, 1)
end_date = datetime(2026, 1, 31)
total_days = (end_date - start_date).days + 1

# 취준생 유저 30~49
account_ids = list(range(30, 50))

# 각 유저별 패턴 (취준생은 중간~높은 활동)
user_patterns = {
    30: 0.65,  # 이준혁 - 컴공 4학년
    31: 0.7,   # 박서영 - 부트캠프 수료생
    32: 0.6,   # 김도현 - 비전공 국비교육
    33: 0.55,  # 정민지 - 재직 중 이직
    34: 0.65,  # 최우진 - 해외 석사
    35: 0.75,  # 강예은 - SW 마에스트로
    36: 0.8,   # 윤재민 - GitHub 기여자
    37: 0.7,   # 서한별 - 알고리즘 대회
    38: 0.6,   # 임지호 - 디자인→FE
    39: 0.55,  # 한소율 - 마케팅→기획
    40: 0.5,   # 조민성 - N수생
    41: 0.65,  # 신유나 - 부트캠프 재수강
    42: 0.6,   # 백승환 - 대학원생
    43: 0.7,   # 노현우 - 전역 후
    44: 0.65,  # 홍지민 - 인턴 후
    45: 0.6,   # 송다은 - 프리랜서
    46: 0.55,  # 문태윤 - 스타트업
    47: 0.7,   # 안서준 - 게임 개발
    48: 0.75,  # 오채원 - AI/ML
    49: 0.7,   # 황시우 - 풀스택
}

# 활동 데이터 생성
all_streaks = {}

for account_id in account_ids:
    pattern = user_patterns[account_id]
    user_streaks = []
    
    for day_offset in range(total_days):
        current_date = start_date + timedelta(days=day_offset)
        
        if random.random() < pattern:
            daily_count = random.randint(1, 10)
            hour = random.randint(8, 22)
            minute = random.randint(0, 59)
            created_at = current_date.replace(hour=hour, minute=minute)
            
            user_streaks.append({
                'account_id': account_id,
                'activity_date': current_date.strftime('%Y-%m-%d'),
                'daily_count': daily_count,
                'created_at': created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
    
    all_streaks[account_id] = user_streaks
    print(f"Account {account_id}: {len(user_streaks)} activities")

# SQL 생성
sql_lines = []
sql_lines.append("-- ========================================")
sql_lines.append("-- 취준생 Streak 활동 기록 데이터")
sql_lines.append("-- 생성일: 2026-01-31")
sql_lines.append("-- 설명: 취준생 유저 30~49의 2025~2026 활동 기록")
sql_lines.append("-- ========================================\n")

for account_id in account_ids:
    streaks = all_streaks[account_id]
    if len(streaks) > 0:
        sql_lines.append(f"-- Account ID {account_id}: {len(streaks)} activities")
        sql_lines.append("INSERT INTO streak (account_id, activity_date, daily_count, created_at) VALUES")
        
        values = []
        for streak in streaks:
            values.append(f"({streak['account_id']}, '{streak['activity_date']}', {streak['daily_count']}, '{streak['created_at']}')")
        
        sql_lines.append(",\n".join(values) + ";\n")

# STREAK_STATUS 계산
sql_lines.append("-- ========================================")
sql_lines.append("-- STREAK_STATUS 데이터")
sql_lines.append("-- ========================================\n")
sql_lines.append("INSERT INTO streak_status (account_id, current_streak, longest_streak, last_activity_date, created_at) VALUES")

status_values = []

for account_id in account_ids:
    streaks = all_streaks[account_id]
    if len(streaks) == 0:
        continue
    
    activity_dates = sorted([datetime.strptime(s['activity_date'], '%Y-%m-%d') for s in streaks])
    
    # current_streak 계산
    current_streak = 0
    today = datetime(2026, 1, 31)
    current_check_date = today
    
    for i in range(365):
        if current_check_date in activity_dates:
            current_streak += 1
            current_check_date -= timedelta(days=1)
        else:
            break
    
    # longest_streak 계산
    longest_streak = 0
    temp_streak = 1
    
    for i in range(1, len(activity_dates)):
        if (activity_dates[i] - activity_dates[i-1]).days == 1:
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 1
    
    longest_streak = max(longest_streak, temp_streak, current_streak)
    last_activity_date = activity_dates[-1].strftime('%Y-%m-%d')
    
    status_values.append(f"({account_id}, {current_streak}, {longest_streak}, '{last_activity_date}', NOW())")

sql_lines.append(",\n".join(status_values) + ";")

# 파일 저장
output_file = 'V20260131164000__insert_job_seeker_streak.sql'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print(f"\nSQL file generated: {output_file}")
print(f"Total users: {len(account_ids)}")
print(f"Total activities: {sum(len(s) for s in all_streaks.values())}")
