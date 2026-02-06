# 팔로우 관계 SQL 생성기
# 중복 방지 및 맞팔 관계 명확히 처리

# 팔로우 관계 저장 (follower_id, followee_id)
# A가 B를 팔로우 = (A, B)
# 맞팔 = (A, B) + (B, A)

follows = set()  # 중복 방지용 set

def add_follow(follower, followee):
    """팔로우 관계 추가 (중복 방지)"""
    if follower != followee:  # 자기 자신 팔로우 방지
        follows.add((follower, followee))

def add_mutual(user1, user2):
    """맞팔 관계 추가"""
    add_follow(user1, user2)
    add_follow(user2, user1)

# ========== 백엔드 클러스터 ==========
# 박민준(3) - 시니어
add_follow(1, 3)
add_follow(5, 3)
add_follow(9, 3)
add_follow(12, 3)
add_follow(30, 3)
add_follow(32, 3)
add_follow(34, 3)
add_follow(49, 3)

# 정도윤(5) - 풀스택
add_follow(1, 5)
add_follow(2, 5)
add_mutual(3, 5)  # 박민준 ↔ 정도윤
add_follow(9, 5)
add_follow(18, 5)
add_follow(30, 5)
add_follow(31, 5)
add_follow(32, 5)
add_follow(38, 5)
add_follow(49, 5)

# 한지우(9) - 시니어 10년차
add_follow(1, 9)
add_follow(2, 9)
add_mutual(3, 9)  # 박민준 ↔ 한지우
add_mutual(5, 9)  # 정도윤 ↔ 한지우
add_follow(7, 9)
add_follow(12, 9)
add_mutual(20, 9)  # 황준서 ↔ 한지우
add_follow(30, 9)
add_follow(31, 9)
add_follow(32, 9)
add_follow(34, 9)
add_follow(36, 9)
add_follow(37, 9)
add_follow(42, 9)
add_follow(49, 9)

# 황준서(20) - 리드 12년차
add_follow(1, 20)
add_follow(3, 20)
add_follow(5, 20)
# (9, 20) 이미 위에서 맞팔
add_follow(12, 20)
add_follow(16, 20)
add_follow(18, 20)
add_follow(30, 20)
add_follow(31, 20)
add_follow(32, 20)
add_follow(34, 20)
add_follow(36, 20)
add_follow(40, 20)
add_follow(42, 20)
add_follow(49, 20)

# ========== 프론트엔드 클러스터 ==========
# 이서연(2)
add_mutual(1, 2)  # 김지훈 ↔ 이서연
# (5, 2) 이미 위에서
add_follow(6, 2)
add_follow(7, 2)
add_follow(30, 2)
add_follow(31, 2)
add_follow(35, 2)
add_follow(38, 2)
add_follow(49, 2)

# 임지호(38)
add_mutual(2, 38)  # 이서연 ↔ 임지호
add_follow(6, 38)
add_follow(31, 38)
add_follow(35, 38)
add_follow(39, 38)
add_follow(49, 38)

# 강하은(6)
add_mutual(2, 6)  # 이서연 ↔ 강하은
add_follow(8, 6)
add_follow(14, 6)
add_follow(31, 6)
add_follow(35, 6)
add_mutual(38, 6)  # 임지호 ↔ 강하은
add_follow(39, 6)
add_follow(47, 6)

# ========== 데이터/AI 클러스터 ==========
# 최유진(4)
add_follow(15, 4)
add_follow(17, 4)
add_follow(30, 4)
add_follow(32, 4)
add_follow(42, 4)
add_follow(48, 4)

# 홍다은(15)
add_mutual(4, 15)  # 최유진 ↔ 홍다은
add_follow(17, 15)
add_follow(42, 15)
add_follow(48, 15)

# 문채원(17)
add_mutual(4, 17)  # 최유진 ↔ 문채원
add_mutual(15, 17)  # 홍다은 ↔ 문채원
add_follow(42, 17)
add_follow(48, 17)

# 오채원(48)
add_mutual(4, 48)  # 최유진 ↔ 오채원
add_mutual(15, 48)  # 홍다은 ↔ 오채원
add_mutual(17, 48)  # 문채원 ↔ 오채원
add_follow(42, 48)

# ========== DevOps/인프라 클러스터 ==========
# 신태양(12)
add_mutual(3, 12)  # 박민준 ↔ 신태양
add_follow(5, 12)
add_mutual(9, 12)  # 한지우 ↔ 신태양
add_follow(16, 12)
add_follow(30, 12)
add_follow(32, 12)
add_follow(34, 12)

