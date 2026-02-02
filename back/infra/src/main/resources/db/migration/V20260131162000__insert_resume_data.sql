-- ========================================
-- Resume 이력 데이터 삽입
-- 생성일: 2026-01-31
-- 설명: 29명 유저의 경력 이력 (어드민 제외)
-- ========================================

-- Account 4,5,6: 테스트 유저 (간단한 이력만)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(4, '삼성전자', '소프트웨어 인턴', '2024-07-01', '2024-08-31'),
(5, 'LG전자', 'QA 인턴', '2024-06-01', '2024-08-31'),
(6, '네이버', '개발 인턴', '2024-01-01', '2024-02-29');

-- Account 7,8,9: 탈퇴 유저 (과거 이력)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(7, '카카오', '백엔드 개발자', '2022-03-01', '2024-12-31'),
(8, '토스', '프론트엔드 개발자', '2021-06-01', '2023-12-31'),
(9, '쿠팡', 'DevOps 엔지니어', '2023-01-01', '2024-11-30');

-- Account 10: 김지훈 - 신입 개발자 (부트캠프, 인턴 경험)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(10, '코드스테이츠', '백엔드 부트캠프 수료', '2024-06-01', '2024-12-31'),
(10, '스타트업 A사', '개발 인턴', '2025-01-01', '2025-03-31');

-- Account 11: 이서연 - 주니어 FE (1년 경력)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(11, '위메프', 'React 개발자', '2024-01-01', '2024-12-31'),
(11, '벤처기업 디지털솔루션', '프론트엔드 개발자', '2025-01-01', NULL);

-- Account 12: 박민준 - 백엔드 3년차
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(12, '우아한형제들', 'Spring Boot 백엔드 개발자', '2022-03-01', '2024-06-30'),
(12, '당근마켓', 'Senior Backend Engineer', '2024-07-01', NULL);

-- Account 13: 최유진 - 데이터 분석가 전환 (마케팅 → 데이터)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(13, 'CJ ENM', '마케팅 데이터 분석가', '2021-04-01', '2023-12-31'),
(13, '삼성SDS', 'Data Analyst', '2024-01-01', '2025-03-31');

-- Account 14: 정도윤 - 풀스택 5년차
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(14, '스타트업 테크컴퍼니', '풀스택 개발자', '2020-01-01', '2022-12-31'),
(14, '라인플러스', 'Full Stack Engineer', '2023-01-01', '2024-06-30'),
(14, '쿠팡', 'Senior Full Stack Developer', '2024-07-01', NULL);

-- Account 15: 강하은 - UI/UX 디자이너
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(15, '디자인스튜디오', 'UI/UX 디자이너', '2021-06-01', '2023-05-31'),
(15, '토스', 'Product Designer', '2023-06-01', NULL);

-- Account 16: 윤서준 - 대학생 (인턴/프로젝트만)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(16, '네이버 부스트캠프', '웹 풀스택 과정 수료', '2024-07-01', '2024-12-31'),
(16, 'IT 스타트업', '개발 인턴', '2025-01-02', '2025-02-28');

-- Account 17: 임수아 - 마케터→PM 전환
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(17, 'SK텔레콤', '디지털 마케터', '2020-03-01', '2023-12-31'),
(17, '카카오엔터프라이즈', 'Product Manager', '2024-01-01', NULL);

-- Account 18: 한지우 - 시니어 10년차
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(18, '삼성전자', 'Software Engineer', '2015-01-01', '2018-12-31'),
(18, '네이버', 'Senior Backend Developer', '2019-01-01', '2022-06-30'),
(18, '카카오', 'Tech Lead', '2022-07-01', NULL);

-- Account 19: 서예준 - 창업 준비 (과거 경력)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(19, '쿠팡', 'Product Manager', '2021-04-01', '2023-12-31'),
(19, '스타트업 A사', 'Co-founder & CTO', '2024-01-01', NULL);

-- Account 20: 조아인 - 신입 QA
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(20, 'NC소프트', 'QA 인턴', '2024-07-01', '2024-12-31'),
(20, '넷마블', 'QA Engineer', '2025-01-01', NULL);

-- Account 21: 신태양 - DevOps 4년차
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(21, '우아한형제들', 'DevOps Engineer', '2021-03-01', '2023-12-31'),
(21, '토스', 'Senior DevOps Engineer', '2024-01-01', NULL);

-- Account 22: 배수빈 - 보안 지망생 (학부생, 인턴)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(22, 'KITRI 차세대보안리더', 'BoB 과정 수료', '2024-07-01', '2024-12-31'),
(22, '보안기업 시큐어스', '보안 인턴', '2025-01-01', '2025-06-30');

-- Account 23: 노시현 - 게임 기획자 5년
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(23, '넥슨코리아', 'Game Planner', '2020-03-01', '2022-12-31'),
(23, '크래프톤', 'Senior Game Designer', '2023-01-01', NULL);

-- Account 24: 홍다은 - 신입 데이터 사이언티스트 (석사)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(24, 'KAIST', '석사 과정 (머신러닝)', '2023-03-01', '2025-02-28'),
(24, '네이버 AI Lab', 'Data Scientist', '2025-03-01', NULL);

-- Account 25: 송민석 - 클라우드 아키텍트
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(25, 'LG CNS', 'Cloud Engineer', '2018-01-01', '2021-12-31'),
(25, '삼성SDS', 'Cloud Architect', '2022-01-01', NULL);

-- Account 26: 문채원 - AI 연구원 (박사과정)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(26, 'KAIST AI대학원', '박사 과정 (딥러닝)', '2022-03-01', NULL),
(26, '삼성리서치', 'AI 연구 인턴', '2024-06-01', '2024-08-31');

-- Account 27: 안지훈 - 모바일 앱 개발자
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(27, '카카오모빌리티', 'iOS Developer', '2021-06-01', '2023-12-31'),
(27, '배달의민족', 'Mobile App Developer', '2024-01-01', NULL);

-- Account 28: 오서윤 - 블록체인 개발자
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(28, 'Upbit (두나무)', 'Blockchain Developer', '2022-09-01', '2024-12-31'),
(28, 'DeFi 스타트업', 'Senior Blockchain Engineer', '2025-01-01', NULL);

-- Account 29: 황준서 - 리드 개발자 12년차
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(29, 'SK플래닛', 'Software Engineer', '2013-03-01', '2016-12-31'),
(29, '네이버', 'Senior Developer', '2017-01-01', '2020-06-30'),
(29, '카카오', 'Tech Lead', '2020-07-01', '2023-12-31'),
(29, '쿠팡', 'Engineering Manager', '2024-01-01', NULL);
