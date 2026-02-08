-- 1. 회사 정보 추가
INSERT INTO company (name, img, location, size) VALUES 
('Samsung', NULL, 'Seoul', 0),
('Naver', NULL, 'Seongnam', 0),
('Kakao', NULL, 'Jeju', 0),
('Hyundai', NULL, 'Seoul', 0);

-- 2. 사용자 매핑
UPDATE account SET company_id = (SELECT company_id FROM company WHERE name = 'Samsung' LIMIT 1) WHERE name = '최유진';
UPDATE account SET company_id = (SELECT company_id FROM company WHERE name = 'Naver' LIMIT 1) WHERE name = '서예준';
UPDATE account SET company_id = (SELECT company_id FROM company WHERE name = 'Kakao' LIMIT 1) WHERE name = '안지훈';
UPDATE account SET company_id = (SELECT company_id FROM company WHERE name = 'Hyundai' LIMIT 1) WHERE name = '이준혁';