# 송민석(16)
add_follow(3, 16)
add_follow(5, 16)
add_mutual(9, 16)  # 한지우 ↔ 송민석
add_mutual(12, 16)  # 신태양 ↔ 송민석
add_mutual(20, 16)  # 황준서 ↔ 송민석
add_follow(30, 16)
add_follow(32, 16)
add_follow(34, 16)

# ========== 모바일 클러스터 ==========
# 안지훈(18)
add_follow(1, 18)
add_mutual(5, 18)  # 정도윤 ↔ 안지훈
add_follow(30, 18)
add_follow(31, 18)
add_follow(32, 18)
add_follow(49, 18)

# ========== 보안/블록체인 클러스터 ==========
# 배수빈(13)
add_follow(1, 13)
add_follow(9, 13)
add_follow(19, 13)
add_follow(30, 13)
add_follow(34, 13)

# 오서윤(19)
add_follow(1, 19)
add_follow(9, 19)
add_mutual(13, 19)  # 배수빈 ↔ 오서윤
add_follow(30, 19)
add_follow(34, 19)

# ========== 게임 개발 클러스터 ==========
# 노시현(14)
add_mutual(6, 14)  # 강하은 ↔ 노시현
add_follow(8, 14)
add_follow(39, 14)
add_follow(47, 14)

# 안서준(47)
add_mutual(14, 47)  # 노시현 ↔ 안서준
add_follow(18, 47)
add_follow(31, 47)

# ========== PM/기획자 클러스터 ==========
# 임수아(8)
add_mutual(6, 8)  # 강하은 ↔ 임수아
add_follow(10, 8)
add_mutual(14, 8)  # 노시현 ↔ 임수아
add_follow(39, 8)

# 한소율(39)
add_mutual(6, 39)  # 강하은 ↔ 한소율
add_mutual(8, 39)  # 임수아 ↔ 한소율
add_mutual(14, 39)  # 노시현 ↔ 한소율
add_follow(31, 39)

# ========== QA 클러스터 ==========
# 조아인(11)
add_follow(3, 11)
add_follow(5, 11)
add_follow(9, 11)
add_follow(30, 11)
add_follow(31, 11)

# ========== 스타트업 클러스터 ==========
# 서예준(10)
add_follow(3, 10)
add_follow(5, 10)
add_mutual(8, 10)  # 임수아 ↔ 서예준
add_follow(9, 10)
add_follow(20, 10)
add_follow(46, 10)

# 문태윤(46)
add_mutual(10, 46)  # 서예준 ↔ 문태윤
add_follow(33, 46)
add_follow(45, 46)

# ========== 신입 지망생 ==========
# 김지훈(1) - 이미 위에서 많이 추가됨
add_follow(7, 1)
add_follow(30, 1)
add_follow(31, 1)
add_follow(32, 1)

# 윤서준(7)
add_mutual(1, 7)  # 김지훈 ↔ 윤서준
add_follow(2, 7)
# (9, 7) 이미 위에서
add_follow(30, 7)
add_follow(31, 7)
add_follow(32, 7)

# 이준혁(30) - 이미 많이 추가됨
add_mutual(7, 30)  # 윤서준 ↔ 이준혁
add_follow(31, 30)
add_follow(32, 30)
add_follow(34, 30)
add_follow(35, 30)
add_follow(49, 30)

# 박서영(31) - 이미 많이 추가됨
add_mutual(7, 31)  # 윤서준 ↔ 박서영
add_mutual(30, 31)  # 이준혁 ↔ 박서영
add_follow(32, 31)
add_follow(35, 31)
add_mutual(38, 31)  # 임지호 ↔ 박서영
add_follow(49, 31)

# 김도현(32) - 이미 많이 추가됨
add_mutual(7, 32)  # 윤서준 ↔ 김도현
add_mutual(30, 32)  # 이준혁 ↔ 김도현
add_mutual(31, 32)  # 박서영 ↔ 김도현
add_follow(40, 32)
add_follow(41, 32)
add_follow(49, 32)

# 정민지(33)
add_follow(33, 3)
add_follow(33, 5)
add_follow(33, 9)
add_follow(33, 20)
add_follow(33, 45)
add_mutual(33, 46)  # 정민지 ↔ 문태윤

# 최우진(34)
add_mutual(30, 34)  # 이준혁 ↔ 최우진
add_follow(31, 34)
add_follow(32, 34)
add_follow(42, 34)

# 강예은(35)
add_mutual(30, 35)  # 이준혁 ↔ 강예은
add_mutual(31, 35)  # 박서영 ↔ 강예은
add_mutual(38, 35)  # 임지호 ↔ 강예은
add_follow(49, 35)

