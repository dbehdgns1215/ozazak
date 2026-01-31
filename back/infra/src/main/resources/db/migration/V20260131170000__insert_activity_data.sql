-- ========================================
-- Activity 데이터 삽입 (자격증/수상내역)
-- 생성일: 2026-01-31
-- 설명: 49명 유저의 자격증 및 수상내역
-- code: 1=수상, 2=자격증
-- ========================================

-- Account 1,2,3: 어드민 (자격증만 소수)
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(1, '정보처리기사', 2, NULL, '한국산업인력공단', '2020-05-15'),
(2, 'AWS Solutions Architect Associate', 2, NULL, 'Amazon Web Services', '2021-03-20'),
(3, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2019-12-10');

-- Account 4,5,6: 테스트 유저 (신입급)
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(4, '정보처리기사', 2, NULL, '한국산업인력공단', '2024-11-30'),
(5, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2024-06-15'),
(6, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2024-09-20');

-- Account 7: 탈퇴 유저 - 백엔드 경력자
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(7, '정보처리기사', 2, NULL, '한국산업인력공단', '2021-08-20'),
(7, 'AWS Solutions Architect Professional', 2, NULL, 'Amazon Web Services', '2023-06-15'),
(7, '카카오 해커톤', 1, '우수상', '카카오', '2023-11-10');

-- Account 8: 탈퇴 유저 - 프론트엔드
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(8, '정보처리기사', 2, NULL, '한국산업인력공단', '2021-05-20'),
(8, 'JavaScript 알고리즘 대회', 1, '2위', 'Codewars', '2022-09-15');

-- Account 9: 탈퇴 유저 - DevOps
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(9, 'AWS DevOps Engineer Professional', 2, NULL, 'Amazon Web Services', '2023-04-10'),
(9, 'CKA (Certified Kubernetes Administrator)', 2, NULL, 'CNCF', '2023-08-20');

-- Account 10: 김지훈 - 신입 개발자
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(10, '정보처리기사', 2, NULL, '한국산업인력공단', '2024-11-30'),
(10, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2024-06-20'),
(10, '삼성 청년 SW 아카데미 해커톤', 1, '우수상', '삼성', '2024-11-15');

-- Account 11: 이서연 - 주니어 FE
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(11, '정보처리기사', 2, NULL, '한국산업인력공단', '2023-11-30'),
(11, 'React 개발자 대회', 1, '장려상', 'React Korea', '2024-05-10');

-- Account 12: 박민준 - 백엔드 3년차
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(12, '정보처리기사', 2, NULL, '한국산업인력공단', '2022-05-15'),
(12, 'AWS Solutions Architect Associate', 2, NULL, 'Amazon Web Services', '2023-03-20'),
(12, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2022-12-10'),
(12, 'Spring Boot 공모전', 1, '대상', '우아한테크코스', '2023-09-15');

-- Account 13: 최유진 - 데이터 분석가
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(13, 'ADSP', 2, NULL, '한국데이터산업진흥원', '2021-06-15'),
(13, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2021-09-20'),
(13, 'SQL 전문가', 2, NULL, '한국데이터산업진흥원', '2023-03-10'),
(13, '빅데이터 분석 공모전', 1, '최우수상', '통계청', '2023-11-20');

-- Account 14: 정도윤 - 풀스택 5년차
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(14, '정보처리기사', 2, NULL, '한국산업인력공단', '2019-11-30'),
(14, 'AWS Solutions Architect Professional', 2, NULL, 'Amazon Web Services', '2022-06-15'),
(14, '라인 개발자 챌린지', 1, '우수상', 'LINE', '2022-10-10');

-- Account 15: 강하은 - UI/UX 디자이너
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(15, 'GTQ (그래픽기술자격)', 2, NULL, '한국생산성본부', '2020-08-15'),
(15, 'UI/UX 디자인 공모전', 1, '대상', '디자인코리아', '2022-12-05'),
(15, 'Red Dot Design Award', 1, 'Winner', 'Red Dot', '2023-04-20');

-- Account 16: 윤서준 - 대학생
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(16, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2024-10-15'),
(16, '네이버 부스트캠프 해커톤', 1, '우수상', '네이버 커넥트재단', '2024-12-20');

-- Account 17: 임수아 - PM
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(17, 'PMP (Project Management Professional)', 2, NULL, 'PMI', '2023-05-10'),
(17, 'Google Analytics 자격증', 2, NULL, 'Google', '2022-08-15');

-- Account 18: 한지우 - 시니어 10년차
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(18, '정보처리기사', 2, NULL, '한국산업인력공단', '2015-05-20'),
(18, '정보관리기술사', 2, NULL, '한국산업인력공단', '2020-11-30'),
(18, 'AWS Solutions Architect Professional', 2, NULL, 'Amazon Web Services', '2021-06-15'),
(18, '삼성전자 사내 해커톤', 1, '대상', '삼성전자', '2017-09-10'),
(18, '오픈소스 공헌상', 1, 'Committer', 'Apache Foundation', '2021-03-20');

-- Account 19: 서예준 - 창업 준비
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(19, 'PMP', 2, NULL, 'PMI', '2022-04-10'),
(19, '스타트업 경진대회', 1, '최우수상', '중소벤처기업부', '2024-08-15');

-- Account 20: 조아인 - 신입 QA
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(20, 'ISTQB Foundation Level', 2, NULL, 'ISTQB', '2024-09-10'),
(20, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2024-11-25');

-- Account 21: 신태양 - DevOps 4년차
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(21, 'AWS DevOps Engineer Professional', 2, NULL, 'Amazon Web Services', '2022-08-15'),
(21, 'CKA', 2, NULL, 'CNCF', '2023-03-20'),
(21, 'CKAD', 2, NULL, 'CNCF', '2023-09-10'),
(21, '클라우드 아키텍처 경진대회', 1, '우수상', 'AWS Korea', '2023-11-15');

-- Account 22: 배수빈 - 보안 지망생
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(22, '정보보안기사', 2, NULL, '한국인터넷진흥원', '2024-11-30'),
(22, 'CEH (Certified Ethical Hacker)', 2, NULL, 'EC-Council', '2024-09-15'),
(22, 'CTF 대회', 1, '3위', 'DEFCON', '2024-08-10');

-- Account 23: 노시현 - 게임 기획자 5년
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(23, '게임 기획 공모전', 1, '대상', '넥슨', '2021-10-15'),
(23, 'Unity 자격증', 2, NULL, 'Unity Technologies', '2022-03-20');

-- Account 24: 홍다은 - 데이터 사이언티스트
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(24, 'ADSP', 2, NULL, '한국데이터산업진흥원', '2024-06-15'),
(24, 'Google Cloud Professional Data Engineer', 2, NULL, 'Google Cloud', '2025-02-10'),
(24, 'Kaggle Competition', 1, 'Silver Medal', 'Kaggle', '2024-11-20');

-- Account 25: 송민석 - 클라우드 아키텍트
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(25, 'AWS Solutions Architect Professional', 2, NULL, 'Amazon Web Services', '2020-08-15'),
(25, 'Google Cloud Professional Cloud Architect', 2, NULL, 'Google Cloud', '2021-05-20'),
(25, 'Azure Solutions Architect Expert', 2, NULL, 'Microsoft', '2022-03-10'),
(25, '클라우드 혁신 대상', 1, '대상', '정보통신산업진흥원', '2023-09-15');

-- Account 26: 문채원 - AI 연구원
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(26, 'TensorFlow 자격증', 2, NULL, 'Google', '2023-06-15'),
(26, 'AI 논문 대회', 1, 'Best Paper Award', 'NeurIPS', '2024-12-10'),
(26, 'Kaggle Grandmaster', 1, 'Grandmaster', 'Kaggle', '2024-08-20');

-- Account 27: 안지훈 - 모바일 앱 개발자
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(27, '정보처리기사', 2, NULL, '한국산업인력공단', '2021-11-30'),
(27, 'iOS Developer 자격증', 2, NULL, 'Apple', '2022-05-15'),
(27, '모바일 앱 공모전', 1, '우수상', '과학기술정보통신부', '2023-10-10');

-- Account 28: 오서윤 - 블록체인 개발자
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(28, 'Certified Blockchain Developer', 2, NULL, 'Blockchain Council', '2023-03-15'),
(28, 'Ethereum Development', 2, NULL, 'ConsenSys', '2023-08-20'),
(28, '블록체인 해커톤', 1, '대상', '두나무', '2024-11-15');

-- Account 29: 황준서 - 리드 12년차
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(29, '정보처리기사', 2, NULL, '한국산업인력공단', '2013-11-30'),
(29, '정보관리기술사', 2, NULL, '한국산업인력공단', '2018-05-15'),
(29, 'AWS Solutions Architect Professional', 2, NULL, 'Amazon Web Services', '2019-06-20'),
(29, 'PMP', 2, NULL, 'PMI', '2020-03-10'),
(29, '대한민국 SW대상', 1, '우수상', '과학기술정보통신부', '2022-12-05');

-- Account 30: 이준혁 - 컴공 4학년
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(30, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2024-10-15'),
(30, '캡스톤 디자인 경진대회', 1, '우수상', '성균관대학교', '2024-12-10');

-- Account 31: 박서영 - 부트캠프 수료생
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(31, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2024-09-20'),
(31, '삼성 청년 SW 아카데미 해커톤', 1, '장려상', '삼성', '2024-12-15');

-- Account 32: 김도현 - 비전공 전환
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(32, '정보처리기사', 2, NULL, '한국산업인력공단', '2024-11-30'),
(32, '국비교육 우수 수료생', 1, '우수상', 'KH정보교육원', '2024-09-25');

-- Account 33: 정민지 - 재직 중 이직
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(33, '정보처리기사', 2, NULL, '한국산업인력공단', '2023-05-20'),
(33, 'AWS Solutions Architect Associate', 2, NULL, 'Amazon Web Services', '2024-08-15');

-- Account 34: 최우진 - 해외 석사
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(34, 'Google Summer of Code', 1, 'Contributor', 'Google', '2024-08-30'),
(34, 'ACM ICPC World Finals', 1, '본선 진출', 'ACM', '2024-11-15');

-- Account 35: 강예은 - SW 마에스트로
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(35, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2024-09-20'),
(35, '스마트해커톤', 1, '대상', '과학기술정보통신부', '2024-11-25'),
(35, 'SW 마에스트로 우수 프로젝트', 1, '최우수상', '정보통신기획평가원', '2024-12-20');

-- Account 36: 윤재민 - GitHub 기여자
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(36, 'GitHub Arctic Code Vault Contributor', 1, 'Contributor', 'GitHub', '2024-02-15'),
(36, 'React 오픈소스 기여상', 1, 'Top Contributor', 'Meta', '2024-09-10');

-- Account 37: 서한별 - 알고리즘 대회
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(37, 'Codeforces', 1, 'Candidate Master', 'Codeforces', '2024-08-15'),
(37, 'ACM ICPC', 1, '본선 진출', 'ACM', '2024-11-20'),
(37, '삼성 코딩테스트 특기자 전형', 1, '합격', '삼성전자', '2025-01-15');

-- Account 38: 임지호 - 디자인→FE
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(38, 'GTQ 1급', 2, NULL, '한국생산성본부', '2023-06-15'),
(38, 'UI/UX 포트폴리오 공모전', 1, '우수상', '디자인협회', '2023-11-10');

-- Account 39: 한소율 - 마케팅→기획
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(39, 'Google Analytics 자격증', 2, NULL, 'Google', '2024-05-20'),
(39, '디지털 마케팅 공모전', 1, '장려상', '한국광고주협회', '2024-09-15');

-- Account 40: 조민성 - N수생
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(40, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2023-12-15');

-- Account 41: 신유나 - 부트캠프 재수강
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(41, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2024-06-20'),
(41, 'ADSP', 2, NULL, '한국데이터산업진흥원', '2024-12-15');

-- Account 42: 백승환 - 대학원생
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(42, '논문 학회 발표', 1, 'Best Presentation', '한국정보과학회', '2024-11-20'),
(42, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2024-09-15');

-- Account 43: 노현우 - 전역 후
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(43, '정보처리기사', 2, NULL, '한국산업인력공단', '2024-11-30'),
(43, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2025-01-20');

-- Account 44: 홍지민 - 인턴 후
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(44, 'TOPCIT', 2, NULL, '한국정보통신진흥협회', '2024-10-15'),
(44, '카카오 인턴십 우수 인턴', 1, '우수상', '카카오', '2024-08-30');

-- Account 45: 송다은 - 프리랜서
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(45, '정보처리기사', 2, NULL, '한국산업인력공단', '2023-11-30'),
(45, '프리랜서 프로젝트 우수상', 1, '우수상', '크몽', '2024-10-10');

-- Account 46: 문태윤 - 스타트업
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(46, 'AWS Solutions Architect Associate', 2, NULL, 'Amazon Web Services', '2024-06-15'),
(46, '스타트업 해커톤', 1, '장려상', '서울창조경제혁신센터', '2024-11-10');

-- Account 47: 안서준 - 게임 개발
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(47, 'Unity 자격증', 2, NULL, 'Unity Technologies', '2024-08-20'),
(47, '인디 게임 공모전', 1, '우수상', '게임문화재단', '2024-12-15');

-- Account 48: 오채원 - AI/ML
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(48, 'ADSP', 2, NULL, '한국데이터산업진흥원', '2024-09-20'),
(48, 'TensorFlow 자격증', 2, NULL, 'Google', '2024-11-15'),
(48, 'Kaggle Competition', 1, 'Bronze Medal', 'Kaggle', '2024-12-10');

-- Account 49: 황시우 - 풀스택
INSERT INTO activity (account_id, title, code, rank_name, organization, awarded_at) VALUES
(49, 'SQLD', 2, NULL, '한국데이터산업진흥원', '2024-10-20'),
(49, 'AWS Solutions Architect Associate', 2, NULL, 'Amazon Web Services', '2024-12-15');
