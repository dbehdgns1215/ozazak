-- ========================================
-- 취준생 Resume 이력 데이터 삽입
-- 생성일: 2026-01-31
-- 설명: 취준생 유저 30~49의 경력 이력
-- ========================================

-- Account 30: 이준혁 - 컴공 4학년 (졸업 프로젝트 진행 중)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(30, '성균관대학교', '컴퓨터공학과 재학', '2021-03-01', '2025-02-28'),
(30, '네이버 부스트캠프', '웹 풀스택 과정', '2024-07-01', '2024-12-31');

-- Account 31: 박서영 - 싸피 수료생
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(31, '싸피 14기', '부트캠프', '2024-06-01', '2024-12-31'),
(31, '스타트업 테크베이스', '백엔드 개발 인턴', '2025-01-02', '2025-03-31');

-- Account 32: 김도현 - 비전공자 국비교육
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(32, 'KH정보교육원', 'Java 웹 개발 과정', '2024-03-01', '2024-09-30'),
(32, 'IT 스타트업', '개발 인턴', '2024-10-01', '2024-12-31');

-- Account 33: 정민지 - 재직 중 이직 준비
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(33, '중소 SI 기업', 'Java 개발자', '2023-01-01', NULL);

-- Account 34: 최우진 - 해외 석사 졸업 후 귀국
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(34, 'Carnegie Mellon University', 'Master of Computer Science', '2023-09-01', '2025-05-31'),
(34, 'Google (인턴)', 'Software Engineering Intern', '2024-06-01', '2024-08-31');

-- Account 35: 강예은 - 싸피 수료생
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(35, '싸피 13기', '부트캠프', '2024-04-01', '2024-12-31'),
(35, '공모전 수상', '스마트해커톤 대상 수상', '2024-11-01', '2024-11-30');

-- Account 36: 윤재민 - GitHub 오픈소스 기여자
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(36, '오픈소스 기여', 'React, Next.js 컨트리뷰터', '2023-01-01', NULL),
(36, '42서울', 'Software Engineering 과정', '2023-03-01', '2024-12-31');

-- Account 37: 서한별 - 알고리즘 대회 참가자
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(37, 'ICPC', 'ACM-ICPC Regional 본선 진출', '2024-11-01', '2024-11-30'),
(37, '삼성전자', 'SW 알고리즘 특기자 전형', '2025-01-01', '2025-01-31');

-- Account 38: 임지호 - 디자인 → 프론트엔드 전환
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(38, '홍익대학교', '시각디자인과 졸업', '2020-03-01', '2024-02-28'),
(38, '패스트캠퍼스', '프론트엔드 개발 부트캠프', '2024-06-01', '2024-12-31');

-- Account 39: 한소율 - 마케팅 → IT 기획자
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(39, '이화여대', '경영학과 졸업', '2019-03-01', '2023-02-28'),
(39, '광고대행사', '디지털 마케터', '2023-03-01', '2024-12-31'),
(39, '그로스해킹 스쿨', 'PM/PO 부트캠프', '2025-01-02', '2025-03-31');

-- Account 40: 조민성 - N수생 (3년차)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(40, '한양대학교', '소프트웨어학부 재학', '2020-03-01', '2024-02-28'),
(40, '코딩테스트 스터디', 'Algorithm Study (3년)', '2022-01-01', NULL);

-- Account 41: 신유나 - 부트캠프 재수강
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(41, '엘리스트랙', 'AI 트랙 1기', '2023-06-01', '2023-12-31'),
(41, '엘리스트랙', 'SW 엔지니어 트랙 2기', '2024-06-01', '2024-12-31');

-- Account 42: 백승환 - 대학원생 (연구+취업)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(42, 'KAIST', '전산학부 석사과정', '2024-03-01', NULL),
(42, '삼성리서치', '연구 인턴', '2024-06-01', '2024-08-31');

-- Account 43: 노현우 - 전역 후 취업 준비 (6개월)
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(43, '육군', '병장 만기전역', '2022-10-01', '2024-07-01'),
(43, '프로그래머스', 'DevCourse 백엔드', '2024-09-01', '2025-02-28');

-- Account 44: 홍지민 - 인턴 후 정규직 준비
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(44, '카카오', '개발 인턴', '2024-06-01', '2024-08-31'),
(44, '토스', '개발 인턴', '2024-12-01', '2025-02-28');

-- Account 45: 송다은 - 프리랜서 → 정규직
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(45, '프리랜서', 'React 프론트엔드 개발', '2023-06-01', '2024-12-31'),
(45, '외주 프로젝트 5건', '쇼핑몰, 관리자페이지 등', '2023-06-01', '2024-12-31');

-- Account 46: 문태윤 - 소규모 스타트업 → 대기업
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(46, '스타트업 A사', '백엔드 개발자', '2024-01-01', '2024-12-31');

-- Account 47: 안서준 - 게임 개발자 준비생
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(47, '디지펜 코리아', 'Game Programming 과정', '2023-03-01', '2024-12-31'),
(47, '인디 게임 개발', '1인 개발 프로젝트 Steam 출시', '2024-06-01', '2024-12-31');

-- Account 48: 오채원 - AI/ML 공부 중
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(48, '서울대학교', '통계학과 졸업', '2020-03-01', '2024-02-28'),
(48, '네이버 부스트캠프', 'AI Tech 과정', '2024-07-01', '2024-12-31'),
(48, 'Kaggle Competition', 'Kaggle Expert 등급', '2024-01-01', NULL);

-- Account 49: 황시우 - 풀스택 웹 개발 준비생
INSERT INTO resume (account_id, title, content, started_at, ended_at) VALUES
(49, '제로베이스', '풀스택 개발자 부트캠프', '2024-03-01', '2024-09-30'),
(49, 'IT 벤처기업', '웹 개발 인턴', '2024-10-01', '2024-12-31');
