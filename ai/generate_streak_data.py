import random
from datetime import datetime, timedelta

# 날짜 범위: 2025-01-01 ~ 2026-01-31
start_date = datetime(2025, 1, 1)
end_date = datetime(2026, 1, 31)
total_days = (end_date - start_date).days + 1

# 29명의 유저 (탈퇴 유저 포함)
account_ids = list(range(1, 30))

# 각 유저별 페르소나 패턴 (활동 확률)
# 0.0 ~ 1.0 사이 값, 높을수록 활동이 많음
user_patterns = {
    1: 0.8,   # 어드민 - 매우 활발
    2: 0.6,   # 어드민2 - 중간
    3: 0.4,   # 어드민3 - 적음
    4: 0.3,   # 테스트 유저
    5: 0.3,
    6: 0.3,
    7: 0.4,   # 탈퇴 유저도 과거 활동 있음
    8: 0.35,
    9: 0.35,
    10: 0.7,  # 김지훈 - 신입, 꾸준함
    11: 0.65, # 이서연 - 주니어
    12: 0.85, # 박민준 - 백엔드 경력
    13: 0.45, # 최유진 - 전환 중
    14: 0.75, # 정도윤 - 풀스택
    15: 0.55, # 강하은 - 디자이너
    16: 0.6,  # 윤서준 - 대학생
    17: 0.5,  # 임수아 - PM 전환
    18: 0.7,  # 한지우 - 시니어
    19: 0.45, # 서예준 - 창업
    20: 0.65, # 조아인 - QA
    21: 0.75, # 신태양 - DevOps
    22: 0.7,  # 배수빈 - 보안
    23: 0.5,  # 노시현 - 게임
    24: 0.6,  # 홍다은 - DS
    25: 0.8,  # 송민석 - 클라우드
    26: 0.65, # 문채원 - AI
    27: 0.7,  # 안지훈 - 모바일
    28: 0.6,  # 오서윤 - 블록체인
    29: 0.85, # 황준서 - 리드
}

# 각 유저별 활동 데이터 생성
all_streaks = {}

for account_id in account_ids:
    pattern = user_patterns[account_id]
    user_streaks = []
    
    for day_offset in range(total_days):
        current_date = start_date + timedelta(days=day_offset)
        
        # 패턴에 따라 활동 여부 결정 (확률적)
        if random.random() < pattern:
            # 활동 횟수 (1~10)
            daily_count = random.randint(1, 10)
            
            # 시간도 랜덤하게
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
    print(f"Account {account_id}: {len(user_streaks)} activities generated")

# SQL 생성 - STREAK 테이블
sql_lines = []
sql_lines.append("-- ========================================")
sql_lines.append("-- Streak 활동 기록 데이터 삽입")
sql_lines.append("-- 생성일: 2026-01-31")
sql_lines.append("-- 설명: 29명 유저의 2025년~2026년 1월 31일까지 활동 기록")
sql_lines.append("-- ========================================\n")
sql_lines.append("-- ========================================")
sql_lines.append("-- 1. STREAK 테이블 데이터 (일별 활동 기록)")
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
sql_lines.append("-- 2. STREAK_STATUS 테이블 데이터 (스트릭 요약)")
sql_lines.append("-- ========================================\n")
sql_lines.append("INSERT INTO streak_status (account_id, current_streak, longest_streak, last_activity_date, created_at) VALUES")

status_values = []

for account_id in account_ids:
    streaks = all_streaks[account_id]
    if len(streaks) == 0:
        continue
    
    # 활동 날짜를 datetime으로 변환하여 정렬
    activity_dates = sorted([datetime.strptime(s['activity_date'], '%Y-%m-%d') for s in streaks])
    
    if len(activity_dates) == 0:
        continue
    
    # 연속 스트릭 계산
    current_streak = 0
    longest_streak = 0
    temp_streak = 1
    
    # 마지막 날짜부터 거슬러 올라가며 current_streak 계산
    today = datetime(2026, 1, 31)
    current_check_date = today
    
    # 오늘(1/31)부터 거슬러 올라가며 연속 확인
    for i in range(365):  # 최대 365일 확인
        if current_check_date in activity_dates:
            current_streak += 1
            current_check_date -= timedelta(days=1)
        else:
            break
    
    # longest_streak 계산 (전체 기간에서 최대 연속)
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

# 파일에 저장
output_file = 'V20260131153000__insert_streak_data.sql'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print(f"\n✅ SQL file generated: {output_file}")
print(f"Total users: {len(account_ids)}")
print(f"Total activities: {sum(len(s) for s in all_streaks.values())}")
