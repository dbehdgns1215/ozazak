SELECT a.name, c.name as company
FROM account a
LEFT JOIN company c ON a.company_id = c.company_id
WHERE a.name IN ('최유진', '서예준', '안지훈', '이준혁');