# 윤재민(36)
add_follow(36, 3)
add_follow(36, 5)
add_mutual(36, 9)  # 윤재민 ↔ 한지우
add_follow(36, 19)
add_mutual(36, 20)  # 윤재민 ↔ 황준서
add_follow(30, 36)
add_follow(34, 36)
add_follow(37, 36)

# 서한별(37)
add_follow(37, 3)
add_follow(37, 5)
add_mutual(37, 9)  # 서한별 ↔ 한지우
add_follow(37, 20)
add_mutual(36, 37)  # 윤재민 ↔ 서한별
add_follow(30, 37)
add_follow(42, 37)

# 조민성(40)
add_follow(40, 3)
add_follow(40, 5)
add_follow(40, 9)
add_mutual(40, 20)  # 조민성 ↔ 황준서
add_mutual(32, 40)  # 김도현 ↔ 조민성
add_follow(41, 40)

# 신유나(41)
add_follow(41, 2)
add_follow(41, 5)
add_follow(41, 6)
add_follow(41, 31)
add_follow(41, 35)
add_mutual(32, 41)  # 김도현 ↔ 신유나
add_mutual(40, 41)  # 조민성 ↔ 신유나

# 백승환(42)
add_mutual(34, 42)  # 최우진 ↔ 백승환
add_mutual(37, 42)  # 서한별 ↔ 백승환
add_mutual(48, 42)  # 오채원 ↔ 백승환

# 노현우(43)
add_follow(43, 3)
add_follow(43, 9)
add_follow(43, 12)
add_follow(43, 18)
add_follow(43, 30)
add_mutual(30, 43)  # 이준혁 ↔ 노현우
add_follow(32, 43)

# 홍지민(44)
add_follow(44, 2)
add_follow(44, 3)
add_follow(44, 5)
add_follow(44, 6)
add_follow(44, 11)
add_follow(31, 44)
add_follow(35, 44)

# 송다은(45)
add_follow(45, 2)
add_follow(45, 6)
add_follow(45, 8)
add_mutual(33, 45)  # 정민지 ↔ 송다은
add_mutual(45, 46)  # 송다은 ↔ 문태윤

# 황시우(49) - 이미 많이 추가됨
add_mutual(30, 49)  # 이준혁 ↔ 황시우
add_mutual(31, 49)  # 박서영 ↔ 황시우
add_mutual(32, 49)  # 김도현 ↔ 황시우
add_mutual(35, 49)  # 강예은 ↔ 황시우
add_mutual(38, 49)  # 임지호 ↔ 황시우

# 크로스 직무 팔로우 (추가 다양성)
add_follow(2, 3)
add_follow(2, 12)
add_follow(4, 16)
add_follow(5, 6)
add_follow(5, 8)
add_follow(7, 3)
add_follow(7, 5)
add_follow(8, 2)
add_mutual(10, 3)  # 서예준 ↔ 박민준
add_mutual(10, 9)  # 서예준 ↔ 한지우
add_follow(11, 2)
add_follow(13, 16)
add_follow(14, 2)
add_follow(17, 9)
add_follow(18, 3)
add_follow(19, 16)

# SQL 생성
sql_lines = []
sql_lines.append("-- " + "="*60)
sql_lines.append("-- 팔로우 관계 데이터 (FIXED)")
sql_lines.append("-- 생성일: 2026-02-02")
sql_lines.append("-- 중복 제거 완료, 맞팔 로직 명확화")
sql_lines.append("-- " + "="*60)
sql_lines.append("")

# 리스트로 변환 및 정렬
follow_list = sorted(list(follows), key=lambda x: (x[0], x[1]))

sql_lines.append(f"-- 총 {len(follow_list)}개의 팔로우 관계")
sql_lines.append("")

# INSERT 생성 (배치로)
batch_size = 50
for i in range(0, len(follow_list), batch_size):
    batch = follow_list[i:i+batch_size]
    sql_lines.append(f"-- Batch {i//batch_size + 1}")
    sql_lines.append("INSERT INTO follow (follower_id, followee_id) VALUES")
    
    for j, (follower, followee) in enumerate(batch):
        is_last = (j == len(batch) - 1)
        comma = ";" if is_last else ","
        sql_lines.append(f"({follower}, {followee}){comma}")
    
    sql_lines.append("")

sql_lines.append("-- " + "="*60)
sql_lines.append("-- END")
sql_lines.append("-- " + "="*60)

# 파일 저장
with open('follow_relationships.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print(f"Generated {len(follow_list)} follow relationships")
print(f"No duplicates, proper mutual follows")

