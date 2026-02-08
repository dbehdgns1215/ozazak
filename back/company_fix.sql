-- 기존 영어 이름을 한글로 변경
UPDATE company SET name = '삼성전자' WHERE name = 'Samsung';
UPDATE company SET name = '네이버' WHERE name = 'Naver';
UPDATE company SET name = '카카오' WHERE name = 'Kakao';
UPDATE company SET name = '현대' WHERE name = 'Hyundai';

-- 변경된 결과 확인 (이름, 회사명)
SELECT a.name, c.name as company
FROM account a
LEFT JOIN company c ON a.company_id = c.company_id
WHERE a.name IN ('최유진', '서예준', '안지훈', '이준혁');
