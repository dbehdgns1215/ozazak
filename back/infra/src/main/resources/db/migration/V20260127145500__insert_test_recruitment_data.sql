-- Insert test companies
INSERT INTO company (name, img, location)
VALUES 
    ('삼성전자', 'samsung_logo.png', '서울 서초구'),
    ('카카오', 'kakao_logo.png', '경기 성남시'),
    ('네이버', 'naver_logo.png', '경기 성남시'),
    ('토스', 'toss_logo.png', '서울 강남구'),
    ('쿠팡', 'coupang_logo.png', '서울 송파구');

-- Insert test recruitments
-- Recruitment 1: Samsung - Deadline approaching (D-5)
INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, created_at)
VALUES (
    (SELECT company_id FROM company WHERE name = '삼성전자' LIMIT 1),
    '삼성전자 2024 상반기 신입 공채',
    '삼성전자에서 우수한 인재를 모집합니다. SW개발, 하드웨어 설계, 품질관리 등 다양한 직무에서 여러분을 기다립니다.',
    '2024-01-01',
    CURRENT_DATE + INTERVAL '5 days',
    'https://samsung.com/careers/apply/1',
    CURRENT_TIMESTAMP
);

-- Recruitment 2: Kakao - In progress (D-15)
INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, created_at)
VALUES (
    (SELECT company_id FROM company WHERE name = '카카오' LIMIT 1),
    '카카오 백엔드 개발자 채용',
    'Spring Boot, Kotlin을 활용한 백엔드 개발자를 모집합니다. MSA 환경에서 대규모 트래픽을 처리한 경험이 있으신 분을 우대합니다.',
    '2024-01-10',
    CURRENT_DATE + INTERVAL '15 days',
    'https://careers.kakao.com/jobs/backend',
    CURRENT_TIMESTAMP
);

-- Recruitment 3: Naver - In progress (D-20)
INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, created_at)
VALUES (
    (SELECT company_id FROM company WHERE name = '네이버' LIMIT 1),
    '네이버 프론트엔드 개발자 모집',
    'React, TypeScript를 활용한 프론트엔드 개발자를 찾습니다. 사용자 경험을 중시하고 성능 최적화에 관심이 많은 분을 환영합니다.',
    '2024-01-05',
    CURRENT_DATE + INTERVAL '20 days',
    'https://recruit.navercorp.com/naver/job/detail/developer',
    CURRENT_TIMESTAMP
);

-- Recruitment 4: Toss - Expired (D-3, past)
INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, created_at)
VALUES (
    (SELECT company_id FROM company WHERE name = '토스' LIMIT 1),
    '토스 풀스택 개발자 채용',
    '금융 서비스를 함께 만들어갈 풀스택 개발자를 모집합니다. React, Node.js, AWS 경험자 우대합니다.',
    '2023-12-20',
    CURRENT_DATE - INTERVAL '3 days',
    'https://toss.im/career/job-detail?job_id=5678',
    CURRENT_TIMESTAMP
);

-- Recruitment 5: Coupang - Long-term recruitment (D-60)
INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, created_at)
VALUES (
    (SELECT company_id FROM company WHERE name = '쿠팡' LIMIT 1),
    '쿠팡 DevOps 엔지니어 상시 채용',
    'Kubernetes, Docker, CI/CD 파이프라인 구축 경험이 있는 DevOps 엔지니어를 상시 모집합니다. AWS, GCP 등 클라우드 경험 필수입니다.',
    '2024-01-01',
    CURRENT_DATE + INTERVAL '60 days',
    'https://www.coupang.jobs/kr/job/devops-engineer',
    CURRENT_TIMESTAMP
);
