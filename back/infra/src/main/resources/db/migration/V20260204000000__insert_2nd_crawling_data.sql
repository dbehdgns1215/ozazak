-- Migration Script for 2nd Crawling Data
-- Generated on 2026-02-04 03:42:00
-- Strategy: Group by 공고_ID, deduplicate positions, use dynamic IDs to avoid collisions

-- Reset sequences to avoid ID collisions
SELECT setval('company_company_id_seq', COALESCE((SELECT MAX(company_id) FROM company), 1));
SELECT setval('recruitment_recruitment_id_seq', COALESCE((SELECT MAX(recruitment_id) FROM recruitment), 1));
SELECT setval('question_question_id_seq', COALESCE((SELECT MAX(question_id) FROM question), 1));

-- Recruitment 1: 2026년 신입사원 모집 (ID: 102200)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '티머니';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('티머니', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/855/webp/%ED%8B%B0%EB%A8%B8%EB%8B%88_%EB%A1%9C%EA%B3%A0.webp?1684487736', '서울 중구 후암로 110', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 신입사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/364/webp/image.webp?1769152538

1. 티머니에 대해 알고 있는 내용 중 가장 관심 있는 내용과 지원하게 된 동기에 대하여 기술하여 주십시오.(400-600) 

 2. 지원 분야를 선택한 이유와 관련된 귀하의 경험 또는 노력에 대해 기술하여 주십시오.(800-1200) 

 3. ''''나''''를 표현할 수 있는 한 단어를 선택하고, 귀하에 대해 기술하여 주십시오.(400-600) 

 4. 티머니의 인재상(Teamwork, Excellence, Ambitious Challenge, Mutual Trust) 중 가장 중요하다고 생각되는 요소에 대해
  귀하의 가치관이나 사례를 중심으로 기술하여 주십시오.(400-600) 

 5. [추가선택사항] 추가로 면접관이 질문해 주었으면 좋겠다고 생각하는 내용이 있으면, 질문/답변을 자율적으로 기술하여 주십시오.(0-500)', '2026-01-27 10:00:00', '2026-02-04 17:00:00', 'https://jasoseol.com/recruit/102200', '카드사업팀, IT보안/기획팀, 태그리스 솔루션팀, 정산운영팀 (보훈대상자 전용)', '2026-02-03 10:43:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 티머니에 대해 알고 있는 내용 중 가장 관심 있는 내용과 지원하게 된 동기에 대하여 기술하여 주십시오.(400-600)', 0, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 지원 분야를 선택한 이유와 관련된 귀하의 경험 또는 노력에 대해 기술하여 주십시오.(800-1200)', 1, 1200);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. ''나''를 표현할 수 있는 한 단어를 선택하고, 귀하에 대해 기술하여 주십시오.(400-600)', 2, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 티머니의 인재상(Teamwork, Excellence, Ambitious Challenge, Mutual Trust) 중 가장 중요하다고 생각되는 요소에 대해
  귀하의 가치관이나 사례를 중심으로 기술하여 주십시오.(400-600)', 3, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '5. [추가선택사항] 추가로 면접관이 질문해 주었으면 좋겠다고 생각하는 내용이 있으면, 질문/답변을 자율적으로 기술하여 주십시오.(0-500)', 4, 500);
END $$;

-- Recruitment 2: 디자인센터 CVC 인턴십 (ID: 102201)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'LG생활건강';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('LG생활건강', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/021/webp/2560px-LG_Household___Health_Care_logo_%28korean%29.svg.webp?1698989473', '서울 종로구 새문안로 58', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '디자인센터 CVC 인턴십', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/368/webp/2026_CVC%EC%9D%B8%ED%84%B4%EC%8B%AD_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0%EB%AC%B8_F.webp?1769152651

1. 본인에 대해서 1 Page이내로 자유롭게 소개 해 주시기 바랍니다. (지원 동기, 자신의 강점, 지원 분야 관련 경험, 포부 등)', '2026-01-23 16:13:00', '2026-02-04 10:00:00', 'https://jasoseol.com/recruit/102201', '디자인', '2026-02-03 10:44:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인에 대해서 1 Page이내로 자유롭게 소개 해 주시기 바랍니다. (지원 동기, 자신의 강점, 지원 분야 관련 경험, 포부 등)', 0, 500);
END $$;

-- Recruitment 3: [마케팅] 메디큐브 미국 틱톡샵 어필리에이트 마케팅 채용연계형 인턴사원 모집 (ID: 102202)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에이피알';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에이피알', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/158/webp/%EC%9E%90%EC%82%B0_1_2x.webp?1684487245', '서울시 송파구 올림픽로 300, 36층/27층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[마케팅] 메디큐브 미국 틱톡샵 어필리에이트 마케팅 채용연계형 인턴사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/372/webp/%EB%A7%88%EC%BC%80%ED%8C%85-%EB%A9%94%EB%94%94%ED%81%90%EB%B8%8C-%EB%AF%B8%EA%B5%AD-%ED%8B%B1%ED%86%A1%EC%83%B5-%EC%96%B4%ED%95%84%EB%A6%AC%EC%97%90%EC%9D%B4%ED%8A%B8-%EB%A7%88%EC%BC%80%ED%8C%85-%EC%B1%84%EC%9A%A9%EC%97%B0%EA%B3%84%ED%98%95-%EC%9D%B8%ED%84%B4%EC%82%AC%EC%9B%90-%EB%AA%A8%EC%A7%91-%EC%97%90%EC%9D%B4%ED%94%BC%EC%95%8C-01-23-2026_04_09_PM.webp?1769152974

1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음) 

 2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음) 

 3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', NULL, NULL, 'https://jasoseol.com/recruit/102202', '메디큐브 미국 틱톡샵 어필리에이트 마케팅', '2026-02-03 10:44:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음)', 0, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', 2, 10000);
END $$;

-- Recruitment 4: 비서, 빌링, 스탭 채용 (ID: 102203)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '김앤장 법률사무소';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('김앤장 법률사무소', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/542/webp/%E1%84%80%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%A2%E1%86%AB%E1%84%8C%E1%85%A1%E1%86%BC.webp?1684485507', '서울 종로구 사직로8길 39', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '비서, 빌링, 스탭 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/379/webp/%EA%B9%80.%EC%9E%A5_%EB%B2%95%EB%A5%A0%EC%82%AC%EB%AC%B4%EC%86%8C_%EB%B9%84%EC%84%9C_%EB%B9%8C%EB%A7%81_%EC%8A%A4%ED%83%AD.webp?1769153841

자유양식 입니다.(지원부문 명시 필수)', '2026-01-23 16:14:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102203', '비서, 빌링, 스탭', '2026-02-03 10:45:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.(지원부문 명시 필수)', 0, 500);
END $$;

-- Recruitment 5: 멀티채널 영업 (ID: 102206)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '어니스트리';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('어니스트리', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/362/webp/%EC%96%B4%EB%8B%88%EC%8A%A4%ED%8A%B8%EB%A6%AC_%EB%A1%9C%EA%B3%A0.webp?1715328078', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '멀티채널 영업', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/387/webp/%EB%A9%80%ED%8B%B0%EC%B1%84%EB%84%90.webp?1769155084

현직장(또는 전직장)에서의 동료들은 나를 어떤 사람으로 평가하고 있는지 기술하시오.(최소글자100~최대글자 1000) 

 지원한 직무를 통해 이루고 싶은 나의 목표는 무엇인가요?(최소글자100~최대글자 1000) 

 현재까지 쌓은 경력 중 성과를 도출하였던 프로젝트에 대해 기술하시오.(최소글자100~최대글자 1000) 

 본인의 강점과 연관하여 지원동기를 기술하시오.(최소글자100~최대글자 1000) 

 자신의 한계점에 도전해 본 경험은 무엇인가요?(최소글자100~최대글자 1000) 

 협력하여 목표를 달성했거나 어려움을 극복한 사례가 있다면 기술하시오.(최소글자100~최대글자 1000)', '2026-01-23 16:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102206', '[GC그룹 어니스트리] 멀티채널 영업', '2026-02-03 10:45:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현직장(또는 전직장)에서의 동료들은 나를 어떤 사람으로 평가하고 있는지 기술하시오.(최소글자100~최대글자 1000)', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원한 직무를 통해 이루고 싶은 나의 목표는 무엇인가요?(최소글자100~최대글자 1000)', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현재까지 쌓은 경력 중 성과를 도출하였던 프로젝트에 대해 기술하시오.(최소글자100~최대글자 1000)', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 강점과 연관하여 지원동기를 기술하시오.(최소글자100~최대글자 1000)', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 한계점에 도전해 본 경험은 무엇인가요?(최소글자100~최대글자 1000)', 4, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '협력하여 목표를 달성했거나 어려움을 극복한 사례가 있다면 기술하시오.(최소글자100~최대글자 1000)', 5, 1000);
END $$;

-- Recruitment 6: 디지털마케팅 기획/운영 신입 및 경력 채용 (ID: 102207)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한양증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한양증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/011/734/webp/jss_hashed_b71c95f19d8abeb5448e_20251106T154234_Top%28%29.webp?1762411355', '서울 영등포구 여의도동 34-11', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '디지털마케팅 기획/운영 신입 및 경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/389/webp/image.webp?1769155538

지원동기 및 업무추진 계획 

 본인 성장과정 및 장∙단점', '2026-01-23 00:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102207', '디지털 마케팅 기획, 디지털 마케팅 운영', '2026-02-03 10:46:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 업무추진 계획', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인 성장과정 및 장∙단점', 1, 500);
END $$;

-- Recruitment 7: 채용운영 (계약직) (ID: 102208)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'NHN';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('NHN', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/154/webp/jss_hashed_2624992a4f55a5f73209_20251215T172815_NHN_CI_Black.webp?1765787295', '경기 성남시 분당구 대왕판교로645번길 16', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '채용운영 (계약직)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/488/original/CI_%ED%94%84%EB%A1%9C%ED%95%84_%EC%9D%B4%EB%AF%B8%EC%A7%80.png?1769158830

자신에 대해 자유롭게 표현해 보세요.', NULL, NULL, 'https://jasoseol.com/recruit/102208', '채용운영 (계약직)', '2026-02-03 10:46:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신에 대해 자유롭게 표현해 보세요.', 0, 1000);
END $$;

-- Recruitment 8: 교육운영 (계약직) (ID: 102209)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'NHN';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('NHN', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/154/webp/jss_hashed_2624992a4f55a5f73209_20251215T172815_NHN_CI_Black.webp?1765787295', '경기 성남시 분당구 대왕판교로645번길 16', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '교육운영 (계약직)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/489/original/CI_%ED%94%84%EB%A1%9C%ED%95%84_%EC%9D%B4%EB%AF%B8%EC%A7%80.png?1769159303

자신에 대해 자유롭게 표현해 보세요.', NULL, NULL, 'https://jasoseol.com/recruit/102209', '교육운영 (계약직)', '2026-02-03 10:47:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신에 대해 자유롭게 표현해 보세요.', 0, 1000);
END $$;

-- Recruitment 9: (광명병원) 순환기내과(심장뇌혈관시술센터) 직원 모집 (2026.01) (ID: 102210)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(광명병원) 순환기내과(심장뇌혈관시술센터) 직원 모집 (2026.01)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/433/webp/FireShot_Capture_009_-_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0_-_%EC%B1%84%EC%9A%A9%EC%A0%95%EB%B3%B4_-_%EC%A4%91%EC%95%99%EB%8C%80%ED%95%99%EA%B5%90%EB%B3%91%EC%9B%90_-__caumc.recruiter.co.kr_.webp?1769384443

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-23 16:00:00', '2026-01-29 23:59:00', 'https://jasoseol.com/recruit/102210', '순환기내과(심장뇌혈관시술센터)', '2026-02-03 10:47:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 10: (서울병원) 연구기획관리팀 행정(연구지원) (계약직) 모집 (2026.01-2) (ID: 102211)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(서울병원) 연구기획관리팀 행정(연구지원) (계약직) 모집 (2026.01-2)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/435/webp/image.webp?1769384612

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-23 10:00:00', '2026-01-29 23:59:00', 'https://jasoseol.com/recruit/102211', '연구기획관리팀-행정-연구지원', '2026-02-03 10:47:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 11: 범어동지점 경력직 채용 (ID: 102212)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '범어동지점 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/5d1c9da9-f7a7-4097-a5d8-aeb9c4298686.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-23 00:00:00', '2026-01-29 23:59:00', 'https://jasoseol.com/recruit/102212', '범어동지점', '2026-02-03 10:48:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 12: 기계 SW 마케팅 담당자 채용 (ID: 102213)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '마이다스그룹';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('마이다스그룹', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/668/webp/midas%EB%A1%9C%EA%B3%A0.webp?1684488774', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '기계 SW 마케팅 담당자 채용', 'https://midas.recruiter.co.kr/upload/1/image/202601/8c33eca3-f3a2-4478-8ac3-0cc8720dfed3.png

자기소개서 문항이 존재하지 않습니다.', '2026-01-23 00:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102213', '영업 및 마케팅-SW 기술마케팅', '2026-02-03 10:48:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 1);
END $$;

-- Recruitment 13: 글로벌 영업 담당자 채용(베트남 사업) (ID: 102214)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '마이다스그룹';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('마이다스그룹', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/668/webp/midas%EB%A1%9C%EA%B3%A0.webp?1684488774', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '글로벌 영업 담당자 채용(베트남 사업)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/768/webp/%EB%B2%A0%ED%8A%B8%EB%82%A8%EC%82%AC%EC%97%85_%EC%98%81%EC%97%85_%EB%8B%B4%EB%8B%B9%EC%9E%90_%EC%B1%84%EC%9A%A9.webp?1769561050

자기소개서 문항이 존재하지 않습니다.', '2026-01-23 00:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102214', '해외분야-해외영업', '2026-02-03 10:48:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 1);
END $$;

-- Recruitment 14: (광명병원) 안과검사실 직원 (계약직) 모집 (2026.01) (ID: 102215)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(광명병원) 안과검사실 직원 (계약직) 모집 (2026.01)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/436/webp/image.webp?1769385101

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-23 13:00:00', '2026-01-29 23:59:00', 'https://jasoseol.com/recruit/102215', '안과검사실', '2026-02-03 10:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 15: 영업팀 신입(인턴) 사원 상시 채용 (정직원 전환) (ID: 102216)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '플랜닥스';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('플랜닥스', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/829/webp/jss_hashed_28db2e13deef90291927_20260126T094458_Screenshot_34.webp?1769388299', '서울 송파구 백제고분로 248, 3,4,5층 (삼전동,서봉빌딩)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '영업팀 신입(인턴) 사원 상시 채용 (정직원 전환)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/446/webp/image.webp?1769388055

본인에 대해서 잘 설명할 수 있는 대표적인 프로젝트 경험에 대해서 작성해주세요. (사용기술, 업무내용, 담당역할이 드러나도록 작성해주세요.)', NULL, NULL, 'https://jasoseol.com/recruit/102216', '메디컬 플랫폼 B2B세일즈', '2026-02-03 10:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인에 대해서 잘 설명할 수 있는 대표적인 프로젝트 경험에 대해서 작성해주세요. (사용기술, 업무내용, 담당역할이 드러나도록 작성해주세요.)', 0, 500);
END $$;

-- Recruitment 16: 직원 채용 공고 (ID: 102217)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국수산회';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국수산회', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/347/webp/%ED%95%9C%EA%B5%AD%EC%88%98%EC%82%B0%ED%9A%8C_%ED%92%80%EB%A1%9C%EA%B3%A0_1.webp?1684486221', '서울 서초구 논현로 83, A동 5층 (양재동,삼호물산빌딩)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '직원 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/467/webp/%ED%95%9C%EA%B5%AD%EC%88%98%EC%82%B0%ED%9A%8C_0126.webp?1769391058

자유양식 입니다.
(자기소개, 지원동기, 주요 경력, 업무활용능력 등을 구분하여 기술)', '2026-01-26 10:27:00', '2026-02-02 18:00:00', 'https://jasoseol.com/recruit/102217', '정규직 6급, 사원', '2026-02-03 10:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.
(자기소개, 지원동기, 주요 경력, 업무활용능력 등을 구분하여 기술)', 0, 500);
END $$;

-- Recruitment 17: 2026 상반기 글로벌물류운영 신입채용 (ID: 102218)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '현대글로비스';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('현대글로비스', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/047/webp/open-uri20220427-31325-10a3f3.webp?1684484620', '서울 성동구 왕십리로 83-21', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 상반기 글로벌물류운영 신입채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/587/webp/%ED%98%84%EB%8C%80%EA%B8%80%EB%A1%9C%EB%B9%84%EC%8A%A4_26%EC%83%81_%EA%B8%80%EB%A1%9C%EB%B2%8C%EB%AC%BC%EB%A5%98%EC%9A%B4%EC%98%81_%EC%8B%A0%EC%9E%85%EC%B1%84%EC%9A%A9_%EC%B5%9C%EC%A2%85%EB%B3%B8.webp?1769434154

현대글로비스에 지원한 이유와 해당 직무에서 어떤 역량을 발휘할 수 있는지 본인의 경험을 바탕으로 구체적으로 서술해 주세요. 

 현대글로비스의 조직문화 [라이프스타일 2.0] 11가지 중 본인의 가치관과 가장 잘 맞는 하나를 선택하고, 그 이유를 본인의 경험을 바탕으로 구체적으로 서술해 주세요.

※ [라이프스타일 2.0] 은 채용공고 및 현대글로비스 채용사이트에서 확인하실 수 있습니다.
※ 현대글로비스 채용사이트 : https://glovis.recruiter.co.kr/career/culture 

 [1]변화 대응 능력, [2]이해관계자와의 협업 능력 [3]발생가능한 문제예측 및 해결능력은 글로벌물류운영 업무를 수행하기 위해 반드시 필요한 역량입니다.
위 능력을 발휘한 경험을 구체적으로 작성해 주시기 바랍니다.

※ 당시 상황과 그 상황 속에서의 본인의 역할, 문제해결 과정 등을 상세히 기술해 주시기 바랍니다.', '2026-01-26 11:00:00', '2026-02-02 23:59:00', 'https://jasoseol.com/recruit/102218', '글로벌물류운영', '2026-02-03 10:50:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현대글로비스에 지원한 이유와 해당 직무에서 어떤 역량을 발휘할 수 있는지 본인의 경험을 바탕으로 구체적으로 서술해 주세요.', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현대글로비스의 조직문화 [라이프스타일 2.0] 11가지 중 본인의 가치관과 가장 잘 맞는 하나를 선택하고, 그 이유를 본인의 경험을 바탕으로 구체적으로 서술해 주세요.

※ [라이프스타일 2.0] 은 채용공고 및 현대글로비스 채용사이트에서 확인하실 수 있습니다.
※ 현대글로비스 채용사이트 : https://glovis.recruiter.co.kr/career/culture', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[1]변화 대응 능력, [2]이해관계자와의 협업 능력 [3]발생가능한 문제예측 및 해결능력은 글로벌물류운영 업무를 수행하기 위해 반드시 필요한 역량입니다.
위 능력을 발휘한 경험을 구체적으로 작성해 주시기 바랍니다.

※ 당시 상황과 그 상황 속에서의 본인의 역할, 문제해결 과정 등을 상세히 기술해 주시기 바랍니다.', 2, 1000);
END $$;

-- Recruitment 18: 2026년 제1차 계약직원(신규사업) 채용 공고 (ID: 102219)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국보건산업진흥원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국보건산업진흥원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/535/webp/20231106_160335.webp?1699254231', '충북 청주시 흥덕구 오송읍 오송생명2로 187', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 제1차 계약직원(신규사업) 채용 공고', 'https://da3rq5f5danqk.cloudfront.net/editors/EY2bK1sx7I0Ponf0vjJ8lBI2CPRWupdtk8tCbaqo.png

지원 분야와 관련하여 한국보건산업진흥원의 차별화된 역할과 기능을 설명하고, 향후 진흥원의 발전 방향에 대해 본인의 견해를 기술하여 주십시오. 

 지원 분야의 직무를 수행하는 데 필요한 핵심 역량을 갖추기 위해 본인이 기울여 온 노력은 무엇이며, 입사 후 해당 역량을 어떻게 활용할 것인지 기술하여 주십시오. 

 공동의 목표를 달성하는 과정에서 문제를 어떻게 파악하였는지 설명하고, 해결 방안을 도출하기 위한 본인의 방법과 문제 해결을 위해 기울인 노력을 구체적으로 기술하여 주십시오. 

 본인의 경험 또는 경력에서 스스로 부족하다고 판단한 부분을 어떻게 개선하였는지 설명하고, 그 결과 도출한 성과와 해당 경험을 지원 분야의 직무수행에 어떻게 활용할 것인지 기술하여 주십시오.', '2026-01-27 10:00:00', '2026-02-09 18:00:00', 'https://jasoseol.com/recruit/102219', '사업관리(C-1), 사업관리(C-2), 사업관리(C-3)', '2026-02-03 10:51:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원 분야와 관련하여 한국보건산업진흥원의 차별화된 역할과 기능을 설명하고, 향후 진흥원의 발전 방향에 대해 본인의 견해를 기술하여 주십시오.', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원 분야의 직무를 수행하는 데 필요한 핵심 역량을 갖추기 위해 본인이 기울여 온 노력은 무엇이며, 입사 후 해당 역량을 어떻게 활용할 것인지 기술하여 주십시오.', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '공동의 목표를 달성하는 과정에서 문제를 어떻게 파악하였는지 설명하고, 해결 방안을 도출하기 위한 본인의 방법과 문제 해결을 위해 기울인 노력을 구체적으로 기술하여 주십시오.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 경험 또는 경력에서 스스로 부족하다고 판단한 부분을 어떻게 개선하였는지 설명하고, 그 결과 도출한 성과와 해당 경험을 지원 분야의 직무수행에 어떻게 활용할 것인지 기술하여 주십시오.', 3, 1000);
END $$;

-- Recruitment 19: (서울병원) 심장혈관부정맥센터 간호사(경력/정규직) 모집 (2026.01) (ID: 102220)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(서울병원) 심장혈관부정맥센터 간호사(경력/정규직) 모집 (2026.01)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/493/webp/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_26-1-2026_13556_caumc.recruiter.co.kr.webp?1769400368

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-26 10:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102220', '심장혈관•부정맥센터-간호사', '2026-02-03 10:51:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 20: 퍼포먼스마케터(AE) 신입 채용 (ID: 102221)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '모비데이즈';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('모비데이즈', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/558/webp/%EB%B0%B0%EA%B2%BD%ED%88%AC%EB%AA%85%ED%95%9C%EB%A1%9C%EA%B3%A0.webp?1684487372', '서울시 강남구 역삼동 721-38 -', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '퍼포먼스마케터(AE) 신입 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/465/webp/260123_%ED%8D%BC%ED%8F%AC%EB%A8%BC%EC%8A%A4%EB%A7%88%EC%BC%80%ED%84%B0-%EC%8B%A0%EC%9E%85_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0.webp?1769390789

자기소개서 문항이 존재하지 않습니다.', '2026-01-26 10:22:00', '2026-02-15 23:59:00', 'https://jasoseol.com/recruit/102221', '퍼포먼스마케터', '2026-02-03 10:51:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 21: 각 부문 인재 채용 (ID: 102222)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '동진쎄미켐';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('동진쎄미켐', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/018/webp/open-uri20220621-2799-pecxez.webp?1684485312', '인천 서구 백범로 644', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '각 부문 인재 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/518/webp/1%EC%9B%94_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0.webp?1769409050

지원분야에서 본인의 강점(경쟁력)은 무엇이며, 그 강점을 얻기 위해 어떤 노력(과정)이 있었나요? 

 팀(Team) 활동 시 본인은 주로 어떤 역할을 맡게 되며, 그 이유는 무엇이라고 생각하나요? 

 지원자 분이 동진쎄미켐에 입사하면 어떤 부분에 기여할 수 있을까요?', '2026-01-27 00:00:00', '2026-02-05 23:59:00', 'https://jasoseol.com/recruit/102222', '전문연구요원(병역특례)_반도체/디스플레이 공정소재 개발, 이차전지, 계산화학, 기능성 코팅소재, 디스플레이 공정 소개 개발_디스플레이용 감광성 수지 개발 및 연구, 디스플레이 공정 소개 개발_OLED 유기 재료 합성 및 재료 분석, 반도체 공정 소재 개발_Photoresist 또는 BARC, SOC 소재 합성, 반도체 공정 소재 개발_HBM&PKG 공정용 신규 Wet Chemical 합성, 이차전지 공정 소재 개발_도전재 소재 및 슬러리 개발, 반도체 공정 소재 양산화(Scale-up), 원자재 검증 및 기술 분석, 제품 품질관리 및 고객 대응, 반도체 재료 기술영업 및 해외 마케팅, 일반회계 및 세무', '2026-02-03 10:54:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원분야에서 본인의 강점(경쟁력)은 무엇이며, 그 강점을 얻기 위해 어떤 노력(과정)이 있었나요?', 0, 1200);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '팀(Team) 활동 시 본인은 주로 어떤 역할을 맡게 되며, 그 이유는 무엇이라고 생각하나요?', 1, 900);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자 분이 동진쎄미켐에 입사하면 어떤 부분에 기여할 수 있을까요?', 2, 900);
END $$;

-- Recruitment 22: [Yanolja NEXT] Software Engineer (ID: 102223)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[Yanolja NEXT] Software Engineer', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/513/original/jss_hashed_56864b94632cfd9dac83_20250807T111038_yanolja_logo.png?1769409755

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102223', '[Yanolja NEXT] Software Engineer', '2026-02-03 10:54:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 23: [Yanolja NEXT] Software Engineer - IAB (Service & Product) (ID: 102224)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[Yanolja NEXT] Software Engineer - IAB (Service & Product)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/514/original/jss_hashed_3328cc506d9c45386c2c_20250729T101221_yanolja_logo.png?1769410514

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102224', '[Yanolja NEXT] Software Engineer - IAB (Service & Product)', '2026-02-03 10:54:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 24: 글로벌투자분석실(VIP고객마케팅) 경력직 인재 채용 (ID: 102225)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '글로벌투자분석실(VIP고객마케팅) 경력직 인재 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/9439ec3b-b06a-4b87-8e22-286c00d8193c.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-26 00:00:00', '2026-02-04 23:59:00', 'https://jasoseol.com/recruit/102225', '글로벌투자분석실', '2026-02-03 10:55:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 25: 리스크관리실 경력직 채용 (ID: 102226)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '리스크관리실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/66924bc1-d193-4330-ba12-d91c42655ffc.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항', '2026-01-26 00:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102226', '리스크관리실', '2026-02-03 10:55:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항', 3, 1000);
END $$;

-- Recruitment 26: [Yanolja NEXT] Lead Software Engineer - IAB (ID: 102227)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[Yanolja NEXT] Lead Software Engineer - IAB', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/515/original/jss_hashed_66be334dec863ac697e0_20250729T103850_yanolja_logo.png?1769411169

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102227', 'Lead Software Engineer - IAB', '2026-02-03 10:55:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 27: [Yanolja NEXT] Software Engineer - Price Intelligence (ID: 102228)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[Yanolja NEXT] Software Engineer - Price Intelligence', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/520/original/jss_hashed_5d96ea52f6d935de9069_20250724T143359_yanolja_logo.png?1769411754

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102228', '[Yanolja NEXT] Software Engineer - Price Intelligence', '2026-02-03 10:56:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 28: [Yanolja NEXT] Product Manager (ID: 102229)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[Yanolja NEXT] Product Manager', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/521/original/jss_hashed_700768485d95a63f57ef_20250807T142633_yanolja_logo.png?1769412062

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102229', 'Product Manager', '2026-02-03 10:56:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 29: [Yanolja NEXT] Data Engineer (ID: 102231)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[Yanolja NEXT] Data Engineer', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/523/original/jss_hashed_13e256788b396f162d8e_20251121T171906_SNS_Profile.png?1769413277

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102231', '[Yanolja NEXT] Data Engineer', '2026-02-03 10:57:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 30: 2026년 제1차 계약직 채용 (ID: 102232)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '인천공항시설관리';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('인천공항시설관리', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/011/834/webp/%EA%B5%AD%EC%98%81%EB%AC%B8_%EC%A2%8C%EC%9A%B0%EC%A1%B0%ED%95%A9B.webp?1684488132', '인천 중구 제2터미널대로 444, 310호 (운서동,제2합동청사)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 제1차 계약직 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/597/webp/image.webp?1769472784

지원 직무에 대한 지원동기 및 본인만의 강점을 설명해 주십시오. 

 인천공항시설관리(주) 인재상(도전, 열정, 존중) 중에서 하나를 선택해 해당 가치를 잘 보여준 경험과 그 경험을 통해 어떻게 성장했는지 기술해주십시오. 

 효과적인 의사소통으로 의견 충돌이나 갈등 상황을 해결했던 사례를 기술해 주십시오. 

 단체 또는 그룹에서 자신의 강점을 발휘해 공동의 목표 달성에 기여한 경험을 기술해 주십시오.', '2026-01-26 15:00:00', '2026-02-02 10:00:00', 'https://jasoseol.com/recruit/102232', '기계(1), 기계(2), 전기(1), 전기(2), 전기(3), 정보통신 / IT (1), 정보통신 / IT (2), 정보통신 / IT (3), 정보통신 / IT (4), 정보통신 / IT (5), 행정(1), 행정(2), 행정(3), 자기부상철도궤도, 공항통신 영상 PD', '2026-02-03 11:00:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원 직무에 대한 지원동기 및 본인만의 강점을 설명해 주십시오.', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '인천공항시설관리(주) 인재상(도전, 열정, 존중) 중에서 하나를 선택해 해당 가치를 잘 보여준 경험과 그 경험을 통해 어떻게 성장했는지 기술해주십시오.', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '효과적인 의사소통으로 의견 충돌이나 갈등 상황을 해결했던 사례를 기술해 주십시오.', 2, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '단체 또는 그룹에서 자신의 강점을 발휘해 공동의 목표 달성에 기여한 경험을 기술해 주십시오.', 3, 700);
END $$;

-- Recruitment 31: 경력사원 수시채용 [경영기획] (ID: 102233)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'LS MnM';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('LS MnM', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/236/webp/data.webp?1684485374', '울산광역시 울주군 온산읍 산암로 148', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '경력사원 수시채용 [경영기획]', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/538/webp/image.webp?1769413809

지식과 역량의 지속적 습득을 통해 업무 관련 변화를 예측하고 최적의 솔루션을 제시한 경험을 기술하여 주십시오. (최대 800자 입력가능) 

 계획된 일/과제를 치밀하게 실행하여 탁월한 성과를 창출한 경험을 구체적으로 기술하여 주십시오. (최대 800자 입력가능) 

 어려운 일/과제가 주어졌을 때, 동료와 협업을 통해 새로운 가치를 창출한 경험을 구체적으로 기술하여 주십시오. (최대 800자 입력가능) 

 LS MnM에 지원한 동기와 해당직무를 선택한 이유는 무엇입니까? 입사후 당신의 포부는 무엇입니까? (최대 800자 입력가능)', '2026-01-26 16:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102233', '경영기획', '2026-02-03 11:00:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지식과 역량의 지속적 습득을 통해 업무 관련 변화를 예측하고 최적의 솔루션을 제시한 경험을 기술하여 주십시오. (최대 800자 입력가능)', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '계획된 일/과제를 치밀하게 실행하여 탁월한 성과를 창출한 경험을 구체적으로 기술하여 주십시오. (최대 800자 입력가능)', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '어려운 일/과제가 주어졌을 때, 동료와 협업을 통해 새로운 가치를 창출한 경험을 구체적으로 기술하여 주십시오. (최대 800자 입력가능)', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'LS MnM에 지원한 동기와 해당직무를 선택한 이유는 무엇입니까? 입사후 당신의 포부는 무엇입니까? (최대 800자 입력가능)', 3, 800);
END $$;

-- Recruitment 32: Merchant Onboarding Assistant (ID: 102234)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '토스페이먼츠';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('토스페이먼츠', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/011/994/webp/icon-toss-logo_%281%29.webp?1684488186', '서울 강남구 테헤란로 131, 15층 (역삼동,한국지식재산센터)', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Merchant Onboarding Assistant', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/540/webp/MOA_750_0729.webp?1769414153

자유양식 입니다.', NULL, NULL, 'https://jasoseol.com/recruit/102234', '가맹점 관리', '2026-02-03 11:01:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 33: 각 부문 신입 및 경력 채용 (ID: 102235)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '애경케미칼';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('애경케미칼', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/219/webp/%EC%95%A0%EA%B2%BD%EC%BC%80%EB%AF%B8%EC%B9%BCCI.webp?1698910555', '서울 구로구 공원로 7 (구로동)', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '각 부문 신입 및 경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/549/webp/image.webp?1769415665

1. 성장배경 또는 학교생활 등에 대해 소개할 내용을 작성해 주세요. 

 2. 회사 및 직무 지원에 대한 동기를 작성해 주세요. 

 3. 구체적 사례를 통한 자신만의 차별화된 경쟁력을 작성해 주세요. 

 4. 직무와 관련된 장래계획 또는 입사 후 포부 등을 작성해 주세요.', '2026-01-26 17:00:00', '2026-02-05 23:59:00', 'https://jasoseol.com/recruit/102235', '전기/계장, 조직문화, 구매, 화장품 원료평가/제형개발, 기술영업, 분석연구, 환경관리, 무역사무, 품질검사', '2026-02-03 11:03:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 성장배경 또는 학교생활 등에 대해 소개할 내용을 작성해 주세요.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 회사 및 직무 지원에 대한 동기를 작성해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 구체적 사례를 통한 자신만의 차별화된 경쟁력을 작성해 주세요.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 직무와 관련된 장래계획 또는 입사 후 포부 등을 작성해 주세요.', 3, 500);
END $$;

-- Recruitment 34: [SCM] 국내물류 B2C 출고운영 채용연계형 인턴사원 모집 (ID: 102236)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에이피알';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에이피알', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/158/webp/%EC%9E%90%EC%82%B0_1_2x.webp?1684487245', '서울시 송파구 올림픽로 300, 36층/27층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[SCM] 국내물류 B2C 출고운영 채용연계형 인턴사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/553/webp/SCM-%EA%B5%AD%EB%82%B4%EB%AC%BC%EB%A5%98-B2C-%EC%B6%9C%EA%B3%A0%EC%9A%B4%EC%98%81-%EC%B1%84%EC%9A%A9%EC%97%B0%EA%B3%84%ED%98%95-%EC%9D%B8%ED%84%B4%EC%82%AC%EC%9B%90-%EB%AA%A8%EC%A7%91-%EC%97%90%EC%9D%B4%ED%94%BC%EC%95%8C-01-26-2026_05_38_PM.webp?1769416790

1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음) 

 2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음) 

 3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', NULL, NULL, 'https://jasoseol.com/recruit/102236', '[SCM] 국내물류 B2C 출고운영 채용연계형 인턴사원 모집', '2026-02-03 11:03:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음)', 0, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', 2, 10000);
END $$;

-- Recruitment 35: QC(신입) (ID: 102238)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'QC(신입)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/558/webp/qc%28%EC%8B%A0%EC%9E%85%29.png.webp?1769417803

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-01-26 17:55:00', '2026-02-04 23:59:00', 'https://jasoseol.com/recruit/102238', 'QC', '2026-02-03 11:04:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 36: Online VOC 분석/운영 (ID: 102239)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '이노션';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('이노션', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/070/webp/b8334c4c-879f-430c-801c-b6bf52bd29c7.webp?1692252021', '서울 강남구 강남대로 308', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Online VOC 분석/운영', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/528/original/jss_hashed_0804293f952d4a245af7_20251203T162636_CI.jpg?1769418482', '2026-01-26 18:07:00', '2026-01-27 15:22:00', 'https://jasoseol.com/recruit/102239', '', '2026-02-03 11:04:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

END $$;

-- Recruitment 37: [2026년 신입채용] 상반기 영업직 공채 (ID: 102240)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '보령';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('보령', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/292/webp/jss_hashed_c74c627d473515c79484_20260127T083913_%EB%B3%B4%EB%A0%B9-%EB%A1%9C%EA%B3%A0.webp?1769470754', '서울 종로구 창경궁로 136', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[2026년 신입채용] 상반기 영업직 공채', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/564/webp/_%EB%B3%B4%EB%A0%B9__2026%EB%85%84_%EC%83%81%EB%B0%98%EA%B8%B0_%EC%98%81%EC%97%85%EA%B3%B5%EC%B1%84_%ED%8F%AC%EC%8A%A4%ED%84%B0_v5_20260126.webp?1769421472

1. 제약 영업 직무를 선택한 이유와 이 직무에서 본인의 강점을 구체적으로 작성해 주세요. (700자 이내) 

 2. 고객의 신뢰를 얻기 위해 가장 중요하다고 생각하는 요소는 무엇이며, 이를 실제로 보여준 경험이 있다면 작성해 주세요. (700자 이내) 

 (3번 문항 택1) 3-1. 시간이나 정보가 부족한 상황에서 여러 업무를 동시에 처리해야했던 경험이 있다면, 어떻게 우선순위를 정하고 대응했는지 설명해 주세요. (700자 이내) 

 (3번 문항 택1) 3-2. 최근 관심있게 본 제약 산업 관련 이슈가 있다면 설명해 주세요. 그것이 제약 영업에 어떤 영향을 끼칠 수 있다고 생각하시나요? (700자 이내)', '2026-01-26 00:00:00', '2026-02-22 23:59:00', 'https://jasoseol.com/recruit/102240', '영업직(MR)_서울, 영업직(MR)_경기, 영업직(MR)_충북, 영업직(MR)_충남, 영업직(MR)_광주전남, 영업직(MR)_대구경북, 영업직(MR)_부산', '2026-02-03 11:06:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 제약 영업 직무를 선택한 이유와 이 직무에서 본인의 강점을 구체적으로 작성해 주세요. (700자 이내)', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 고객의 신뢰를 얻기 위해 가장 중요하다고 생각하는 요소는 무엇이며, 이를 실제로 보여준 경험이 있다면 작성해 주세요. (700자 이내)', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '(3번 문항 택1) 3-1. 시간이나 정보가 부족한 상황에서 여러 업무를 동시에 처리해야했던 경험이 있다면, 어떻게 우선순위를 정하고 대응했는지 설명해 주세요. (700자 이내)', 2, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '(3번 문항 택1) 3-2. 최근 관심있게 본 제약 산업 관련 이슈가 있다면 설명해 주세요. 그것이 제약 영업에 어떤 영향을 끼칠 수 있다고 생각하시나요? (700자 이내)', 3, 700);
END $$;

-- Recruitment 38: 2026년 하반기 경력/신입 수시 채용 (ID: 102241)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '태광산업';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('태광산업', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/211/webp/%ED%83%9C%EA%B4%91%EA%B7%B8%EB%A3%B9_%EC%98%81%EB%AC%B8ci.webp?1684485776', '서울 중구 동호로 310', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 하반기 경력/신입 수시 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/724/webp/%ED%83%9C%EA%B4%91%EC%82%B0%EC%97%85.webp?1769499303

지원자님께서 당사 입사를 희망하게 된 이유와 입사 후 이루고 싶은 목표에 대해 알려주세요. (입사 후 지원자님의 꿈과 비전을 중심으로 알려주세요.) 

 지원자님께서 지원한 직무에 관심을 갖게 된 계기와 지원 직무에 적합하다고 생각한 이유를 알려주세요. (지원자님께서 가지고 계시는 역량이나 경험을 위주로 알려주세요.) 

 지원자님께서 인생을 살아오시면서 가장 기억에 남는 이야기를 들려주세요. (성공/실패/도전/협력 등 해당 경험을 통해 배운 점 위주로 알려주세요.) 

 지원자님이 어떤 사람인지 한 단어로 표현해주세요. (지원자님께서 보유하신 역량을 마음껏 어필해주세요.) 

 지원자님께서 당사 입사를 희망하게 된 이유와 입사 후 이루고 싶은 목표에 대해 알려주세요. (입사 후 지원자님의 꿈과 비전을 중심으로 알려주세요.) 

 지원자님께서 지원한 직무에 관심을 갖게 된 계기와 지원 직무에 적합하다고 생각한 이유를 알려주세요. (지원자님께서 가지고 계시는 역량이나 경험을 위주로 알려주세요.) 

 지원자님께서 인생을 살아오시면서 가장 기억에 남는 이야기를 들려주세요. (성공/실패/도전/협력 등 해당 경험을 통해 배운 점 위주로 알려주세요.) 

 지원자님이 어떤 사람인지 한 단어로 표현해주세요. (지원자님께서 보유하신 역량을 마음껏 어필해주세요.)', '2026-02-08 23:59:00', NULL, 'https://jasoseol.com/recruit/102241', '해외영업, 생산관리, 안전환경, 공무(기계설비), 계전(전기설비)', '2026-02-03 11:08:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님께서 당사 입사를 희망하게 된 이유와 입사 후 이루고 싶은 목표에 대해 알려주세요. (입사 후 지원자님의 꿈과 비전을 중심으로 알려주세요.)', 0, 650);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님께서 지원한 직무에 관심을 갖게 된 계기와 지원 직무에 적합하다고 생각한 이유를 알려주세요. (지원자님께서 가지고 계시는 역량이나 경험을 위주로 알려주세요.)', 1, 850);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님께서 인생을 살아오시면서 가장 기억에 남는 이야기를 들려주세요. (성공/실패/도전/협력 등 해당 경험을 통해 배운 점 위주로 알려주세요.)', 2, 650);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님이 어떤 사람인지 한 단어로 표현해주세요. (지원자님께서 보유하신 역량을 마음껏 어필해주세요.)', 3, 350);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님께서 당사 입사를 희망하게 된 이유와 입사 후 이루고 싶은 목표에 대해 알려주세요. (입사 후 지원자님의 꿈과 비전을 중심으로 알려주세요.)', 4, 650);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님께서 지원한 직무에 관심을 갖게 된 계기와 지원 직무에 적합하다고 생각한 이유를 알려주세요. (지원자님께서 가지고 계시는 역량이나 경험을 위주로 알려주세요.)', 5, 850);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님께서 인생을 살아오시면서 가장 기억에 남는 이야기를 들려주세요. (성공/실패/도전/협력 등 해당 경험을 통해 배운 점 위주로 알려주세요.)', 6, 650);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원자님이 어떤 사람인지 한 단어로 표현해주세요. (지원자님께서 보유하신 역량을 마음껏 어필해주세요.)', 7, 350);
END $$;

-- Recruitment 39: [KP그룹] 케미칼솔루션사업부 LAB BIZ팀 개발자 채용 (ID: 102242)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국석유공업';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국석유공업', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/762/webp/mainlogo-JPG.webp?1684486387', '서울 용산구 이촌로 166', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[KP그룹] 케미칼솔루션사업부 LAB BIZ팀 개발자 채용', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/531/original/jss_hashed_e6b4617d9afc5de1ac5b_20250612T160057_img_logo_eng.png?1769476143

지원동기와 입사 후 회사에서 이루고 싶은 꿈은 무엇인가요? 

 지원한 직무를 위해 필요한 역량은 무엇이라고 생각하며, 이 역량을 갖추기 위한 노력이나 자신만의 특별한 경험을 작성해 주세요. 

 다른 지원자 대비 본인만의 ''''차별화된 강점''''과 ''''보완해야 할 약점''''에 대해 사례를 들어 구체적으로 기술해 주세요. 

 역량기술서(경력자에 한해 작성)
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', '2026-01-27 10:08:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102242', '[KP그룹]KP한석화학 LAB BIZ팀 백앤드 개발자', '2026-02-03 11:08:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기와 입사 후 회사에서 이루고 싶은 꿈은 무엇인가요?', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원한 직무를 위해 필요한 역량은 무엇이라고 생각하며, 이 역량을 갖추기 위한 노력이나 자신만의 특별한 경험을 작성해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '다른 지원자 대비 본인만의 ''차별화된 강점''과 ''보완해야 할 약점''에 대해 사례를 들어 구체적으로 기술해 주세요.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '역량기술서(경력자에 한해 작성)
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', 3, 5000);
END $$;

-- Recruitment 40: [KP그룹]한국석유공업기술연구소 연구원 채용 (ID: 102243)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국석유공업';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국석유공업', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/762/webp/mainlogo-JPG.webp?1684486387', '서울 용산구 이촌로 166', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[KP그룹]한국석유공업기술연구소 연구원 채용', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/532/original/jss_hashed_e6b4617d9afc5de1ac5b_20250612T160057_img_logo_eng.png?1769476281

지원동기와 입사 후 회사에서 이루고 싶은 꿈은 무엇인가요? 

 지원한 직무를 위해 필요한 역량은 무엇이라고 생각하며, 이 역량을 갖추기 위한 노력이나 자신만의 특별한 경험을 작성해 주세요. 

 다른 지원자 대비 본인만의 ''''차별화된 강점''''과 ''''보완해야 할 약점''''에 대해 사례를 들어 구체적으로 기술해 주세요. 

 역량기술서(경력자에 한해 작성)
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', '2026-01-27 10:09:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102243', '[KP그룹]한국석유공업 기술연구소 연구원 채용(경력)', '2026-02-03 11:08:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기와 입사 후 회사에서 이루고 싶은 꿈은 무엇인가요?', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원한 직무를 위해 필요한 역량은 무엇이라고 생각하며, 이 역량을 갖추기 위한 노력이나 자신만의 특별한 경험을 작성해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '다른 지원자 대비 본인만의 ''차별화된 강점''과 ''보완해야 할 약점''에 대해 사례를 들어 구체적으로 기술해 주세요.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '역량기술서(경력자에 한해 작성)
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', 3, 5000);
END $$;

-- Recruitment 41: [KP그룹]경영기획실 기획팀 채용(경력) (ID: 102244)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국석유공업';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국석유공업', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/762/webp/mainlogo-JPG.webp?1684486387', '서울 용산구 이촌로 166', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[KP그룹]경영기획실 기획팀 채용(경력)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/534/original/jss_hashed_e6b4617d9afc5de1ac5b_20250612T160057_img_logo_eng.png?1769476965

지원동기와 입사 후 회사에서 이루고 싶은 꿈은 무엇인가요? 

 지원한 직무를 위해 필요한 역량은 무엇이라고 생각하며, 이 역량을 갖추기 위한 노력이나 자신만의 특별한 경험을 작성해 주세요. 

 다른 지원자 대비 본인만의 ''''차별화된 강점''''과 ''''보완해야 할 약점''''에 대해 사례를 들어 구체적으로 기술해 주세요. 

 역량기술서(경력자에 한해 작성)
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', '2026-01-27 10:11:00', '2026-02-10 23:59:00', 'https://jasoseol.com/recruit/102244', '[KP그룹]한국석유공업 경영기획실 기획팀 채용(경력)', '2026-02-03 11:09:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기와 입사 후 회사에서 이루고 싶은 꿈은 무엇인가요?', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원한 직무를 위해 필요한 역량은 무엇이라고 생각하며, 이 역량을 갖추기 위한 노력이나 자신만의 특별한 경험을 작성해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '다른 지원자 대비 본인만의 ''차별화된 강점''과 ''보완해야 할 약점''에 대해 사례를 들어 구체적으로 기술해 주세요.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '역량기술서(경력자에 한해 작성)
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', 3, 5000);
END $$;

-- Recruitment 42: Merchandising Associate (MD) (ID: 102245)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '비바리퍼블리카(토스)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('비바리퍼블리카(토스)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/011/256/webp/icon-toss-logo_%281%29.webp?1684487963', '서울 강남구 테헤란로 142, 4층, 10층, 11층, 12층, 13층, 22층, 23층 (역삼동,아크플레이스)', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Merchandising Associate (MD)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/631/webp/image.webp?1769479034

1. 여러분이 생각하는 Merchandising Associate는 어떤 일을 하는 사람인가요? 그리고 그 일을 하고 싶은 이유가 무엇인가요?

이 일을 어떻게 이해하고 있으며, 왜 이 일을 하고 싶은지 말씀해주세요. 여러분이 정의하는 Merchandising Associate의 역할을 이야기해주세요. [지원시 참고 가이드: https://tosspublic.notion.site/ma](최대 700자, 공백 포함) 

 2. 여러분의 경험을 바탕으로, Merchandising Associate로서 이 일을 잘 해낼 수 있다고 생각하는 이유를 말씀해주세요.

문제 상황을 인지하고, 목표를 달성하기 위해 어려움이 있더라고 끝까지 노력해 성취해 낸 경험을 본인의 역할과 행동 중심으로 구체적으로 서술해 주세요.(최대 700자, 공백 포함)', '2026-01-28 00:00:00', '2026-02-03 23:59:00', 'https://jasoseol.com/recruit/102245', 'Merchandising Associate', '2026-02-03 11:09:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 여러분이 생각하는 Merchandising Associate는 어떤 일을 하는 사람인가요? 그리고 그 일을 하고 싶은 이유가 무엇인가요?

이 일을 어떻게 이해하고 있으며, 왜 이 일을 하고 싶은지 말씀해주세요. 여러분이 정의하는 Merchandising Associate의 역할을 이야기해주세요. [지원시 참고 가이드: https://tosspublic.notion.site/ma](최대 700자, 공백 포함)', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 여러분의 경험을 바탕으로, Merchandising Associate로서 이 일을 잘 해낼 수 있다고 생각하는 이유를 말씀해주세요.

문제 상황을 인지하고, 목표를 달성하기 위해 어려움이 있더라고 끝까지 노력해 성취해 낸 경험을 본인의 역할과 행동 중심으로 구체적으로 서술해 주세요.(최대 700자, 공백 포함)', 1, 700);
END $$;

-- Recruitment 43: 화장품 제조 및 품질관리 양성과정 교육생 모집 (ID: 102247)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '인천대학교';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('인천대학교', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/557/webp/990972880_10dsYkWo_BBF5C7D0B1B3B7CEB0ED.webp?1684486674', '인천 연수구 아카데미로 119', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '화장품 제조 및 품질관리 양성과정 교육생 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/645/webp/%EC%9D%B8%EC%B2%9C%EB%8C%80%ED%95%99%EA%B5%90_%EA%B5%90%EC%9C%A1%EC%83%9D%281%29.webp?1769480981

본인소개 

 교육참여 지원동기 

 교육 수료 후 취업계획', '2026-01-27 13:30:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102247', '화장품 제조 및 품질관리 양성과정', '2026-02-03 11:10:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인소개', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '교육참여 지원동기', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '교육 수료 후 취업계획', 2, 500);
END $$;

-- Recruitment 44: (광명병원) 순환기내과(심장예방재활센터) 간호사 (휴직대체) 모집 (2026.01) (ID: 102248)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(광명병원) 순환기내과(심장예방재활센터) 간호사 (휴직대체) 모집 (2026.01)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/658/webp/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_27-1-2026_1337_caumc.recruiter.co.kr.webp?1769486609

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-27 10:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102248', '간호사-순환기내과(심장예방재활센터)', '2026-02-03 11:10:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 45: 2026년도 상반기 정규직 직원 채용 공고 (ID: 102249)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국원자력안전기술원(KINS)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국원자력안전기술원(KINS)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/679/webp/5f1edc65c29dcac408062986c5070c41_400x400.webp?1684485966', '대전 유성구 과학로 62', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년도 상반기 정규직 직원 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/650/webp/%ED%95%9C%EA%B5%AD%EC%9B%90%EC%9E%90%EB%A0%A5%EC%95%88%EC%A0%84%EA%B8%B0%EC%88%A0%EC%9B%90_%EC%B5%9C%EC%A2%85.webp?1769482246

조직의 일원으로서 반드시 지켜야 한다고 생각하는 규범이나 절차는 무엇입니까? 해당 규범을 지키기 위해 원칙을 고수했던 본인의 경험과 그 결과에 대해 작성해주십시오. 

 지금까지의 경험 중 2인 이상이 함께 공통된 목표를 달성하기 위해 협력했던 사례를 구체적으로 작성해 주십시오. 특히 목표 달성에 성공한 요인과 그 과정에서 본인이 맡은 역할을 중심으로 작성해 주십시오. 

 자신의 전공 분야나 직무 영역에서 전문성을 향상시키거나 전문 지식을 활용하여 성과를 이끌어낸 경험을 서술해 주십시오. 그 과정에서 쌓은 지식/기술을 적용하여 얻은 결과를 함께 작성해 주십시오. 

 그동안의 경험 중 가장 달성하기 어려웠던 목표를 이루기 위해 노력했던 사례를 작성해 주십시오. 당면했던 어려움은 무엇이었고, 목표 달성을 위해 어떤 구체적인 접근방법을 시도했으며, 결과는 어떠했는지 상세히 작성해 주십시오. 

 새롭게 속하게 된 조직에서 그 조직의 문화와 운영 방식을 인식하고 적응하기 위해 노력했던 경험을 구체적으로 작성해 주십시오. 당시 상황에서 조직의 가치나 규범을 인지하고 실천하기 위해 취했던 행동과 그 결과에 초점을 맞춰 작성해 주십시오. 

 역량기술서<경험기술서> 직무와 관련된 경험을 작성하여 주시기 바랍니다.', '2026-01-27 14:00:00', '2026-02-11 18:00:00', 'https://jasoseol.com/recruit/102249', '연구직_안전해석, 연구직_중대사고/확률론적 안전성평가, 연구직_기계, 연구직_재료, 연구직_계통열수력, 연구직_원자력-비경수형, 연구직_계측제어, 연구직_전력계통, 연구직_구조, 연구직_부지, 연구직_품질보증, 연구직_방사능방재, 연구직_방사선방호, 연구직_방사성폐기물, 연구직_계통성능 및 SW기술, 연구직_기기건전성 및 SW기술, 연구직_정보기술, 행정직_경영관리, 행정직_기계(설비), 행정직_경영관리(보훈제한)', '2026-02-03 11:14:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '조직의 일원으로서 반드시 지켜야 한다고 생각하는 규범이나 절차는 무엇입니까? 해당 규범을 지키기 위해 원칙을 고수했던 본인의 경험과 그 결과에 대해 작성해주십시오.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지금까지의 경험 중 2인 이상이 함께 공통된 목표를 달성하기 위해 협력했던 사례를 구체적으로 작성해 주십시오. 특히 목표 달성에 성공한 요인과 그 과정에서 본인이 맡은 역할을 중심으로 작성해 주십시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 전공 분야나 직무 영역에서 전문성을 향상시키거나 전문 지식을 활용하여 성과를 이끌어낸 경험을 서술해 주십시오. 그 과정에서 쌓은 지식/기술을 적용하여 얻은 결과를 함께 작성해 주십시오.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '그동안의 경험 중 가장 달성하기 어려웠던 목표를 이루기 위해 노력했던 사례를 작성해 주십시오. 당면했던 어려움은 무엇이었고, 목표 달성을 위해 어떤 구체적인 접근방법을 시도했으며, 결과는 어떠했는지 상세히 작성해 주십시오.', 3, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '새롭게 속하게 된 조직에서 그 조직의 문화와 운영 방식을 인식하고 적응하기 위해 노력했던 경험을 구체적으로 작성해 주십시오. 당시 상황에서 조직의 가치나 규범을 인지하고 실천하기 위해 취했던 행동과 그 결과에 초점을 맞춰 작성해 주십시오.', 4, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '역량기술서<경험기술서> 직무와 관련된 경험을 작성하여 주시기 바랍니다.', 5, 2000);
END $$;

-- Recruitment 46: 검체 관리 서비스 매니저 채용 (서산) (ID: 102250)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'GC셀';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('GC셀', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/292/webp/%EC%A7%80%EC%94%A8%EC%85%80_CI_%EC%98%81%EB%AC%B8.webp?1684488676', '경기도 용인시 기흥구 이현로30번길 107 -', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '검체 관리 서비스 매니저 채용 (서산)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/651/webp/1.%EA%B8%B0%EC%97%85%EC%86%8C%EA%B0%9C_850_%ED%86%B5%ED%95%A9.webp?1769484636

자유양식 입니다.', NULL, NULL, 'https://jasoseol.com/recruit/102250', '서비스 매니저(서산)', '2026-02-03 11:15:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 47: 검체 관리 서비스 매니저 채용 (송도) (ID: 102251)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'GC셀';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('GC셀', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/292/webp/%EC%A7%80%EC%94%A8%EC%85%80_CI_%EC%98%81%EB%AC%B8.webp?1684488676', '경기도 용인시 기흥구 이현로30번길 107 -', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '검체 관리 서비스 매니저 채용 (송도)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/654/webp/1.%EA%B8%B0%EC%97%85%EC%86%8C%EA%B0%9C_850_%ED%86%B5%ED%95%A9.webp?1769484719

자유양식 입니다.', NULL, NULL, 'https://jasoseol.com/recruit/102251', '서비스 매니저(송도)', '2026-02-03 11:15:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 48: 2026년 제1차 청년인턴(체험형인턴) 채용 (ID: 102252)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '국립농업박물관';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('국립농업박물관', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/511/webp/%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98_%EC%A2%8C%EC%9A%B0%EC%A1%B0%ED%95%A9_%EA%B5%AD%EC%98%81%EB%AC%B8.webp?1684488506', '경기 수원시 권선구 수인로 154', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 제1차 청년인턴(체험형인턴) 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/664/webp/%EB%B0%95%EB%AC%BC%EA%B4%80_%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0%EB%AC%B8%28%EC%88%98%EC%A0%95%29.webp?1769488473

박물관에 지원하게 된 동기와, 입사 후 이루고자 하는 목표에 대해 작성해주세요. 

 지원 분야와 관련된 전문성을 얻기 위하여 노력한 경험과, 이를 통해 성취해낸 점에 대해 작성해주세요. 

 공동의 목표를 달성하는 과정에서 구성원간의 의견 차이가 발생했을 때, 문제를 해결하여 성과를 낸 경험에 대해 작성해주세요.', '2026-02-03 00:00:00', '2026-02-10 17:00:00', 'https://jasoseol.com/recruit/102252', '전시, 유물자료관리, 유물자료관리(장애인 제한), 학술연구, 조경, 행사', '2026-02-03 11:16:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '박물관에 지원하게 된 동기와, 입사 후 이루고자 하는 목표에 대해 작성해주세요.', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원 분야와 관련된 전문성을 얻기 위하여 노력한 경험과, 이를 통해 성취해낸 점에 대해 작성해주세요.', 1, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '공동의 목표를 달성하는 과정에서 구성원간의 의견 차이가 발생했을 때, 문제를 해결하여 성과를 낸 경험에 대해 작성해주세요.', 2, 600);
END $$;

-- Recruitment 49: 2026-1차 직원 채용 공고 (ID: 102253)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국나노기술원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국나노기술원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/327/webp/%ED%95%9C%EA%B5%AD%EB%82%98%EB%85%B8%EA%B8%B0%EC%88%A0%EC%9B%90.webp?1684485824', '경기 수원시 영통구 광교로 109, 한국나노기술원연구벤처동 제1호', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026-1차 직원 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/675/webp/%ED%95%9C%EA%B5%AD%EB%82%98%EB%85%B8%EA%B8%B0%EC%88%A0%EC%9B%90_v2.html.pdf_page_1.webp?1769488740

최근 5년 동안에 귀하가 성취한 일 중에서 가장 자랑할 만한 것은 무엇입니까? 그것을 성취하기 위해 귀하는 어떤 일을 했습니까? - 응시원서에 기재한 ‘경험 혹은 경력사항’ 중 대표적인 것 하나를 선택한 후 본인이 수행한 경험/경력 활동에 따른 결과(성과)를 연계하여 구체적으로 기술하시오. 

 한국나노기술원에 입사 지원한 동기 및 입사 후 실천하고자 하는 목표를 다른 사람과 차별화 된 본인의 역량과 결부시켜 작성해 주십시오. 

 예상치 못했던 문제로 인해 계획대로 일이 진행되지 않았을 때, 책임감을 가지고 적극적으로 끝까지 업무를 수행해서 성공적으로 마무리했던 경험이 있으면 서술해 주십시오. 

 내·외부 고객과 문제가 발생한 본인의 경험을 기술하고, 어떻게 해결하였는지 서술하여 주십시오. 

 해당 경력에서의 수행역할(업무) 및 성과를 구체적으로 기술하시오., 단 경력이 여러 개인 경우 각 경력을 분할하여 작성하시오.(경력이 없는 경우 경험으로 기술 가능) 

 기술원 입사 후 5년 내 이루고자 하는 업무 목표 및 이를 달성하기 위한 업무 수행 계획을 구체적으로 작성하시오.', '2026-01-27 14:00:00', '2026-02-12 11:00:00', 'https://jasoseol.com/recruit/102253', '경기도 양자인공지능지원센터장, 교육운영, 공정서비스 (육아휴직대체), 세무회계 (육아기근로시간 단축대체)', '2026-02-03 11:18:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '최근 5년 동안에 귀하가 성취한 일 중에서 가장 자랑할 만한 것은 무엇입니까? 그것을 성취하기 위해 귀하는 어떤 일을 했습니까? - 응시원서에 기재한 ‘경험 혹은 경력사항’ 중 대표적인 것 하나를 선택한 후 본인이 수행한 경험/경력 활동에 따른 결과(성과)를 연계하여 구체적으로 기술하시오.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한국나노기술원에 입사 지원한 동기 및 입사 후 실천하고자 하는 목표를 다른 사람과 차별화 된 본인의 역량과 결부시켜 작성해 주십시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '예상치 못했던 문제로 인해 계획대로 일이 진행되지 않았을 때, 책임감을 가지고 적극적으로 끝까지 업무를 수행해서 성공적으로 마무리했던 경험이 있으면 서술해 주십시오.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '내·외부 고객과 문제가 발생한 본인의 경험을 기술하고, 어떻게 해결하였는지 서술하여 주십시오.', 3, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '해당 경력에서의 수행역할(업무) 및 성과를 구체적으로 기술하시오., 단 경력이 여러 개인 경우 각 경력을 분할하여 작성하시오.(경력이 없는 경우 경험으로 기술 가능)', 4, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기술원 입사 후 5년 내 이루고자 하는 업무 목표 및 이를 달성하기 위한 업무 수행 계획을 구체적으로 작성하시오.', 5, 1000);
END $$;

-- Recruitment 50: 2026년 상반기 체험형 청년인턴 인재영입 (ID: 102254)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국도로공사(ex)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국도로공사(ex)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/718/webp/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2019-02-27_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.23.28.webp?1684485247', '경북 김천시 혁신8로 77 (율곡동,한국도로공사)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 상반기 체험형 청년인턴 인재영입', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/693/webp/image.webp?1769492180

자기소개서 문항이 존재하지 않습니다.', '2026-02-02 13:00:00', '2026-02-09 15:00:00', 'https://jasoseol.com/recruit/102254', '[일반전형]본사 - 행정, [일반전형]본사 - 기술, [일반전형]도로교통연구원 - 기술, [일반전형]인재개발원 - 행정, [일반전형]교통관제센터 - 기술, [일반전형]첨단기계화센터 - 기술, [일반전형]김포파주건설사업단 - 기술, [일반전형]수도권건설사업단 - 기술, [일반전형]세종천안건설사업단 - 행정, [일반전형]세정천안건설사업단 - 기술, [일반전형]서산아산건설사업단 - 행정, [일반전형]강진광주건설사업단 - 행정, [일반전형]경남권건설사업단 - 기술, [일반전형]남부도로개량사업단 - 행정, [일반전형]수도권본부 - 행정, [일반전형]수도권본부 - 기술, [일반전형]인천지사 - 기술, [일반전형]시흥지사 - 기술, [일반전형]군포지사 - 행정, [일반전형]군포지사 - 기술, [일반전형]파주지사 - 행정, [일반전형]서울경기본부 - 행정, [일반전형]서울경기본부 - 기술, [일반전형]수원지사 - 행정, [일반전형]수원지사 - 기술, [일반전형]경기광주지사 - 행정, [일반전...', '2026-02-03 11:35:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 1);
END $$;

-- Recruitment 51: Product Strategy Manager (ID: 102255)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Product Strategy Manager', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/541/original/jss_hashed_5ef3ea7d65963e0ceb5d_20260109T110211_SNS_Profile.png?1769492190', NULL, NULL, 'https://jasoseol.com/recruit/102255', '', '2026-02-03 11:35:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

END $$;

-- Recruitment 52: 2026년 신입사원 채용 공고 (ID: 102256)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국남동발전(KOEN)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국남동발전(KOEN)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/752/webp/%ED%95%9C%EA%B5%AD%EB%82%A8%EB%8F%99%EB%B0%9C%EC%A0%84.webp?1684485257', '경남 진주시 사들로123번길 32', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 신입사원 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/697/webp/image.webp?1769494029

※ 자기소개서는 필기전형 합격자에 한하여 합격자 발표시 입력

본인의 직업관에 대하여 설명하고, 한국남동발전이 그에 부합하는 이유와 한국남동발전에 입사하기위하여 본인이 특별히 노력한 경험(학과목, 자격증 등)에 대하여 상세하게 기술해 주십시오. (어떻게 노력 했는지, 어떤 발전이 있었는지, 입사에 도움이 될 것이라고 생각하는 근거가 무엇인지등) (600 자 이상 700 자 이하) 

 한국남동발전이 수행 중인 ESG경영사업 중 본인이 가장 관심있는 사업을 하나 선택하고, 본인의역량을 바탕으로 해당 사업에 기여할 수 있는 부분은 무엇인지 구체적으로 기술해 주십시오. (600 자 이상 700 자 이하) 

 당면한 문제를 해결하기 위해 시도했던 경험 중 원인을 철저히 규명하여 문제를 해결했던 사례에대해 구체적으로 기술해 주십시오. 당시 문제가 되는 상황은 무엇이었으며, 어떠한 과정을 통해원인을 규명하였는지, 그렇게 문제를 해결한 이유는 무엇이었는지 상세하게 기술해 주십시오 (600 자 이상 700 자 이하) 

 귀하가 속한 조직 또는 집단에서 구성원들과 갈등이 발생했을 때, 이를 극복했던 경험을 당시 상황, 본인이 한 행동, 특별히 노력한 점, 노력의 결과, 느낀점 등을 구체적으로 기술해주십시오. (600 자 이상 700 자 이하) 

 한국남동발전 입사 후 업무를 수행함에 있어 가장 중요한 원칙과 사회생활을 함에 있어 가장 중요한 원칙은 각각 무엇이며, 그렇게 생각하는 이유를 본인의 가치관과 경험을 바탕으로 구체적으로 기술해주십시오. (600 자 이상 700 자 이하)', '2026-02-02 00:00:00', '2026-02-10 10:00:00', 'https://jasoseol.com/recruit/102256', '[일반]사무, [일반]기계, [일반]전기, [일반]화학, [일반]ICT, [일반]토목, [일반]건축, [보훈]사무, [보훈]기계, [보훈]전기, [보훈]화학, [보훈]ICT, [보훈]토목, [보훈]건축, [장애]사무, [장애]기계, [장애]전기, [장애]화학, [장애]ICT', '2026-02-03 11:39:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '※ 자기소개서는 필기전형 합격자에 한하여 합격자 발표시 입력

본인의 직업관에 대하여 설명하고, 한국남동발전이 그에 부합하는 이유와 한국남동발전에 입사하기위하여 본인이 특별히 노력한 경험(학과목, 자격증 등)에 대하여 상세하게 기술해 주십시오. (어떻게 노력 했는지, 어떤 발전이 있었는지, 입사에 도움이 될 것이라고 생각하는 근거가 무엇인지등) (600 자 이상 700 자 이하)', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한국남동발전이 수행 중인 ESG경영사업 중 본인이 가장 관심있는 사업을 하나 선택하고, 본인의역량을 바탕으로 해당 사업에 기여할 수 있는 부분은 무엇인지 구체적으로 기술해 주십시오. (600 자 이상 700 자 이하)', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당면한 문제를 해결하기 위해 시도했던 경험 중 원인을 철저히 규명하여 문제를 해결했던 사례에대해 구체적으로 기술해 주십시오. 당시 문제가 되는 상황은 무엇이었으며, 어떠한 과정을 통해원인을 규명하였는지, 그렇게 문제를 해결한 이유는 무엇이었는지 상세하게 기술해 주십시오 (600 자 이상 700 자 이하)', 2, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '귀하가 속한 조직 또는 집단에서 구성원들과 갈등이 발생했을 때, 이를 극복했던 경험을 당시 상황, 본인이 한 행동, 특별히 노력한 점, 노력의 결과, 느낀점 등을 구체적으로 기술해주십시오. (600 자 이상 700 자 이하)', 3, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한국남동발전 입사 후 업무를 수행함에 있어 가장 중요한 원칙과 사회생활을 함에 있어 가장 중요한 원칙은 각각 무엇이며, 그렇게 생각하는 이유를 본인의 가치관과 경험을 바탕으로 구체적으로 기술해주십시오. (600 자 이상 700 자 이하)', 4, 700);
END $$;

-- Recruitment 53: 신입채용 - 브랜드 공간 운영지원 담당자 (ID: 102257)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '오뚜기';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('오뚜기', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/215/webp/%EC%98%A4%EB%9A%9C%EA%B8%B0%EC%8B%AC%EB%B3%BC%EB%A7%88%ED%81%AC.webp?1729033274', '경기 안양시 동안구 흥안대로 405', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '신입채용 - 브랜드 공간 운영지원 담당자', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/712/webp/%28%EC%A3%BC%29%EC%98%A4%EB%9A%9C%EA%B8%B0%EC%8B%A0%EC%9E%85%EC%B1%84%EC%9A%A9_%EB%B8%8C%EB%9E%9C%EB%93%9C%EA%B3%B5%EA%B0%84%EC%9A%B4%EC%98%81%EC%A7%80%EC%9B%90%28%EA%B3%B5%EA%B3%A0%29.webp?1769495645

지원직무를 잘 수행할 수 있다고 생각하는 이유를 본인의 역량, 관련 경험 등을 중심으로 설명하십시오. 

 본인 성격의 장단점에 대하여 설명하십시오. 

 오뚜기에 지원하게 된 동기와 입사 후 회사에서 이루고 싶은 목표를 설명하십시오.', '2026-01-27 15:00:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102257', '공간운영지원', '2026-02-03 11:39:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원직무를 잘 수행할 수 있다고 생각하는 이유를 본인의 역량, 관련 경험 등을 중심으로 설명하십시오.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인 성격의 장단점에 대하여 설명하십시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '오뚜기에 지원하게 된 동기와 입사 후 회사에서 이루고 싶은 목표를 설명하십시오.', 2, 500);
END $$;

-- Recruitment 54: 2026년 1분기 수시채용 (ID: 102258)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '티케이지태광';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('티케이지태광', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/105/webp/data.webp?1684485732', '경남 김해시 김해대로2635번길 26', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 1분기 수시채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/404/webp/26%EB%85%84_1%EB%B6%84%EA%B8%B0_%EC%88%98%EC%8B%9C%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0_%EC%97%85%EB%A1%9C%EB%93%9C%EC%9A%A9.webp?1770021551

1. 본인이 당사에 꼭 입사해야 하는 이유와 지원 직무를 위해 했던 구체적인 노력에 대해서 기술해 주십시오. (최대 1,000자 입력가능) 

 2. 주변 사람과 의견이 다른 경우 자신의 의견을 설득하는 자신만의 소통 방식을 기술해 주십시오. (최대 1,000자 입력가능) 

 3. 자신의 경험 중에 반복되는 문제점을 발견하고, 개선했던 경험에 대해 구체적으로 기술해 주십시오. (최대 1,000자 입력가능) 

 4. 지금까지 해오던 방식에서 벗어나 새로운 관점에서 일을 추진했던 경험에 대해서 기술해주십시오. (최대 1,000자 입력가능)', '2026-01-27 00:00:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102258', '치공구개발 (주재원), Costing, 설비개발, 설계 자동화 개발, 치공구개발, Visual Designer, IE (산업공학), 생산계획, 플랫폼개발 (TDS 파견), 정보전략, 재무, 건설지원, 경영기획, 사업관리', '2026-02-03 11:42:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인이 당사에 꼭 입사해야 하는 이유와 지원 직무를 위해 했던 구체적인 노력에 대해서 기술해 주십시오. (최대 1,000자 입력가능)', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 주변 사람과 의견이 다른 경우 자신의 의견을 설득하는 자신만의 소통 방식을 기술해 주십시오. (최대 1,000자 입력가능)', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 자신의 경험 중에 반복되는 문제점을 발견하고, 개선했던 경험에 대해 구체적으로 기술해 주십시오. (최대 1,000자 입력가능)', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 지금까지 해오던 방식에서 벗어나 새로운 관점에서 일을 추진했던 경험에 대해서 기술해주십시오. (최대 1,000자 입력가능)', 3, 1000);
END $$;

-- Recruitment 55: 프로젝트금융3실 경력직 채용 (ID: 102259)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '프로젝트금융3실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/2d0b0df6-c527-4bc4-b61c-44112a922af2.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-27 00:00:00', '2026-02-02 23:59:00', 'https://jasoseol.com/recruit/102259', '프로젝트금융3실', '2026-02-03 11:42:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 56: 2026년 영업/마케팅 신입사원 채용 (ID: 102261)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '풀무원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('풀무원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/357/webp/1682657630_%28%EC%A3%BC%29%ED%92%80%EB%AC%B4%EC%9B%90_185x72.webp?1684484699', '충북 음성군 대소면 삼양로 730-27', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 영업/마케팅 신입사원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/870/webp/26%EB%85%84_%EC%8B%A0%EC%9E%85%EC%82%AC%EC%9B%90_%EA%B3%B5%EA%B0%9C%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0_%EC%88%98%EC%A0%95%EB%B2%84%EC%A0%84.webp?1769588336

1. 지원동기를 자유롭게 작성해주세요. 

 2. 풀무원 영업사원으로서 담당하고 싶은 채널과, 해당 채널에서의 영업 전략을 구체적으로 작성해 주세요. 

 3. 어려운 상황에서 목표를 달성하기 위해 끈기와 열정을 발휘했던 경험과, 이 경험이 본인의 성장에 어떤 영향을 주었는지 작성해 주세요.', '2026-01-27 00:00:00', '2026-02-09 23:59:00', 'https://jasoseol.com/recruit/102261', '영업, 마케팅', '2026-02-03 11:43:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 지원동기를 자유롭게 작성해주세요.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 풀무원 영업사원으로서 담당하고 싶은 채널과, 해당 채널에서의 영업 전략을 구체적으로 작성해 주세요.', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 어려운 상황에서 목표를 달성하기 위해 끈기와 열정을 발휘했던 경험과, 이 경험이 본인의 성장에 어떤 영향을 주었는지 작성해 주세요.', 2, 700);
END $$;

-- Recruitment 57: 데이터사이언스팀 인턴사원 채용 (ID: 102262)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'AXA손해보험';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('AXA손해보험', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/264/webp/AXA_Logo.webp?1684485388', '서울 용산구 한강대로71길 4', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '데이터사이언스팀 인턴사원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/727/webp/%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%82%AC%EC%9D%B4%EC%96%B8%EC%8A%A4%ED%8C%80_%EC%9D%B8%ED%84%B4%EC%82%AC%EC%9B%90_%EC%B1%84%EC%9A%A9.webp?1769499888

해당 포지션 지원 동기를 기술해주세요. 

 본인의 프로젝트 경험 중 지원 직무 수행에 도움이 될 것이라 생각하는 사례를 작성해주세요.', '2026-01-27 16:41:00', '2026-02-05 23:59:00', 'https://jasoseol.com/recruit/102262', '데이터사이언스', '2026-02-03 11:43:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '해당 포지션 지원 동기를 기술해주세요.', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 프로젝트 경험 중 지원 직무 수행에 도움이 될 것이라 생각하는 사례를 작성해주세요.', 1, 1000);
END $$;

-- Recruitment 58: 2026 신입/경력사원 채용 (ID: 102263)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '세아제강';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('세아제강', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/793/webp/%EC%84%B8%EC%95%84%EC%A0%9C%EA%B0%95_CI.webp?1739257559', '서울특별시 마포구 양화로 45', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 신입/경력사원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/280/webp/%EC%84%B8%EC%95%84%EC%A0%9C%EA%B0%95_%EA%B3%B5%EA%B3%A0%EB%AC%B8_8%EC%B0%A8_%EC%B5%9C%EC%A2%85_%281%29.webp?1769993513

세아제강에 지원하게 된 동기를 기술하시오. (최소 500자, 최대 800자 입력가능) 

 지원한 분야 및 직무를 수행하기 위한 본인의 보유 역량을 기술하시오. (최소 500자, 최대 800자 입력가능) 

 세아제강 핵심가치 중, 본인에게 가장 부합되는 가치와 그 이유를 기술하시오. (최소 500자, 최대 800자 입력가능) 

 선후배, 친구, 가족에게 있어 지원자는 어떤 사람이라고 생각하는지 이유와 함께 기술하시오. (최소 500자, 최대 800자 입력가능) 

 살아오면서 자신의 노력으로 이루었던 것 중 가장 성취감을 느꼈던 일이 무엇인지 기술하시오. (최소 500자, 최대 800자 입력가능)', '2026-01-28 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102263', '[서울] 원가, [서울] 구매, [서울] 정보화관리, [서울] ESG경영, [서울] 해외영업, [서울] 해외영업(STS), [포항] 물류, [포항] 품질관리, [포항] 제품개발, [포항] 설비-기계, [포항] 설비-전기, [포항] 인사/노무, [순천] 생산관리, [순천] 노무/총무, [순천] 프로젝트 관리, [창원] 생산기술, [군산] 품질관리', '2026-02-03 11:48:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '세아제강에 지원하게 된 동기를 기술하시오. (최소 500자, 최대 800자 입력가능)', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원한 분야 및 직무를 수행하기 위한 본인의 보유 역량을 기술하시오. (최소 500자, 최대 800자 입력가능)', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '세아제강 핵심가치 중, 본인에게 가장 부합되는 가치와 그 이유를 기술하시오. (최소 500자, 최대 800자 입력가능)', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '선후배, 친구, 가족에게 있어 지원자는 어떤 사람이라고 생각하는지 이유와 함께 기술하시오. (최소 500자, 최대 800자 입력가능)', 3, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '살아오면서 자신의 노력으로 이루었던 것 중 가장 성취감을 느꼈던 일이 무엇인지 기술하시오. (최소 500자, 최대 800자 입력가능)', 4, 800);
END $$;

-- Recruitment 59: 수출부문 KNIT 해외영업(Academy sports) 경력 채용 (ID: 102264)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '신원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('신원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/959/webp/JK_Co_swinsa-1.webp?1684485295', '서울 마포구 도화2동 532번지 신원빌딩', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '수출부문 KNIT 해외영업(Academy sports) 경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/767/webp/260127_%EC%88%98%EC%B6%9C%EB%B6%80%EB%AC%B8_knit_%ED%95%B4%EC%99%B8%EC%98%81%EC%97%85%28Academy_sports%29_%EC%98%81%EC%97%852%EA%B7%B8%EB%A3%B9_4%ED%8C%80.webp?1769559170

자기소개서 

 희망직무와 본인에게 적합한 직무', '2026-01-28 09:09:00', '2026-02-15 23:59:00', 'https://jasoseol.com/recruit/102264', 'KNIT 해외영업(Academy sports)', '2026-02-03 11:48:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '희망직무와 본인에게 적합한 직무', 1, 1000);
END $$;

-- Recruitment 60: 체험형 서비스마케팅 인턴십 (ID: 102265)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '네이버파이낸셜(네이버페이)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('네이버파이낸셜(네이버페이)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/011/021/webp/jss_hashed_533d4bbca6d47c72f928_20251210T155248_03_NAVER_Pay_Brand_Logo_NAVER_Green.webp?1765349571', '경기 성남시 분당구 정자일로 95, 7층, 8층 일부 (정자동,네이버 1784)', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '체험형 서비스마케팅 인턴십', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/774/webp/image.webp?1769563876

[필수] 네이버페이와 해당 포지션에 지원하게 된 동기에 대해 작성해주세요. 

 [필수] 지원하는 직무와 관련하여, 본인의 강점을 나타낼 수 있는 경험(프로젝트, 과제 등)을 소개해주세요.
※학교 과제, 팀 프로젝트, 대외활동, 인턴 등 어떤 경험이든 좋습니다. 

 [선택] 앞서 작성한 내용 이외에 본인의 역량을 충분히 나타낼 수 있는 자료가 있다면 제출해주세요. (30MB 이하의 PDF 또는 URL)
*채용과 무관한 개인정보(거주지 주소, 결혼여부, 연봉정보 등)은 제외해주세요.
*공개가 어려운 대외비 자료 등은 제외해주세요"', '2026-01-29 10:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102265', '마케팅 기획, 마케팅 데이터 분석', '2026-02-03 11:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[필수] 네이버페이와 해당 포지션에 지원하게 된 동기에 대해 작성해주세요.', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[필수] 지원하는 직무와 관련하여, 본인의 강점을 나타낼 수 있는 경험(프로젝트, 과제 등)을 소개해주세요.
※학교 과제, 팀 프로젝트, 대외활동, 인턴 등 어떤 경험이든 좋습니다.', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[선택] 앞서 작성한 내용 이외에 본인의 역량을 충분히 나타낼 수 있는 자료가 있다면 제출해주세요. (30MB 이하의 PDF 또는 URL)
*채용과 무관한 개인정보(거주지 주소, 결혼여부, 연봉정보 등)은 제외해주세요.
*공개가 어려운 대외비 자료 등은 제외해주세요"', 2, 1000);
END $$;

-- Recruitment 61: (서울병원) 영상의학과 방사선사(계약직) 모집 (2026.01) (ID: 102267)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(서울병원) 영상의학과 방사선사(계약직) 모집 (2026.01)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/797/webp/image.webp?1769573296

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-28 10:00:00', '2026-02-03 23:59:00', 'https://jasoseol.com/recruit/102267', '영상의학과-방사선사', '2026-02-03 11:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 62: 2026년도 정규직 채용 공고 (ID: 102268)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국원자력통제기술원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국원자력통제기술원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/074/webp/ci.webp?1684485322', '대전 유성구 유성대로 1418', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년도 정규직 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/798/webp/%ED%95%9C%EA%B5%AD%EC%9B%90%EC%9E%90%EB%A0%A5%ED%86%B5%EC%A0%9C%EC%97%B0%EA%B5%AC%EC%9B%90_%EA%B3%B5%EA%B3%A0%EC%9D%B4%EB%AF%B8%EC%A7%80.webp?1769573331

본인 성격의 장점을 효과적으로 활용한 사례와 단점을 보완하기 위해 노력한 사례를 각각 1개씩 구체적으로 기술하여 주십시오. 

 한정된 자원과 예산 상황에서 본인이 속한 조직이 어려운 일을 극복했던 사례와 당시 본인의 역할을 구체적으로 기술하여 주십시오. 

 최근 5년 이내 지원분야와 관련하여 본인의 자랑할 만한 성취와 이를 이루기 위한 본인의 노력 수준을 구체적으로 기술하여 주십시오. 

 한국원자력통제기술원에 입사하여 5년 내에 이루고 싶은 목표와 장기적인 역량개발 계획에 대하여 기술하여 주십시오.', '2026-01-28 14:00:00', '2026-02-11 18:00:00', 'https://jasoseol.com/recruit/102268', '연구직_원자력통제, 행정직_전산, 행정직_기획예산', '2026-02-03 11:50:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인 성격의 장점을 효과적으로 활용한 사례와 단점을 보완하기 위해 노력한 사례를 각각 1개씩 구체적으로 기술하여 주십시오.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한정된 자원과 예산 상황에서 본인이 속한 조직이 어려운 일을 극복했던 사례와 당시 본인의 역할을 구체적으로 기술하여 주십시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '최근 5년 이내 지원분야와 관련하여 본인의 자랑할 만한 성취와 이를 이루기 위한 본인의 노력 수준을 구체적으로 기술하여 주십시오.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한국원자력통제기술원에 입사하여 5년 내에 이루고 싶은 목표와 장기적인 역량개발 계획에 대하여 기술하여 주십시오.', 3, 500);
END $$;

-- Recruitment 63: 오퍼레이터 신입채용 (ID: 102269)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'DIG에어가스';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('DIG에어가스', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/509/webp/DIG%EC%97%90%EC%96%B4%EA%B0%80%EC%8A%A4_CI.webp?1684488505', '서울 중구 통일로 10, 20층 (남대문로5가,연세대학교 세브란스빌딩)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '오퍼레이터 신입채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/814/webp/%EC%B1%84%EC%9A%A9%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80_%EA%B3%B5%EA%B3%A0__20260128_%28%EC%8B%A0%EC%9E%85%29_%EC%98%A4%ED%8D%BC%EB%A0%88%EC%9D%B4%ED%84%B0.webp?1769574920

DIG AIRGAS를 어떻게 알게 되셨나요? 

 동기 및 포부 

 성격 및 생활신조 

 경력 및 특기사항', '2026-01-28 10:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102269', '오퍼레이터', '2026-02-03 11:50:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'DIG AIRGAS를 어떻게 알게 되셨나요?', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '동기 및 포부', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성격 및 생활신조', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '경력 및 특기사항', 3, 500);
END $$;

-- Recruitment 64: 콘텐츠 PD 인턴(정규전환형) (ID: 102270)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '블랭크코퍼레이션';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('블랭크코퍼레이션', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/683/webp/unnamed_%281%29.webp?1684487705', '서울 강남구 테헤란로 302, 15층, 20층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '콘텐츠 PD 인턴(정규전환형)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/549/original/image.jfif?1769569501

자유양식 입니다.', NULL, NULL, 'https://jasoseol.com/recruit/102270', '콘텐츠 PD', '2026-02-03 11:51:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 65: Global Sales Strategy & Operations Senior Analyst (ID: 102271)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Global Sales Strategy & Operations Senior Analyst', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/553/original/jss_hashed_b2b384b3803e6d4e20e8_20251002T164818_SNS_Profile.png?1769576577', NULL, NULL, 'https://jasoseol.com/recruit/102271', '', '2026-02-03 11:51:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

END $$;

-- Recruitment 66: 2026년 신입/경력 채용 (ID: 102272)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'GS에너지';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('GS에너지', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/152/webp/data.webp?1684485345', '서울 강남구 논현로 508', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 신입/경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/467/webp/GS%EC%97%90%EB%84%88%EC%A7%80_%ED%86%B5%ED%95%A9_0127_%281%29.webp?1770084283

1. 우리 회사에 지원하게 된 동기와 회사의 어떤 점이 본인과 잘 맞다고 생각하는지 작성해 주세요. 

 2. 지원 분야에 필요한 역량을 갖추기 위해 노력한 경험을 구체적으로 작성해 주세요. 

 3. 기존과 다른 새로운 접근 방식을 적용해 개선했던 경험과 그 과정에서 배운 점을 작성해 주세요. 

 4. 해보지 않은 일에 스스로 선택해 도전했던 경험과 그 과정에서 배운 점을 작성해 주세요. 

 5. 타인의 피드백을 열린 태도로 수용했던 경험과 이를 어떻게 행동으로 반영했는지 작성해 주세요. 

 6. 본인의 역할 범위를 넘어 공동의 목표 달성을 위해 협업했던 경험을 작성해 주세요.', '2026-01-29 09:00:00', '2026-02-13 15:00:00', 'https://jasoseol.com/recruit/102272', '태양광사업, 자금/회계, 감사, SMR사업', '2026-02-03 11:52:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 우리 회사에 지원하게 된 동기와 회사의 어떤 점이 본인과 잘 맞다고 생각하는지 작성해 주세요.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 지원 분야에 필요한 역량을 갖추기 위해 노력한 경험을 구체적으로 작성해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 기존과 다른 새로운 접근 방식을 적용해 개선했던 경험과 그 과정에서 배운 점을 작성해 주세요.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 해보지 않은 일에 스스로 선택해 도전했던 경험과 그 과정에서 배운 점을 작성해 주세요.', 3, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '5. 타인의 피드백을 열린 태도로 수용했던 경험과 이를 어떻게 행동으로 반영했는지 작성해 주세요.', 4, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '6. 본인의 역할 범위를 넘어 공동의 목표 달성을 위해 협업했던 경험을 작성해 주세요.', 5, 500);
END $$;

-- Recruitment 67: [인턴] Global Sales Intern (ID: 102273)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '넥스트챕터';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('넥스트챕터', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/268/webp/logo_square2.webp?1702955870', '서울시 성동구 성수일로 111, 선명스퀘어 14층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[인턴] Global Sales Intern', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/554/original/TA_CI.jpg?1769578217

스타트업에서 근무하시고자 하는 이유는 무엇인가요? 

 넥스트챕터에 대해 알고, 지원하게 되신 계기는 무엇인가요? 

 10년 뒤 목표가 있다면 무엇인가요? 

 인터뷰 합격 시 합류 가능하신 일정이 어떻게 되시나요?', NULL, NULL, 'https://jasoseol.com/recruit/102273', 'Global Sales Intern', '2026-02-03 11:52:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '스타트업에서 근무하시고자 하는 이유는 무엇인가요?', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '넥스트챕터에 대해 알고, 지원하게 되신 계기는 무엇인가요?', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '10년 뒤 목표가 있다면 무엇인가요?', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '인터뷰 합격 시 합류 가능하신 일정이 어떻게 되시나요?', 3, 500);
END $$;

-- Recruitment 68: 풀재택근무 아마존JP/US Brand Manager 정규직 전환형 인턴 (ID: 102274)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '샤인플로';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('샤인플로', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/626/webp/jss_hashed_087d5a04b642840e2be0_20250620T104911_unnamed%285%29.webp?1751872287', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '풀재택근무 아마존JP/US Brand Manager 정규직 전환형 인턴', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/838/webp/%28%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%29BM-US-JP-%E1%84%8E%E1%85%A2%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%80%E1%85%A9%E1%86%BC%E1%84%80%E1%85%A9.webp?1769581598

자유양식 입니다.', '2026-01-29 00:00:00', '2026-02-16 23:59:00', 'https://jasoseol.com/recruit/102274', 'Brand Manager', '2026-02-03 11:52:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 69: 마케팅 영상 크리에이터 신입사원/경력 채용 (ID: 102275)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에코마케팅';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에코마케팅', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/091/webp/echo_logo_blue.webp?1684487221', '서울 송파구 올림픽로35다길 42, 10,15,24층 (신천동,한국루터회관)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '마케팅 영상 크리에이터 신입사원/경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/849/webp/%EB%A7%88%EC%BC%80%ED%8C%85_%EC%98%81%EC%83%81_%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0_01.28.webp?1769583740

[신입] 1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요. 

 [경력직] 1. 기존 커리어를 떠나, 에코마케팅에서 새롭게 도전하려는 이유를 작성해주세요. (*작성 가이드 : 이전의 직장 생활에서 느꼈던 점, 이직을 결정할 때 중요하게 고려했던 기준을 포함해 작성해주세요.) 

 2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요. 

 3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', '2026-01-28 16:01:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102275', '영상 크리에이터', '2026-02-03 11:53:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[신입] 1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요.', 0, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[경력직] 1. 기존 커리어를 떠나, 에코마케팅에서 새롭게 도전하려는 이유를 작성해주세요. (*작성 가이드 : 이전의 직장 생활에서 느꼈던 점, 이직을 결정할 때 중요하게 고려했던 기준을 포함해 작성해주세요.)', 1, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요.', 2, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', 3, 9999);
END $$;

-- Recruitment 70: 커머스 마케터 신입/경력 채용 (ID: 102276)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에코마케팅';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에코마케팅', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/091/webp/echo_logo_blue.webp?1684487221', '서울 송파구 올림픽로35다길 42, 10,15,24층 (신천동,한국루터회관)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '커머스 마케터 신입/경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/852/webp/_%EC%97%90%EC%BD%94%EB%A7%88%EC%BC%80%ED%8C%85__%EC%BB%A4%EB%A8%B8%EC%8A%A4_%EB%A7%88%EC%BC%80%ED%84%B0_%EC%8B%A0%EC%9E%85_%EA%B2%BD%EB%A0%A5_%EC%B1%84%EC%9A%A9.webp?1769584626

[경력] 1. 기존 커리어를 떠나, 에코마케팅에서 새롭게 도전하려는 이유를 작성해주세요. (*작성 가이드 : 이전의 직장 생활에서 느꼈던 점, 이직을 결정할 때 중요하게 고려했던 기준을 포함해 작성해주세요.) 

 [신입] 1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요. 

 [공통] 2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요. 

 [공통] 3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', '2026-01-28 16:15:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102276', '커머스 마케터', '2026-02-03 11:53:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[경력] 1. 기존 커리어를 떠나, 에코마케팅에서 새롭게 도전하려는 이유를 작성해주세요. (*작성 가이드 : 이전의 직장 생활에서 느꼈던 점, 이직을 결정할 때 중요하게 고려했던 기준을 포함해 작성해주세요.)', 0, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[신입] 1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요.', 1, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[공통] 2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요.', 2, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[공통] 3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', 3, 9999);
END $$;

-- Recruitment 71: PV(Pharmacovigilance) 담당자 모집 (신입/경력) (ID: 102277)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'GC셀';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('GC셀', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/292/webp/%EC%A7%80%EC%94%A8%EC%85%80_CI_%EC%98%81%EB%AC%B8.webp?1684488676', '경기도 용인시 기흥구 이현로30번길 107 -', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'PV(Pharmacovigilance) 담당자 모집 (신입/경력)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/855/webp/1.%EA%B8%B0%EC%97%85%EC%86%8C%EA%B0%9C_850_%ED%86%B5%ED%95%A9.webp?1769585503

GC Cell에 지원하게 된 동기는 무엇이며, 지원 분야에서 이루고 싶은 목표에 대해 작성해 주세요. 

 해당 직무를 지원한 이유와 지원 직무와 관련된 본인의 경쟁력이 무엇인지 작성해 주세요. 

 연구 또는 프로젝트 과정에서 예상치 못한 문제에 직면했을 때, 이를 해결하기 위해 시도했던 방법과 그 결과에 대해 구체적으로 작성해 주세요. 

 본인이 참여했던 연구 또는 프로젝트 중 가장 기억에 남는 경험과 그 프로젝트에서의 역할과 성과에 대해 작성해 주세요.', '2026-01-28 16:30:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102277', 'PV', '2026-02-03 11:53:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'GC Cell에 지원하게 된 동기는 무엇이며, 지원 분야에서 이루고 싶은 목표에 대해 작성해 주세요.', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '해당 직무를 지원한 이유와 지원 직무와 관련된 본인의 경쟁력이 무엇인지 작성해 주세요.', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '연구 또는 프로젝트 과정에서 예상치 못한 문제에 직면했을 때, 이를 해결하기 위해 시도했던 방법과 그 결과에 대해 구체적으로 작성해 주세요.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 참여했던 연구 또는 프로젝트 중 가장 기억에 남는 경험과 그 프로젝트에서의 역할과 성과에 대해 작성해 주세요.', 3, 1000);
END $$;

-- Recruitment 72: 2026 채용연계형 봄 인턴십 (ID: 102278)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '펄어비스';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('펄어비스', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/865/webp/Pearlabyss_%EC%B2%AD%EC%83%89_%EA%B8%80%EC%94%A8%EB%A7%8C.webp?1684487484', '경기 과천시 과천대로2길 48', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 채용연계형 봄 인턴십', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/864/webp/%ED%8E%84%EC%96%B4%EB%B9%84%EC%8A%A4_260129_2026%EB%B4%84%EC%9D%B8%ED%84%B4%EC%8B%AD_PC_btn.webp?1769587091

펄어비스 및 해당 직무를 지원한 이유와 회사에서 이루고 싶은 일을 작성해 주세요. 

 본인의 성장과정을 포함해 자기 자신을 자유롭게 소개해 주세요. (현재의 자신에게 영향을 끼친 사건, 인물 등을 포함하여 기술) 

 본인의 삶에서 다른 사람에게 꼭 이야기 해주고 싶은 경험이 있다면 기술해 주세요.', '2026-01-29 00:00:00', '2026-02-10 15:00:00', 'https://jasoseol.com/recruit/102278', '게임플레이, AI, 캐릭터&애니메이션, 렌더링, 게임플랫폼, 모바일플랫폼, 캐릭터 모델링, 배경 모델링, 애니메이션, 셰이더, 웹디자인/UI, 게임 비주얼 콘셉트, 게임디자인(기획), 서비스디자인(웹기획)', '2026-02-03 11:56:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '펄어비스 및 해당 직무를 지원한 이유와 회사에서 이루고 싶은 일을 작성해 주세요.', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성장과정을 포함해 자기 자신을 자유롭게 소개해 주세요. (현재의 자신에게 영향을 끼친 사건, 인물 등을 포함하여 기술)', 1, 1500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 삶에서 다른 사람에게 꼭 이야기 해주고 싶은 경험이 있다면 기술해 주세요.', 2, 1000);
END $$;

-- Recruitment 73: 디지털 마케팅 (ID: 102279)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '어니스트리';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('어니스트리', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/362/webp/%EC%96%B4%EB%8B%88%EC%8A%A4%ED%8A%B8%EB%A6%AC_%EB%A1%9C%EA%B3%A0.webp?1715328078', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '디지털 마케팅', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/869/webp/%EC%83%81%ED%92%88%EA%B8%B0%ED%9A%8D.webp?1769588084

현직장(또는 전직장)에서의 동료들은 나를 어떤 사람으로 평가하고 있는지 기술하시오.(최소글자100~최대글자 1000) 

 지원한 직무를 통해 이루고 싶은 나의 목표는 무엇인가요?(최소글자100~최대글자 1000) 

 현재까지 쌓은 경력 중 성과를 도출하였던 프로젝트에 대해 기술하시오.(최소글자100~최대글자 1000) 

 본인의 강점과 연관하여 지원동기를 기술하시오.(최소글자100~최대글자 1000) 

 자신의 한계점에 도전해 본 경험은 무엇인가요?(최소글자100~최대글자 1000) 

 협력하여 목표를 달성했거나 어려움을 극복한 사례가 있다면 기술하시오.(최소글자100~최대글자 1000)', '2026-01-28 17:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102279', '상품기획 및 개발 PM', '2026-02-03 11:56:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현직장(또는 전직장)에서의 동료들은 나를 어떤 사람으로 평가하고 있는지 기술하시오.(최소글자100~최대글자 1000)', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원한 직무를 통해 이루고 싶은 나의 목표는 무엇인가요?(최소글자100~최대글자 1000)', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현재까지 쌓은 경력 중 성과를 도출하였던 프로젝트에 대해 기술하시오.(최소글자100~최대글자 1000)', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 강점과 연관하여 지원동기를 기술하시오.(최소글자100~최대글자 1000)', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 한계점에 도전해 본 경험은 무엇인가요?(최소글자100~최대글자 1000)', 4, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '협력하여 목표를 달성했거나 어려움을 극복한 사례가 있다면 기술하시오.(최소글자100~최대글자 1000)', 5, 1000);
END $$;

-- Recruitment 74: 2026 Vision''s Edge Device Academy 4기 (VEDA) (ID: 102280)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한화비전';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한화비전', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/557/webp/News-Hanwha-Vision_thumbnail-1-600x405.webp?1684485922', '경기 성남시 분당구 판교로319번길 6', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 Vision''s Edge Device Academy 4기 (VEDA)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/875/webp/image.webp?1769591463

VEDA 지원 동기 및 진로 계획(50자 이상)
Ex) 배우고 싶은 내용, 교육과 관련한 경험, 희망하는 취업 직무, 채용 희망 기업 규모, 본 교육에 바라는 점 등 다양한 이야기를 들려주세요!', '2026-02-02 00:00:00', '2026-03-02 23:59:00', 'https://jasoseol.com/recruit/102280', 'Vision''s Edge Device Academy (VEDA)', '2026-02-03 11:56:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'VEDA 지원 동기 및 진로 계획(50자 이상)
Ex) 배우고 싶은 내용, 교육과 관련한 경험, 희망하는 취업 직무, 채용 희망 기업 규모, 본 교육에 바라는 점 등 다양한 이야기를 들려주세요!', 0, 10000);
END $$;

-- Recruitment 75: Risk Management 담당자 채용 (ID: 102281)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '마이다스그룹';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('마이다스그룹', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/668/webp/midas%EB%A1%9C%EA%B3%A0.webp?1684488774', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Risk Management 담당자 채용', 'https://midas.recruiter.co.kr/upload/1/image/202601/0c7def3e-8548-4ff1-b832-24bde3f3785b.png

자기소개서 문항이 존재하지 않습니다.', '2026-01-28 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102281', '경영분야-법무담당자-판교본사', '2026-02-03 11:57:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 1);
END $$;

-- Recruitment 76: 백엔드 개발자 채용(역량검사) (ID: 102282)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '마이다스그룹';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('마이다스그룹', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/668/webp/midas%EB%A1%9C%EA%B3%A0.webp?1684488774', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '백엔드 개발자 채용(역량검사)', 'https://midas.recruiter.co.kr/upload/1/image/202601/017c9a87-5316-41cb-8831-efdb6982ef7e.png

자기소개서 문항이 존재하지 않습니다.', '2026-01-28 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102282', '개발분야-백엔드 개발-판교본사', '2026-02-03 11:57:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 1);
END $$;

-- Recruitment 77: (광명병원) 분만실 간호사 (정규직) 모집(2026.01) (ID: 102283)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '중앙대학교병원';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('중앙대학교병원', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/007/443/webp/open-uri20220503-28544-gewo5j.webp?1684487635', '서울 동작구 흑석로 84', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '(광명병원) 분만실 간호사 (정규직) 모집(2026.01)', 'https://infra1-static.recruiter.co.kr/builder/2025/11/12/3e9bac52-a7b7-4da4-a0d2-e294d4e7a506.png

성장과정 

 본인의 장단점 

 지원동기 및 포부 

 기타 (경력사항등)', '2026-01-28 10:00:00', '2026-02-01 23:59:00', 'https://jasoseol.com/recruit/102283', '정규직(신규)-간호사-분만실', '2026-02-03 11:57:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '성장과정', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 장단점', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 포부', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (경력사항등)', 3, 500);
END $$;

-- Recruitment 78: IB솔루션2실 경력직 채용 (ID: 102284)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'IB솔루션2실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/bc99f777-e3af-4139-8c15-cbcf93aa05ee.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항', '2026-01-28 00:00:00', '2026-02-03 23:59:00', 'https://jasoseol.com/recruit/102284', 'IB솔루션2실', '2026-02-03 11:58:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항', 3, 1000);
END $$;

-- Recruitment 79: ERP 서비스 운영 (ID: 102285)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'NHN Dooray';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('NHN Dooray', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/307/webp/jss_hashed_ad39a536d424e8550e8e_20251215T172601_NHN_DOORAY_Black.webp?1765787161', '경기 성남시 분당구 대왕판교로645번길 16 (삼평동,플레이뮤지엄)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'ERP 서비스 운영', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/568/original/jss_hashed_73dbf77a2186c7300b0f_20260129T082320_NHN_DOORAY_Black.png?1769642621

자신에 대해 자유롭게 표현해 보세요.', NULL, NULL, 'https://jasoseol.com/recruit/102285', 'ERP 서비스 운영', '2026-02-03 11:58:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신에 대해 자유롭게 표현해 보세요.', 0, 1000);
END $$;

-- Recruitment 80: 협업 서비스 두레이 온보딩 매니저 (ID: 102286)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'NHN Dooray';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('NHN Dooray', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/307/webp/jss_hashed_ad39a536d424e8550e8e_20251215T172601_NHN_DOORAY_Black.webp?1765787161', '경기 성남시 분당구 대왕판교로645번길 16 (삼평동,플레이뮤지엄)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '협업 서비스 두레이 온보딩 매니저', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/569/original/jss_hashed_8e4954e5fa8065357161_20260129T082439_NHN_DOORAY_Black.png?1769642698

자신에 대해 자유롭게 표현해보세요.', NULL, NULL, 'https://jasoseol.com/recruit/102286', '협업 서비스 두레이 온보딩 매니저', '2026-02-03 11:58:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신에 대해 자유롭게 표현해보세요.', 0, 1000);
END $$;

-- Recruitment 81: 2026년 제1차 기간제근로자 통합채용 공고 (ID: 102287)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국교통안전공단(KOTSA)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국교통안전공단(KOTSA)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/425/webp/0000702987_%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EC%95%88%EC%A0%84%EA%B3%B5%EB%8B%A8_185x72.webp?1684484710', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 제1차 기간제근로자 통합채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/913/webp/%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EC%95%88%EC%A0%84%EA%B3%B5%EB%8B%A8_1.webp?1769648085

공단 지원 동기와 해당 직무 경험 후 본인의 비전에 대해 작성해 주시기 바랍니다. 

 직무 수행을 위해 그 동안 어떤 자기개발 노력을 해 왔는지 작성해 주시기 바랍니다. 

 최근 본인이 심적, 체력적, 환경적으로 한계에 부딪혔던 상황에 대해 생각해보고, 이를 해결하기 위해 노력했던 사항에 대해 작성해 주시기 바랍니다. 

 최근 문제를 개선, 해결하기 위해 아이디어를 제시했던 경험에 대해 생각해보고, 그 아이디어의 내용과 적용과정 및 결과에 대해 작성해 주시기 바랍니다.', '2026-01-29 16:00:00', '2026-02-13 10:00:00', 'https://jasoseol.com/recruit/102287', '운영지원처_실무원(상담)_콜센터 전화상담, 모빌리티연구처_위촉연구원 6급_국가대중교통정보센터 운영 보조, 모빌리티연구처_청년인턴(사무)_버스정보시스템 통합센터 운영 보조, 모빌리티연구처_청년인턴(사무)_교통약자 이동편의 실태조사 연구 지원(현황정리 및 조사), 모빌리티연구처_청년인턴(사무)_국가교통안전기본계획 수립 연구 업무 지원, 데이터융복합처_청년인턴(사무)_운행기록 데이터 분석, 문서작성 등 사무 및 행정업무, 데이터융복합처_청년인턴(사무)_교통카드 데이터 분석, 문서작성 등 사무 및 행정업무, 데이터융복합처_청년인턴(사무)_데이터·통계 분석 등 사무 및 문서 작성 업무, 교통안전처_청년인턴(사무)_공익제보단 민원응대 및 부서 사무보조, 교통안전처_청년인턴(사무)_지원 사업 수행 및 운수종사자격 민원 상담 등, 기후탄소물류처_위촉연구원6급_화물운송산업 정책 연구 및 행정 지원, 탄소중립정책팀_위촉연구원6급_수송부문 탄소중립사업 연구보조(목표관리제), 탄소중립정책팀_위촉연구...', '2026-02-03 12:23:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '공단 지원 동기와 해당 직무 경험 후 본인의 비전에 대해 작성해 주시기 바랍니다.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직무 수행을 위해 그 동안 어떤 자기개발 노력을 해 왔는지 작성해 주시기 바랍니다.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '최근 본인이 심적, 체력적, 환경적으로 한계에 부딪혔던 상황에 대해 생각해보고, 이를 해결하기 위해 노력했던 사항에 대해 작성해 주시기 바랍니다.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '최근 문제를 개선, 해결하기 위해 아이디어를 제시했던 경험에 대해 생각해보고, 그 아이디어의 내용과 적용과정 및 결과에 대해 작성해 주시기 바랍니다.', 3, 500);
END $$;

-- Recruitment 82: Barista Support (ID: 102288)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '비바리퍼블리카(토스)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('비바리퍼블리카(토스)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/011/256/webp/icon-toss-logo_%281%29.webp?1684487963', '서울 강남구 테헤란로 142, 4층, 10층, 11층, 12층, 13층, 22층, 23층 (역삼동,아크플레이스)', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Barista Support', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/929/webp/30.webp?1769651656

토스 커피사일로에 지원하게 된 동기는 무엇인가요? 

 보유하고 계신 경력 기간 중 사용했던 머신, 담당했던 업무 영역(바 업무, 발주관리 등)을 말씀해 주세요!', '2026-01-29 10:53:00', '2026-02-27 23:59:00', 'https://jasoseol.com/recruit/102288', 'Barista Support', '2026-02-03 12:24:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '토스 커피사일로에 지원하게 된 동기는 무엇인가요?', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '보유하고 계신 경력 기간 중 사용했던 머신, 담당했던 업무 영역(바 업무, 발주관리 등)을 말씀해 주세요!', 1, 700);
END $$;

-- Recruitment 83: 2026년 일반직(사무행정) 직원 채용 (ID: 102289)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '언론중재위원회';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('언론중재위원회', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/724/webp/%E1%84%8B%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A9%E1%86%AB.webp?1684486372', '서울 중구 세종대로 124, 프레스센', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 일반직(사무행정) 직원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/386/webp/%EC%96%B8%EC%A4%91%EC%9C%84_2026_%EC%9D%BC%EB%B0%98%EC%A7%81_%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0%EB%AC%B8_%EC%9D%B4%EB%AF%B8%EC%A7%80_%282%29.webp?1770019189

본 채용에 지원한 동기와 지원직무에 관한 본인의 역량을 기술하시오. 

 자신의 생각이나 의견을 상대방에게 설득했던 경험을 구체적으로 기술하시오. 

 최근 5년 동안 겪었던 경험 중 가장 어려웠던 경험이 무엇이었으며, 그 경험을 극복한 방법을 기술하시오. 

 우리 위원회에 가장 부합하는 인재상은 무엇이라고 생각하는지 기술하시오. 

 위원회 입사 후 본인의 포부를 기술하시오.', '2026-02-02 10:00:00', '2026-02-19 14:00:00', 'https://jasoseol.com/recruit/102289', '사무행정(일반직 5급-서울), 사무행정(일반직 5급-광주)', '2026-02-03 12:24:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본 채용에 지원한 동기와 지원직무에 관한 본인의 역량을 기술하시오.', 0, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 생각이나 의견을 상대방에게 설득했던 경험을 구체적으로 기술하시오.', 1, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '최근 5년 동안 겪었던 경험 중 가장 어려웠던 경험이 무엇이었으며, 그 경험을 극복한 방법을 기술하시오.', 2, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '우리 위원회에 가장 부합하는 인재상은 무엇이라고 생각하는지 기술하시오.', 3, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '위원회 입사 후 본인의 포부를 기술하시오.', 4, 600);
END $$;

-- Recruitment 84: Global Strategy Manager (ID: 102290)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Global Strategy Manager', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/576/original/jss_hashed_5ef3ea7d65963e0ceb5d_20260109T110211_SNS_Profile.png?1769652832

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102290', 'Global Strategy Manager', '2026-02-03 12:24:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 85: 직원 채용공고 (ID: 102291)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '새마을금고복지회';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('새마을금고복지회', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/861/webp/%EB%B3%B5%EC%A7%80%ED%9A%8C%EB%A1%9C%EA%B3%A0_%EA%B8%80%EC%94%A8%ED%81%AC%EA%B2%8C.webp?1695284292', '서울 강서구 공항대로 396 (화곡동,주식회사귀뚜라미보일러사옥빌딩)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '직원 채용공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/943/webp/%EC%83%88%EB%A7%88%EC%9D%84%EA%B8%88%EA%B3%A0%EB%B3%B5%EC%A7%80%ED%9A%8C_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0.webp?1769653895

우리 회사에 지원한 동기와 입사 후 성취하고 싶은 목표 및 실행계획에  대해 기술해 주세요. 

 본인에게 부여된 업무가 아니었음에도 불구하고, 팀 또는 조직의목표 달성을 위해 자발적으로 나섰던 경험에 대해 서술해 주세요. 

 본인이 업무를 수행하는데 있어 가지고 있는 핵심역량과 그 역량을  발휘했던 구체적인 경험을 서술해 주세요. 

 그동안 가장 열정적으로 임했던 과제는 무엇이었고, 무슨 고민을 했는지와 어떤 결과가 있었는지 구체적으로 기술해 주세요 

 우리 회사에 지원한 동기와 입사 후 성취하고 싶은 목표 및 실행계획에  대해 기술해 주세요. 

 본인에게 부여된 업무가 아니었음에도 불구하고, 팀 또는 조직의목표 달성을 위해 자발적으로 나섰던 경험에 대해 서술해 주세요. 

 본인이 업무를 수행하는데 있어 가지고 있는 핵심역량과 그 역량을  발휘했던 구체적인 경험을 서술해 주세요. 

 그동안 가장 열정적으로 임했던 과제는 무엇이었고, 무슨 고민을 했는지와 어떤 결과가 있었는지 구체적으로 기술해 주세요', '2026-01-29 11:25:00', '2026-02-06 14:00:00', 'https://jasoseol.com/recruit/102291', '자금운용, IT전산, 일반관리', '2026-02-03 12:26:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '우리 회사에 지원한 동기와 입사 후 성취하고 싶은 목표 및 실행계획에  대해 기술해 주세요.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인에게 부여된 업무가 아니었음에도 불구하고, 팀 또는 조직의목표 달성을 위해 자발적으로 나섰던 경험에 대해 서술해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 업무를 수행하는데 있어 가지고 있는 핵심역량과 그 역량을  발휘했던 구체적인 경험을 서술해 주세요.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '그동안 가장 열정적으로 임했던 과제는 무엇이었고, 무슨 고민을 했는지와 어떤 결과가 있었는지 구체적으로 기술해 주세요', 3, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '우리 회사에 지원한 동기와 입사 후 성취하고 싶은 목표 및 실행계획에  대해 기술해 주세요.', 4, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인에게 부여된 업무가 아니었음에도 불구하고, 팀 또는 조직의목표 달성을 위해 자발적으로 나섰던 경험에 대해 서술해 주세요.', 5, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 업무를 수행하는데 있어 가지고 있는 핵심역량과 그 역량을  발휘했던 구체적인 경험을 서술해 주세요.', 6, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '그동안 가장 열정적으로 임했던 과제는 무엇이었고, 무슨 고민을 했는지와 어떤 결과가 있었는지 구체적으로 기술해 주세요', 7, 500);
END $$;

-- Recruitment 86: 마케팅 사무보조 계약직 채용 (ID: 102292)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에코마케팅';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에코마케팅', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/091/webp/echo_logo_blue.webp?1684487221', '서울 송파구 올림픽로35다길 42, 10,15,24층 (신천동,한국루터회관)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '마케팅 사무보조 계약직 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/962/webp/%EC%82%AC%EB%AC%B4%EB%B3%B4%EC%A1%B0.webp?1769658762

1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요. 

 2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요. 

 3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', '2026-01-29 12:51:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102292', '마케팅 사무보조', '2026-02-03 12:26:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요.', 0, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요.', 1, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', 2, 9999);
END $$;

-- Recruitment 87: S-개발자 4기(상반기) 모집 (ID: 102293)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국정보보호산업협회';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국정보보호산업협회', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/773/webp/ci.webp?1691644543', '서울 송파구 중대로 135, 서관 14층 (가락동,아이티벤처타워)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'S-개발자 4기(상반기) 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/969/webp/image.webp?1769660488

활용 가능한 프로그래밍 언어 및 기술 스택의 숙련도를 작성해 주세요. (상/중/하 선택 및 설명 기술) 

 정보보호 또는 SW 개발 관련 주요 경험(프로젝트, 해커톤, 대외활동, 논문 등)을 기술해 주세요. 

 S-개발자 4기에 지원하게 된 동기와 교육 과정을 통해 이루고자 하는 구체적인 목표를 기술해 주세요. 

 본 과정에서 팀원들과 함께 수행하고 싶은 보안 개발 프로젝트 주제와, 수료 후 희망하는 직무를 작성해 주세요.', '2026-02-01 00:00:00', '2026-02-23 11:00:00', 'https://jasoseol.com/recruit/102293', 'S-개발자 4기', '2026-02-03 12:26:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '활용 가능한 프로그래밍 언어 및 기술 스택의 숙련도를 작성해 주세요. (상/중/하 선택 및 설명 기술)', 0, 300);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '정보보호 또는 SW 개발 관련 주요 경험(프로젝트, 해커톤, 대외활동, 논문 등)을 기술해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'S-개발자 4기에 지원하게 된 동기와 교육 과정을 통해 이루고자 하는 구체적인 목표를 기술해 주세요.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본 과정에서 팀원들과 함께 수행하고 싶은 보안 개발 프로젝트 주제와, 수료 후 희망하는 직무를 작성해 주세요.', 3, 500);
END $$;

-- Recruitment 88: 2026년 상반기 채용 연계형 AE 공채 인턴 (ID: 102294)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '매드업';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('매드업', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/005/585/webp/jss_hashed_ade1bc81041124d0752c_20251216T181809_logologo_%281%29.webp?1765876689', '서울 서초구 서초대로74길 4, 20층 (서초동,삼성생명서초타워)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 상반기 채용 연계형 AE 공채 인턴', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/339/970/webp/2026_1H_AE_intern_3mb.webp?1769660576

회사 선택의 기준이 무엇이고, 그 기준에 매드업이 부합하는 이유를 설명해 주세요. (500자 내외, 최대 800자) 

 힘든 상황에도 불구하고 포기하지 않고 결과를 냈던 경험을 설명해주세요. (500자 내외, 최대 800자)
*어떤 어려운 상황이었는지, 그럼에도 불구하고 무엇이 본인을 움직이게 했는지 구체적으로 작성해주세요. 

 본인이 맡은 일이나 프로젝트에서 더 나은 결과를 만들기 위해 기존 방식에서 벗어나 개선을 시도했던 경험을 설명해 주세요. (500자 내외, 최대 800자)
*왜 개선이 필요하다고 판단했는지, 어떤 변화를 주었고 결과는 어땠는지 구체적으로 작성해 주세요. 

 실수를 했던 경험이 있다면 그것을 어떻게 책임지고 해결했는지 작성해 주세요 (500자 내외, 최대 800자)
*해당 경험이 지금의 본인에게 어떤 영향을 미쳤는지도 함께 알려주세요.', '2026-02-02 00:00:00', '2026-02-15 23:59:00', 'https://jasoseol.com/recruit/102294', '퍼포먼스 마케터(AE) (국내), 퍼포먼스 마케터(AE) (글로벌(일본))', '2026-02-03 12:27:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '회사 선택의 기준이 무엇이고, 그 기준에 매드업이 부합하는 이유를 설명해 주세요. (500자 내외, 최대 800자)', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '힘든 상황에도 불구하고 포기하지 않고 결과를 냈던 경험을 설명해주세요. (500자 내외, 최대 800자)
*어떤 어려운 상황이었는지, 그럼에도 불구하고 무엇이 본인을 움직이게 했는지 구체적으로 작성해주세요.', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 맡은 일이나 프로젝트에서 더 나은 결과를 만들기 위해 기존 방식에서 벗어나 개선을 시도했던 경험을 설명해 주세요. (500자 내외, 최대 800자)
*왜 개선이 필요하다고 판단했는지, 어떤 변화를 주었고 결과는 어땠는지 구체적으로 작성해 주세요.', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '실수를 했던 경험이 있다면 그것을 어떻게 책임지고 해결했는지 작성해 주세요 (500자 내외, 최대 800자)
*해당 경험이 지금의 본인에게 어떤 영향을 미쳤는지도 함께 알려주세요.', 3, 800);
END $$;

-- Recruitment 89: 26년도 1차 직원 채용 공고 (ID: 102295)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '서울창조경제혁신센터';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('서울창조경제혁신센터', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/012/505/webp/%EB%A1%9C%EC%BD%94.webp?1684488293', '서울 용산구 한강대로 69, 501호502호 (한강로2가,용산푸르지오써밋)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '26년도 1차 직원 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/006/webp/image.webp?1769668206

지원동기 (최소 100자) 

 경험 및 경력 (최소 100자) 

 문제해결 사례(경험) (최소 100자) 

 입사 후 포부 (최소 100자) 

 기타 (최소 100자) 

 직무수행 계획서 (최소 100자)', '2026-01-29 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102295', '창업지원 및 사업운영', '2026-02-03 12:27:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 (최소 100자)', 0, 20000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '경험 및 경력 (최소 100자)', 1, 20000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '문제해결 사례(경험) (최소 100자)', 2, 20000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 포부 (최소 100자)', 3, 20000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기타 (최소 100자)', 4, 20000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직무수행 계획서 (최소 100자)', 5, 20000);
END $$;

-- Recruitment 90: [경영지원] 해외법인 관리/결산 채용연계형 인턴사원 모집 (ID: 102296)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에이피알';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에이피알', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/158/webp/%EC%9E%90%EC%82%B0_1_2x.webp?1684487245', '서울시 송파구 올림픽로 300, 36층/27층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[경영지원] 해외법인 관리/결산 채용연계형 인턴사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/017/webp/%EA%B2%BD%EC%98%81%EC%A7%80%EC%9B%90-%ED%95%B4%EC%99%B8%EB%B2%95%EC%9D%B8-%EA%B4%80%EB%A6%AC-%EA%B2%B0%EC%82%B0-%EC%B1%84%EC%9A%A9%EC%97%B0%EA%B3%84%ED%98%95-%EC%9D%B8%ED%84%B4%EC%82%AC%EC%9B%90-%EB%AA%A8%EC%A7%91-%EC%97%90%EC%9D%B4%ED%94%BC%EC%95%8C-01-29-2026_03_54_PM.webp?1769669985

1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음) 

 2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음) 

 3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', NULL, NULL, 'https://jasoseol.com/recruit/102296', '[경영지원] 해외법인 관리/결산 채용연계형', '2026-02-03 12:28:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음)', 0, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', 2, 10000);
END $$;

-- Recruitment 91: 마케팅부 사원을 모집합니다. (ID: 102297)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '창비';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('창비', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/156/webp/changbi-b-center.webp?1689723880', '경기도 파주시 회동길 184', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '마케팅부 사원을 모집합니다.', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/580/original/changbi-b-center.JPG?1769669298

자신에 대해 자유롭게 표현해 보세요. (성격, 재능, 관심사, 흥미롭게 읽은 책 등의 내용을 담아주세요.) 

 지원 동기와 입사 후 자신의 미래 모습에 대해 써 주세요. (자신이 생각하는 마케터상에 대한 내용을 담아주시기 바랍니다.)', '2026-01-31 00:00:00', '2026-02-19 23:59:00', 'https://jasoseol.com/recruit/102297', '마케팅', '2026-02-03 12:28:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신에 대해 자유롭게 표현해 보세요. (성격, 재능, 관심사, 흥미롭게 읽은 책 등의 내용을 담아주세요.)', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원 동기와 입사 후 자신의 미래 모습에 대해 써 주세요. (자신이 생각하는 마케터상에 대한 내용을 담아주시기 바랍니다.)', 1, 500);
END $$;

-- Recruitment 92: [경영지원] 화장품 해외 인허가(RA) 채용연계형 인턴사원 모집 (ID: 102298)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에이피알';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에이피알', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/158/webp/%EC%9E%90%EC%82%B0_1_2x.webp?1684487245', '서울시 송파구 올림픽로 300, 36층/27층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[경영지원] 화장품 해외 인허가(RA) 채용연계형 인턴사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/018/webp/%EA%B2%BD%EC%98%81%EC%A7%80%EC%9B%90-%ED%99%94%EC%9E%A5%ED%92%88-%ED%95%B4%EC%99%B8-%EC%9D%B8%ED%97%88%EA%B0%80-RA-%EC%B1%84%EC%9A%A9%EC%97%B0%EA%B3%84%ED%98%95-%EC%9D%B8%ED%84%B4%EC%82%AC%EC%9B%90-%EB%AA%A8%EC%A7%91-%EC%97%90%EC%9D%B4%ED%94%BC%EC%95%8C-01-29-2026_04_04_PM.webp?1769670744

1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음) 

 2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음) 

 3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', NULL, NULL, 'https://jasoseol.com/recruit/102298', '[경영지원] 화장품 해외 인허가(RA) 채용연계형 인턴사원 모집', '2026-02-03 12:28:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음)', 0, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', 2, 10000);
END $$;

-- Recruitment 93: 재무전략팀 신입/경력직원 채용 (ID: 102299)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '유안타증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('유안타증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/353/webp/7MlR1j51YBlx_Wa-8ut4QTzK5gGOx51ByeFSEMmAPLZ-Pjen7m1k9m5IxwW3Pne_xK0eEzGXoZ9aXqsWs1oe0Q.webp?1699327824', '서울특별시 영등포구 여의도동 국제금융로 39', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '재무전략팀 신입/경력직원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/030/webp/%EC%9E%AC%EB%AC%B4%EC%A0%84%EB%9E%B5%ED%8C%80_%EC%8B%A0%EC%9E%85%EA%B2%BD%EB%A0%A5%EC%A7%81%EC%9B%90_%EC%B1%84%EC%9A%A9_%28202601%29.webp?1769672994

1.본인의 VISION을 구체적으로 서술해 주십시오. 

 2.지원동기와 본인이 지원한 분야를 성공적으로 수행할 수 있다고 생각하는 이유와 성공적인 수행을 위해 본인이 준비해 온 것에 대해 서술해 주십시오. 

 3.본인의 성향 및 특징을 함축적으로 가장 잘 표현할 수 있는 단어 3개를 작성하시고, 그 이유를 자유롭게 서술해 주십시오.', '2026-01-29 16:47:00', '2026-02-12 23:00:00', 'https://jasoseol.com/recruit/102299', '재무전략팀', '2026-02-03 12:29:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1.본인의 VISION을 구체적으로 서술해 주십시오.', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2.지원동기와 본인이 지원한 분야를 성공적으로 수행할 수 있다고 생각하는 이유와 성공적인 수행을 위해 본인이 준비해 온 것에 대해 서술해 주십시오.', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3.본인의 성향 및 특징을 함축적으로 가장 잘 표현할 수 있는 단어 3개를 작성하시고, 그 이유를 자유롭게 서술해 주십시오.', 2, 1000);
END $$;

-- Recruitment 94: 풀재택근무 아마존 PPC&퍼포먼스 마케팅 (ID: 102300)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '샤인플로';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('샤인플로', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/626/webp/jss_hashed_087d5a04b642840e2be0_20250620T104911_unnamed%285%29.webp?1751872287', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '풀재택근무 아마존 PPC&퍼포먼스 마케팅', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/045/webp/%28%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%29-PPC-%E1%84%8E%E1%85%A2%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%80%E1%85%A9%E1%86%BC%E1%84%80%E1%85%A9.webp?1769676314

자유양식 입니다.', '2026-01-29 17:42:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102300', '아마존 PPC&퍼포먼스 마케팅', '2026-02-03 12:29:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 95: 신입주임 채용 (ID: 102301)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '군인공제회';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('군인공제회', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/657/webp/ci_down01.webp?1684486344', '서울 강남구 남부순환로 2806', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '신입주임 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/049/webp/%EA%B5%B0%EC%9D%B8%EA%B3%B5%EC%A0%9C%ED%9A%8C_%EC%8B%A0%EC%9E%85%EC%A3%BC%EC%9E%84_%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0_%EC%9D%B4%EB%AF%B8%EC%A7%80.webp?1769678078

창의적인 아이디어를 제시하고 적용하여 좋은 성과를 도출했던 경험을 기술하여 주십시오. 

 학교나 조직생활에서 구성원들과의 협동을 통해 좋은 결과를 냈던 경험을 기술하여 주십시오. 

 본인만의 차별화된 능력을 키우기 위해 지원자 스스로 노력한 경험을 기술하여 주십시오. 

 군인공제회에서 가장 필요하다고 생각하는 기술과 향후 해당 기술을 업무에 적용하기 위한 구체적인 계획을 작성하여 주십시오. 

 직장인으로서 직업윤리가 왜 중요한지 자신의 가치관을 중심으로 설명하십시오.', '2026-02-02 14:00:00', '2026-02-23 11:00:00', 'https://jasoseol.com/recruit/102301', '주임(C1)_일반전형, 주임(C1)_장교전형', '2026-02-03 12:29:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '창의적인 아이디어를 제시하고 적용하여 좋은 성과를 도출했던 경험을 기술하여 주십시오.', 0, 400);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '학교나 조직생활에서 구성원들과의 협동을 통해 좋은 결과를 냈던 경험을 기술하여 주십시오.', 1, 400);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인만의 차별화된 능력을 키우기 위해 지원자 스스로 노력한 경험을 기술하여 주십시오.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '군인공제회에서 가장 필요하다고 생각하는 기술과 향후 해당 기술을 업무에 적용하기 위한 구체적인 계획을 작성하여 주십시오.', 3, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직장인으로서 직업윤리가 왜 중요한지 자신의 가치관을 중심으로 설명하십시오.', 4, 500);
END $$;

-- Recruitment 96: [CS] 국내 CS 운영/관리 담당 채용연계형 인턴사원 모집 (ID: 102302)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에이피알';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에이피알', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/158/webp/%EC%9E%90%EC%82%B0_1_2x.webp?1684487245', '서울시 송파구 올림픽로 300, 36층/27층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[CS] 국내 CS 운영/관리 담당 채용연계형 인턴사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/050/webp/CS-%EA%B5%AD%EB%82%B4-CS-%EC%9A%B4%EC%98%81-%EA%B4%80%EB%A6%AC-%EB%8B%B4%EB%8B%B9-%EC%B1%84%EC%9A%A9%EC%97%B0%EA%B3%84%ED%98%95-%EC%9D%B8%ED%84%B4%EC%82%AC%EC%9B%90-%EB%AA%A8%EC%A7%91-%EC%97%90%EC%9D%B4%ED%94%BC%EC%95%8C-01-29-2026_06_01_PM.webp?1769678253

1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음) 

 2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음) 

 3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', NULL, NULL, 'https://jasoseol.com/recruit/102302', '[CS] 국내 CS 운영/관리 담당 채용연계형 인턴사원 모집', '2026-02-03 12:30:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인이 해당 직무에 적합하다고 판단하는 이유와 근거를 구체적으로 작성해주세요(글자수 제한 없음)', 0, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 에이피알이 지향하는 4가지 인재상(Make it, Grow up, Work Together, Customer Success) 중에서 하나를 선택하고, 해당 핵심가치와 부합하는 경험 또는 성과를 구체적으로 작성해주세요(글자수 제한 없음)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 에이피알에 지원한 동기와 입사 후 이루고자 하는 목표 및 포부를 작성해주세요(글자수 제한 없음)', 2, 10000);
END $$;

-- Recruitment 97: 금융상품운용실 경력직 채용 (ID: 102303)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '금융상품운용실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/fa880ba1-8eec-4ea7-bf6e-ff1a4da119d7.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-29 00:00:00', '2026-02-22 23:59:00', 'https://jasoseol.com/recruit/102303', '금융상품운용실', '2026-02-03 12:30:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 98: 계약직원 채용 공고 (ID: 102304)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '서강대학교';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('서강대학교', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/678/webp/%EC%84%9C%EA%B0%95%EB%8C%80_%EB%A1%9C%EA%B3%A0.webp?1684485965', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '계약직원 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/114/webp/1.webp?1769734011

지원동기를 기술하십시오. 

 자신의 가장 성공적인 경험과 실패한 경험에 대해 각각 구체적으로 기술하십시오. 

 본인의 역량과 성격에 대해 구체적으로 기술하십시오.', '2026-01-29 16:00:00', '2026-02-03 23:59:00', 'https://jasoseol.com/recruit/102304', '일반계약직(교목행정), 일반계약직(교내행사지원)', '2026-02-03 12:31:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기를 기술하십시오.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 가장 성공적인 경험과 실패한 경험에 대해 각각 구체적으로 기술하십시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 역량과 성격에 대해 구체적으로 기술하십시오.', 2, 500);
END $$;

-- Recruitment 99: 사업기획, 상품기획 신입/경력직 채용 (ID: 102305)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '웹케시그룹';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('웹케시그룹', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/783/webp/CI_%EC%9B%B9%EC%BC%80%EC%8B%9C%EA%B7%B8%EB%A3%B9-%EC%98%81%EB%AC%B8.webp?1684488802', '서울 영등포구 영신로 220, 12, 20층 (영등포동8가,케이앤케이디지털타워)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '사업기획, 상품기획 신입/경력직 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/128/webp/image.webp?1769734926

자유 양식입니다. 

 자유 양식입니다.', '2026-01-29 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102305', '사업기획, 상품기획', '2026-02-03 12:32:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유 양식입니다.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유 양식입니다.', 1, 500);
END $$;

-- Recruitment 100: Global Sales Strategy & Operations Sales Analyst (ID: 102306)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Global Sales Strategy & Operations Sales Analyst', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/590/original/SNS_Profile.png?1769736198

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102306', 'Global Sales Strategy & Operations Sales Analyst', '2026-02-03 12:32:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 101: 글로벌 영업 전략 리더 (Global Sales Strategy Leader) (ID: 102307)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '글로벌 영업 전략 리더 (Global Sales Strategy Leader)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/592/original/jss_hashed_b8c114e9cf2dc7c0a1aa_20251002T171557_SNS_Profile.png?1769737567

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102307', '글로벌 영업 전략 리더 (Global Sales Strategy Leader)', '2026-02-03 12:33:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 102: 2026 1분기 신입/인턴 채용 (ID: 102308)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '오오비컴퍼니';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('오오비컴퍼니', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/831/webp/jss_hashed_181e2af000a76f6718bb_20260130T141057_OOB_logo_blue.webp?1769749858', '', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 1분기 신입/인턴 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/133/webp/image.webp?1769739683

1. 당사와 해당 직무에 지원한 동기는 무엇인가요? 
(①당사에 지원하게 된 계기 ②지원 직무에 관심을 두게 된 계기 ③입사 후 성장 목표를 구체적으로 작성해주세요.) 

 2. 오오비컴퍼니는 ''''즐거움의 힘''''을 믿습니다. 스스로 생각하는 일에서의 ''''즐거움'''' 은 무엇이며, 이를 통해 긍정적인 결과를 이끌어낸 경험이 있다면 소개해주세요. 

 3. 본인만의 강점이 무엇이고 나의 강점을 바탕으로 오오비컴퍼니와 만들어낼 수 있는 시너지에 대해 작성해주세요.', '2026-02-03 00:00:00', '2026-02-09 15:00:00', 'https://jasoseol.com/recruit/102308', '마케팅(AE), 마케팅(AE) 체험형 인턴, 디자이너(Designer) 전환형 인턴', '2026-02-03 12:33:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 당사와 해당 직무에 지원한 동기는 무엇인가요? 
(①당사에 지원하게 된 계기 ②지원 직무에 관심을 두게 된 계기 ③입사 후 성장 목표를 구체적으로 작성해주세요.)', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 오오비컴퍼니는 ''즐거움의 힘''을 믿습니다. 스스로 생각하는 일에서의 ''즐거움'' 은 무엇이며, 이를 통해 긍정적인 결과를 이끌어낸 경험이 있다면 소개해주세요.', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 본인만의 강점이 무엇이고 나의 강점을 바탕으로 오오비컴퍼니와 만들어낼 수 있는 시너지에 대해 작성해주세요.', 2, 1000);
END $$;

-- Recruitment 103: 신입/경력사원 모집 (ID: 102309)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '현대종합금속';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('현대종합금속', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/190/webp/%EB%A1%9C%EA%B3%A0_%284%29.webp?1684485768', '서울 강남구 테헤란로 507, 16층 (삼성동,위워크빌딩)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '신입/경력사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/131/webp/20260128_%EA%B3%A0%EC%B0%BD_%EA%B8%B0%EA%B3%84.webp?1769736639

현대종합금속 및 지원 직무에 대한 지원 동기와 입사 후 성취하고 싶은 목표를 작성해주시기 바랍니다. (자신의 전공, 경험, 역량 활용 계획) 

 현대종합금속의 인재상 (창의, 팀워크, 용기, 도전) 중, 자신에게 가장 부합하는 항목을 선택하고, 이를 바탕으로 어려움을 극복한 사례를 구체적으로 작성해주시기 바랍니다. 

 지원하는 직무에 있어 본인만의 차별화된 역량이 무엇인지, 그리고 이를 발전시키기 위해 노력한 경험을 상세히 기술해 주십시오. 

 본인의 성장과정 및 성격의 장단점을 간략하게 작성해 주십시오. 

 직무와 연관된 경력 기술을 키워드별로 간략하게 작성해 주십시오. *신입 지원의 경우, 직무와 연관된 경험 작성.', '2026-01-30 10:22:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102309', '기계사업본부 서비스부, 고창공장 안전보건', '2026-02-03 12:34:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현대종합금속 및 지원 직무에 대한 지원 동기와 입사 후 성취하고 싶은 목표를 작성해주시기 바랍니다. (자신의 전공, 경험, 역량 활용 계획)', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현대종합금속의 인재상 (창의, 팀워크, 용기, 도전) 중, 자신에게 가장 부합하는 항목을 선택하고, 이를 바탕으로 어려움을 극복한 사례를 구체적으로 작성해주시기 바랍니다.', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원하는 직무에 있어 본인만의 차별화된 역량이 무엇인지, 그리고 이를 발전시키기 위해 노력한 경험을 상세히 기술해 주십시오.', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성장과정 및 성격의 장단점을 간략하게 작성해 주십시오.', 3, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직무와 연관된 경력 기술을 키워드별로 간략하게 작성해 주십시오. *신입 지원의 경우, 직무와 연관된 경험 작성.', 4, 500);
END $$;

-- Recruitment 104: 2026 각 부문별 신입사원 채용 (ID: 102310)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '농심태경';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('농심태경', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/005/816/webp/rokau7_hd0v-1klg98p_logo.webp?1695279783', '서울특별시 동작구 여의대방로 112', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 각 부문별 신입사원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/135/webp/image.webp?1769739932

1. 농심태경에 지원한 이유에 대하여, 회사를 선택하는 기준과 농심태경이 그 기준에 부합하는 이유를 포함해 기술해 주시기 바랍니다. 

 2. 지원한 직무분야와 관련하여, 가장 중요하다고 생각하는 역량 2가지와 그 이유에 대해 구체적인 경험과 함께 기술해 주십시오. 

 3. 지원분야와 관련한 본인의 강점 및 전문성을 향상시키기 위해 어떤 노력을 했으며, 입사 후 어떻게 활용할 수 있을지 기술해 주시기 바랍니다. 

 4. 본인의 인생 가치관을 한 단어 혹은 한 문장으로 표현하고, 그 이유를 구체적인 경험과 함께 기술해 주시기 바랍니다.', '2026-02-02 09:30:00', '2026-02-10 16:00:00', 'https://jasoseol.com/recruit/102310', '영업기획, 해외영업, 연구개발, 생산기획, 전기설비 관리', '2026-02-03 12:35:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 농심태경에 지원한 이유에 대하여, 회사를 선택하는 기준과 농심태경이 그 기준에 부합하는 이유를 포함해 기술해 주시기 바랍니다.', 0, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 지원한 직무분야와 관련하여, 가장 중요하다고 생각하는 역량 2가지와 그 이유에 대해 구체적인 경험과 함께 기술해 주십시오.', 1, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원분야와 관련한 본인의 강점 및 전문성을 향상시키기 위해 어떤 노력을 했으며, 입사 후 어떻게 활용할 수 있을지 기술해 주시기 바랍니다.', 2, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 본인의 인생 가치관을 한 단어 혹은 한 문장으로 표현하고, 그 이유를 구체적인 경험과 함께 기술해 주시기 바랍니다.', 3, 600);
END $$;

-- Recruitment 105: AI 전환 백엔드 개발 (ID: 102311)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'NHN Cloud';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('NHN Cloud', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/192/webp/jss_hashed_19a2587bbf9a37b6c377_20251230T140207_NHN_Cloud_Logo.webp?1767070928', '경기 성남시 분당구 대왕판교로645번길 16', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'AI 전환 백엔드 개발', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/593/original/CI_%ED%94%84%EB%A1%9C%ED%95%84_%EC%9D%B4%EB%AF%B8%EC%A7%80.png?1769739063

자신에 대해 자유롭게 표현해보세요.', NULL, NULL, 'https://jasoseol.com/recruit/102311', '[NHN Cloud] AI 전환 백엔드 개발', '2026-02-03 12:36:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신에 대해 자유롭게 표현해보세요.', 0, 1000);
END $$;

-- Recruitment 106: 대학(원)생 체험형 인턴 채용 (ID: 102313)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '신용카드사회공헌재단';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('신용카드사회공헌재단', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/015/065/webp/%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C%EC%82%AC%ED%9A%8C%EA%B3%B5%ED%97%8C%EC%9E%AC%EB%8B%A8_CI_%282%29_-_%EB%B3%B5%EC%82%AC%EB%B3%B8.webp?1686814265', '서울시 중구 다동길43 한외빌딩 11층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '대학(원)생 체험형 인턴 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/139/webp/image.webp?1769740643

1. [자기 소개/지원 동기] 자기 소개와 회사 및 직무에 대한 지원동기를 자유롭게 기술하세요 (400자) 

 2. [관련 경험 및 역량] 본인의 역량을 설명할 수 있는 경험(관련 경력, 수업, 대외활동, 수상 등)과 해당 경험에서 본인이 맡은 역할 및 업무 수행 시 본인의 장단점을 기술해주세요 (400자) 

 3. [입사 후 포부] 입사 후 수행하고 싶은 업무의 내용과 목표를 지유롭게 작성해주세요 (400자)', '2026-02-03 00:00:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102313', '사업팀 인턴', '2026-02-03 12:36:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. [자기 소개/지원 동기] 자기 소개와 회사 및 직무에 대한 지원동기를 자유롭게 기술하세요 (400자)', 0, 400);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. [관련 경험 및 역량] 본인의 역량을 설명할 수 있는 경험(관련 경력, 수업, 대외활동, 수상 등)과 해당 경험에서 본인이 맡은 역할 및 업무 수행 시 본인의 장단점을 기술해주세요 (400자)', 1, 400);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. [입사 후 포부] 입사 후 수행하고 싶은 업무의 내용과 목표를 지유롭게 작성해주세요 (400자)', 2, 400);
END $$;

-- Recruitment 107: 인사실 경력직 인재 채용 (ID: 102314)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '인사실 경력직 인재 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/546ac6ba-007e-42ad-aa4b-d484ef3352b9.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-30 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102314', '인사실', '2026-02-03 12:36:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 108: 마케팅 영상 크리에이터(안다르 일본) 신입/경력 채용 (ID: 102315)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에코마케팅';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에코마케팅', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/091/webp/echo_logo_blue.webp?1684487221', '서울 송파구 올림픽로35다길 42, 10,15,24층 (신천동,한국루터회관)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '마케팅 영상 크리에이터(안다르 일본) 신입/경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/146/webp/_%EC%97%90%EC%BD%94%EB%A7%88%EC%BC%80%ED%8C%85__%EB%A7%88%EC%BC%80%ED%8C%85_%EC%98%81%EC%83%81_%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%28%EC%95%88%EB%8B%A4%EB%A5%B4_%EC%9D%BC%EB%B3%B8%29_%EC%8B%A0%EC%9E%85_%EA%B2%BD%EB%A0%A5_%EC%B1%84%EC%9A%A9.webp?1769745227

[신입]1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요. 

 [경력] 1. 기존 커리어를 떠나, 에코마케팅에서 새롭게 도전하려는 이유를 작성해주세요. (*작성 가이드 : 이전의 직장 생활에서 느꼈던 점, 이직을 결정할 때 중요하게 고려했던 기준을 포함해 작성해주세요.) 

 2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요. 

 3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', '2026-01-30 12:52:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102315', '마케팅 영상 크리에이터(안다르 일본)', '2026-02-03 12:37:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[신입]1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요.', 0, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[경력] 1. 기존 커리어를 떠나, 에코마케팅에서 새롭게 도전하려는 이유를 작성해주세요. (*작성 가이드 : 이전의 직장 생활에서 느꼈던 점, 이직을 결정할 때 중요하게 고려했던 기준을 포함해 작성해주세요.)', 1, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요.', 2, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', 3, 9999);
END $$;

-- Recruitment 109: Strategy Product Manager (ID: 102316)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '야놀자';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('야놀자', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/244/webp/_200x50%281%29.webp?1742966317', '서울 강남구 테헤란로108길 42 (대치동,엠디엠타워)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Strategy Product Manager', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/597/original/SNS_Profile.png?1769746834

자기소개서 문항이 존재하지 않습니다.', NULL, NULL, 'https://jasoseol.com/recruit/102316', 'Strategy Product Manager', '2026-02-03 12:37:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 500);
END $$;

-- Recruitment 110: [6주 완성] 공채 준비에 꼭 필요한 12개 실무 과정 (ID: 102317)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '멋쟁이사자처럼';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('멋쟁이사자처럼', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/005/005/webp/basiclogo_E_H.webp?1684486830', '서울 종로구 종로3길 17, 디타워, 디1동 16층, 17층', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '[6주 완성] 공채 준비에 꼭 필요한 12개 실무 과정', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/159/webp/%EA%B3%B5%EA%B3%A0_%EC%9D%B4%EB%AF%B8%EC%A7%80_650.webp?1769751053

자기소개서 문항이 존재하지 않습니다.', '2026-01-30 14:00:00', '2026-02-12 14:00:00', 'https://jasoseol.com/recruit/102317', '소프트웨어 테스팅, 피그마 UI 실무, UX/UI 디자인, 핀테크 서비스 기획, 초보 PM 현업 가이드, 캐글 데이터 분석, 프론트엔드 실무, 웹 개발 완벽가이드, AI 챗봇 구축, MLOps와 온디바이스 AI, 실전 DevOps 입문, 실전완성 AWS 클라우드', '2026-02-03 12:40:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자기소개서 문항이 존재하지 않습니다.', 0, 1);
END $$;

-- Recruitment 111: 신입 및 경력사원 수시채용 (ID: 102318)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '휴스틸';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('휴스틸', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/794/webp/jss_hashed_5a62a282ef37f1a08ee3_20250905T104847_%ED%9C%B4%EC%8A%A4%ED%8B%B8_%EB%A1%9C%EA%B3%A0.webp?1757036929', '서울 강남구 테헤란로 512, 14층', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '신입 및 경력사원 수시채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/194/webp/%ED%9C%B4%EC%8A%A4%ED%8B%B8_%EC%88%98%EC%A0%95%EC%8B%9C%EC%95%88.webp?1769760778

[성장과정 및 학창생활] 지금까지의 경험 중 본인의 가치관 형성에 영향을 준 사건을 위주로 자유롭게 작성해 주시기 바랍니다. 

 [협업 및 의사소통능력] 그동안의 경험 중 타인 혹은 타조직과의 협업 및 의사소통을 통해 성과가 잘 도출된 사례를 작성해주시기 바랍니다. 

 [도전정신 및 적극적 문제해결] 지금까지의 경험 중 해결하기 어려운 문제를 회피하지 않고 적극적으로 노력했던 경험에 대해 작성해 주시기 바랍니다. 

 [지원동기 및 입사 후 포부] 귀사에 대한 열정과 비전을 바탕으로 한 지원 동기와 함께, 입사 후 귀하의 역량을 어떻게 발휘하고 성장시킬 계획인지에 대해 구체적으로 기술해 주시기 바랍니다. 

 [기타 하고싶은 말] *자유롭게 작성 바랍니다. 

 경력사항 (경력사항이 있는 경우만 작성)
*제출한 경력기술서가 없거나 제출한 것과 다른 내용을 추가하는 경우 작성', '2026-02-02 00:00:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102318', '해외영업, 자재구매 총무관리, 회계관리, 대구경영업, 임원비서, 제품개발 기술개발, 사무행정, 생산관리 생산기술, 설비_공무/기계, 품질보증(팀장급), 품질보증(팀원급)', '2026-02-03 12:43:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[성장과정 및 학창생활] 지금까지의 경험 중 본인의 가치관 형성에 영향을 준 사건을 위주로 자유롭게 작성해 주시기 바랍니다.', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[협업 및 의사소통능력] 그동안의 경험 중 타인 혹은 타조직과의 협업 및 의사소통을 통해 성과가 잘 도출된 사례를 작성해주시기 바랍니다.', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[도전정신 및 적극적 문제해결] 지금까지의 경험 중 해결하기 어려운 문제를 회피하지 않고 적극적으로 노력했던 경험에 대해 작성해 주시기 바랍니다.', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[지원동기 및 입사 후 포부] 귀사에 대한 열정과 비전을 바탕으로 한 지원 동기와 함께, 입사 후 귀하의 역량을 어떻게 발휘하고 성장시킬 계획인지에 대해 구체적으로 기술해 주시기 바랍니다.', 3, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[기타 하고싶은 말] *자유롭게 작성 바랍니다.', 4, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '경력사항 (경력사항이 있는 경우만 작성)
*제출한 경력기술서가 없거나 제출한 것과 다른 내용을 추가하는 경우 작성', 5, 1000);
END $$;

-- Recruitment 112: 직무별 수시모집 (ID: 102319)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '피에스케이';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('피에스케이', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/004/023/webp/%EC%BA%A1%EC%B2%98.webp?1715336733', '경기 화성시 삼성1로4길 48', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '직무별 수시모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/169/webp/26%EB%85%84_1%EC%9B%94_%EA%B3%B5%EA%B3%A0_R1.webp?1769755400

협업이 중요한 상황에서 다양한 사람들과 연대하여 공동의 목표를 이뤄낸 경험이 있다면 구체적으로 서술해 주십시오. 이 과정에서의 소통 방식과, 이를 통해 얻은 교훈 또는 성장도 함께 기술해 주세요. 

 자신의 업무나 행동이 동료와 조직에 어떤 영향을 미칠 수 있는지 고민하며 행동했던 경험을 서술해 주세요. 그 과정에서 지키고자 했던 가치와, 실제로 보여준 태도에 대해 구체적으로 설명해 주세요. 

 새로운 과제나 문제에 직면했을 때, 스스로 질문을 던지고 해결책을 찾아 나갔던 경험을 서술해 주세요. 그 과정에서 해결책을 판단한 방식과 느낀점을 작성해주세요. 

 입사 후 본인이 이루고자 하는 커리어 목표를 작성해 주시고, 이를 통해 회사 전체의 목표나 방향성에 어떻게 기여할 수 있을지 구체적으로 기술해 주세요. 특히, 본인의 전문성이 조직 내 어떻게 기여할 수 있을지 포함해 주세요. 

 AI 도구(ChatGPT, Gemini, Claude 등)를 활용하여 기존의 방식보다 효율을 높이거
나 문제를 해결했던 구체적인 사례를 기술해 주세요.', '2026-01-30 09:00:00', '2026-02-09 23:50:00', 'https://jasoseol.com/recruit/102319', '품질관리, 시스템관리, IT infra Management, 기술영업/마케팅, 공정개발, 기구설계, 전장 설계, CAE(Computed Aided Engineering), 요소기술개발, sw, 구매관리, 전략개발구매, PEE', '2026-02-03 12:46:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '협업이 중요한 상황에서 다양한 사람들과 연대하여 공동의 목표를 이뤄낸 경험이 있다면 구체적으로 서술해 주십시오. 이 과정에서의 소통 방식과, 이를 통해 얻은 교훈 또는 성장도 함께 기술해 주세요.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 업무나 행동이 동료와 조직에 어떤 영향을 미칠 수 있는지 고민하며 행동했던 경험을 서술해 주세요. 그 과정에서 지키고자 했던 가치와, 실제로 보여준 태도에 대해 구체적으로 설명해 주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '새로운 과제나 문제에 직면했을 때, 스스로 질문을 던지고 해결책을 찾아 나갔던 경험을 서술해 주세요. 그 과정에서 해결책을 판단한 방식과 느낀점을 작성해주세요.', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 본인이 이루고자 하는 커리어 목표를 작성해 주시고, 이를 통해 회사 전체의 목표나 방향성에 어떻게 기여할 수 있을지 구체적으로 기술해 주세요. 특히, 본인의 전문성이 조직 내 어떻게 기여할 수 있을지 포함해 주세요.', 3, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'AI 도구(ChatGPT, Gemini, Claude 등)를 활용하여 기존의 방식보다 효율을 높이거
나 문제를 해결했던 구체적인 사례를 기술해 주세요.', 4, 500);
END $$;

-- Recruitment 113: 마케팅(AE), 콘텐츠(에디터), 디자이너 인턴/신입/경력 채용 (ID: 102320)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '대학내일ES';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('대학내일ES', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/811/webp/DNES_SIGNATURE%28web%29.webp?1698987582', '서울 마포구 독막로 331 (도화동,마스터즈빌딩)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '마케팅(AE), 콘텐츠(에디터), 디자이너 인턴/신입/경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/284/webp/%EC%9E%90%EC%86%8C%EC%84%A4%EB%8B%B7%EC%BB%B4_%EC%98%A4%EC%98%A4%EB%B9%84%EC%A0%9C%EC%99%B8.webp?1769993894

인턴 채용에 지원한 동기와 해당 직무를 선택한 이유를 작성해주세요. 

 본인이 지원 직무에서 경쟁력을 확보하기 위해 했던 노력에 대하여 작성해주세요. 

 본인의 직무상 강점과 약점을 사례 중심으로 각각 작성해주세요.', '2026-01-30 15:00:00', '2026-02-09 15:00:00', 'https://jasoseol.com/recruit/102320', '[대학내일] 마케팅(AE)_마케팅커뮤니케이션2팀_신입/경력(전환형), [대학내일] 마케팅(AE)_마케팅커뮤니케이션3팀_인턴(전환형), [대학내일] 마케팅(AE)_비즈니스임팩트1팀_인턴(체험형), [대학내일] 마케팅(AE)_20대연구소_인턴(체험형), [대학내일] 마케팅(AE)_마케팅커뮤니케이션4팀_인턴(체험형), [대학내일] 마케팅(AE)_익스피리언스플래닝4팀_인턴(체험형), [대학내일] 콘텐츠(에디터)_마케팅커뮤니케이션1팀_인턴(체험형), [51percent] 디자이너(Design)_크리에이티브팀_인턴(체험형)', '2026-02-03 12:48:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '인턴 채용에 지원한 동기와 해당 직무를 선택한 이유를 작성해주세요.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 지원 직무에서 경쟁력을 확보하기 위해 했던 노력에 대하여 작성해주세요.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 직무상 강점과 약점을 사례 중심으로 각각 작성해주세요.', 2, 500);
END $$;

-- Recruitment 114: Blockchain 개발자/컨설턴트 채용 (Frontend · Backend) 신입/경력 (ID: 102321)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '삼일회계법인';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('삼일회계법인', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/660/webp/jss_hashed_efc038ec00726058756f_20250724T160859_content.webp?1753340940', '서울 용산구 한강대로 100', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'Blockchain 개발자/컨설턴트 채용 (Frontend · Backend) 신입/경력', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/601/original/jss_hashed_8a34af7f380ef0d767d3_20260130T164911_content.png?1769759443

자유양식 입니다.', '2026-01-30 16:08:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102321', 'Blockchain 개발자/컨설턴트 채용 (Frontend · Backend) 신입/경력', '2026-02-03 12:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 115: 기구개발 및 설계 (ID: 102322)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '세스코';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('세스코', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/217/webp/%EB%A1%9C%EA%B3%A0_%EC%84%B8%EC%8A%A4%EC%BD%94.webp?1687492274', '서울특별시 강동구 상일로10길 46 세스코 터치센터', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '기구개발 및 설계', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/602/original/jss_hashed_ec0c787c8e2dee185d8a_20250619T130234_%EB%A1%9C%EA%B3%A0_%EC%84%B8%EC%8A%A4%EC%BD%94.JPG?1769758477

세스코와 해당 직무에 지원한 동기 및 입사 후 이루고 싶은 목표를 구체적으로 작성해주세요. 

 지원하신 직무를 수행하기 위해 가장 중요한 역량은 무엇이고, 이를 위해 어떤 노력을 해왔는지 구체적인 사례를 들어 작성해주세요. 

 지금까지 가장 많은 노력을 쏟아부었던 성공 혹은 실패 경험과 그 과정을 통해 무엇을 배웠는지 작성해주세요. 

 활용 가능한 설계Tool을 모두 기재해주세요. 

 경력기술서를 작성해주세요. (퇴직사유 포함)
신입의 경우 ''''해당없음''''으로 작성해주세요.', '2026-01-30 16:32:00', '2026-02-12 23:59:00', 'https://jasoseol.com/recruit/102322', '기구개발 및 설계', '2026-02-03 12:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '세스코와 해당 직무에 지원한 동기 및 입사 후 이루고 싶은 목표를 구체적으로 작성해주세요.', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원하신 직무를 수행하기 위해 가장 중요한 역량은 무엇이고, 이를 위해 어떤 노력을 해왔는지 구체적인 사례를 들어 작성해주세요.', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지금까지 가장 많은 노력을 쏟아부었던 성공 혹은 실패 경험과 그 과정을 통해 무엇을 배웠는지 작성해주세요.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '활용 가능한 설계Tool을 모두 기재해주세요.', 3, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '경력기술서를 작성해주세요. (퇴직사유 포함)
신입의 경우 ''해당없음''으로 작성해주세요.', 4, 5000);
END $$;

-- Recruitment 116: 생성형 AI & AX 개발자/컨설턴트 채용(Frontend · Backend · AI R&D) 신입/경력 (ID: 102323)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '삼일회계법인';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('삼일회계법인', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/003/660/webp/jss_hashed_efc038ec00726058756f_20250724T160859_content.webp?1753340940', '서울 용산구 한강대로 100', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '생성형 AI & AX 개발자/컨설턴트 채용(Frontend · Backend · AI R&D) 신입/경력', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/603/original/jss_hashed_dfa47fc1960369d5cc67_20260130T170136_content.png?1769760151

자유 양식입니다.', '2026-01-30 17:00:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102323', '[삼일회계법인] 생성형 AI & AX 개발자/컨설턴트 채용(Frontend · Backend · AI R&D)', '2026-02-03 12:49:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유 양식입니다.', 0, 500);
END $$;

-- Recruitment 117: 경영지원/총무 (ID: 102324)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '경영지원/총무', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/191/webp/%EC%B4%9D%EB%AC%B4.webp?1769760602

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-01-30 17:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102324', '경영지원/총무', '2026-02-03 12:50:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 118: 영업부문 신입사원 채용 (ID: 102325)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'KCC실리콘';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('KCC실리콘', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/012/220/webp/kcc%EC%8B%A4%EB%A6%AC%EC%BD%98_ci.webp?1684488257', '서울 서초구 사평대로 344', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '영업부문 신입사원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/195/webp/Screenshot_2026-01-30_at_17.12.44.webp?1769760997

개인의 성장과정 및 차별화된 강점 기술 

 KCC실리콘 지원동기 및 사내에서 이루고 싶은 목표 

 지원분야(직무) 준비한 과정 - 개인의 경험을 토대로 구체적 기술 

 KCC실리콘 인재상 중 자신에게 가장 부합하는 항목을 선택하여 개인의 경험과 함께 구체적으로 기술', '2026-01-30 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102325', '영업', '2026-02-03 12:50:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '개인의 성장과정 및 차별화된 강점 기술', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'KCC실리콘 지원동기 및 사내에서 이루고 싶은 목표', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원분야(직무) 준비한 과정 - 개인의 경험을 토대로 구체적 기술', 2, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'KCC실리콘 인재상 중 자신에게 가장 부합하는 항목을 선택하여 개인의 경험과 함께 구체적으로 기술', 3, 500);
END $$;

-- Recruitment 119: ''26년 상반기 공개 채용 (ID: 102326)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = 'KT엠모바일';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('KT엠모바일', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/149/webp/kt_M_mobile_%EA%B8%B0%EB%B3%B8%ED%98%95.webp?1693291817', '서울 강남구 테헤란로 422', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '''26년 상반기 공개 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/213/webp/%28%EB%B3%B5%EB%A6%AC%ED%9B%84%EC%83%9D_%EB%B3%80%EA%B2%BD%2926%EB%85%84_%EC%83%81%EB%B0%98%EA%B8%B0_%EA%B3%B5%EC%B1%84_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0_Fv2.webp?1769764679

kt M mobile에 지원하게 된 동기와 입사 후 포부를 기술해주시기 바랍니다. (최소 500자, 최대 700자 입력가능) 

 본인이 지원한 직무에 적합하다고 생각하는 이유를 구체적으로 기술해 주시기 바랍니다. (최소 500자, 최대 700자 입력가능) 

 도전정신이나 창의성을 발휘하여 가치를 창출한 경험이 있으면 기술해 주시기 바랍니다. (최소 500자, 최대 700자 입력가능) 

 소속된 집단 내에서 소통과 협력을 통하여 시너지를 이뤄낸 경험이 있으면 기술해 주시기 바랍니다. (최소 500자, 최대 700자 입력가능)', '2026-02-02 00:00:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102326', '대외협력·홍보, 상품·서비스기획, 전략기획, 인사기획, 디지털채널영업, eSIM로밍사업, IT개발·운영관리, 정보보호', '2026-02-03 12:52:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, 'kt M mobile에 지원하게 된 동기와 입사 후 포부를 기술해주시기 바랍니다. (최소 500자, 최대 700자 입력가능)', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 지원한 직무에 적합하다고 생각하는 이유를 구체적으로 기술해 주시기 바랍니다. (최소 500자, 최대 700자 입력가능)', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '도전정신이나 창의성을 발휘하여 가치를 창출한 경험이 있으면 기술해 주시기 바랍니다. (최소 500자, 최대 700자 입력가능)', 2, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '소속된 집단 내에서 소통과 협력을 통하여 시너지를 이뤄낸 경험이 있으면 기술해 주시기 바랍니다. (최소 500자, 최대 700자 입력가능)', 3, 700);
END $$;

-- Recruitment 120: 신입사원 모집 (ID: 102327)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '현대종합금속';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('현대종합금속', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/190/webp/%EB%A1%9C%EA%B3%A0_%284%29.webp?1684485768', '서울 강남구 테헤란로 507, 16층 (삼성동,위워크빌딩)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '신입사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/198/webp/260130_%EB%B9%84%EC%84%9C%EC%8B%A4.webp?1769762036

현대종합금속 및 지원 직무에 대한 지원 동기와 입사 후 성취하고 싶은 목표를 작성해주시기 바랍니다. (자신의 전공, 경험, 역량 활용 계획) 

 현대종합금속의 인재상 (창의, 팀워크, 용기, 도전) 중, 자신에게 가장 부합하는 항목을 선택하고, 이를 바탕으로 어려움을 극복한 사례를 구체적으로 작성해주시기 바랍니다. 

 지원하는 직무에 있어 본인만의 차별화된 역량이 무엇인지, 그리고 이를 발전시키기 위해 노력한 경험을 상세히 기술해 주십시오. 

 본인의 성장과정 및 성격의 장단점을 간략하게 작성해 주십시오. 

 직무와 연관된 경력 기술을 키워드별로 간략하게 작성해 주십시오. *신입 지원의 경우, 직무와 연관된 경험 작성.', '2026-01-30 14:40:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102327', '본사 비서실-기획비서, 본사 비서실-수행비서', '2026-02-03 12:53:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현대종합금속 및 지원 직무에 대한 지원 동기와 입사 후 성취하고 싶은 목표를 작성해주시기 바랍니다. (자신의 전공, 경험, 역량 활용 계획)', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '현대종합금속의 인재상 (창의, 팀워크, 용기, 도전) 중, 자신에게 가장 부합하는 항목을 선택하고, 이를 바탕으로 어려움을 극복한 사례를 구체적으로 작성해주시기 바랍니다.', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원하는 직무에 있어 본인만의 차별화된 역량이 무엇인지, 그리고 이를 발전시키기 위해 노력한 경험을 상세히 기술해 주십시오.', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성장과정 및 성격의 장단점을 간략하게 작성해 주십시오.', 3, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직무와 연관된 경력 기술을 키워드별로 간략하게 작성해 주십시오. *신입 지원의 경우, 직무와 연관된 경험 작성.', 4, 500);
END $$;

-- Recruitment 121: 2026 디지털/글로벌 경력 채용 (ID: 102328)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한화투자증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한화투자증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/821/webp/Hanwha_Investment_Securities_RGB_4_KH%28%EA%B5%AD%EB%AC%B8%29.webp?1684485615', '서울 영등포구 여의대로 56', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026 디지털/글로벌 경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/208/webp/image.webp?1769763251

한화투자증권에 지원한 동기와 경력을 기술해 주세요(경력기술서는 별도 파일 첨부 가능) (5000자 이내)', '2026-02-02 12:00:00', '2026-02-19 15:00:00', 'https://jasoseol.com/recruit/102328', 'UI/UX, DevSecOps(CI/CD), Web3 Front-end, Web3 Back-end, Full Stack(PM), iOS 개발, Android 개발, Back-end, DevOps, 전략(전략기획), 글로벌지원(글로벌사업 지원 및 기획), 상품(디지털자산 상품기획), 경영기획(전략기획), 법무(법률검토, 소송수행/관리), 정보보호(정보보호담당), 인사(채용)', '2026-02-03 12:56:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한화투자증권에 지원한 동기와 경력을 기술해 주세요(경력기술서는 별도 파일 첨부 가능) (5000자 이내)', 0, 5000);
END $$;

-- Recruitment 122: 케미컬 개발 연구 (ID: 102329)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '세스코';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('세스코', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/217/webp/%EB%A1%9C%EA%B3%A0_%EC%84%B8%EC%8A%A4%EC%BD%94.webp?1687492274', '서울특별시 강동구 상일로10길 46 세스코 터치센터', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '케미컬 개발 연구', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/607/original/jss_hashed_ec0c787c8e2dee185d8a_20250619T130234_%EB%A1%9C%EA%B3%A0_%EC%84%B8%EC%8A%A4%EC%BD%94.JPG?1769762438

세스코와 해당 직무에 지원한 동기 및 입사 후 이루고 싶은 목표를 구체적으로 작성해주세요. 

 지원하신 직무를 수행하기 위해 가장 중요한 역량은 무엇이고, 이를 위해 어떤 노력을 해왔는지 구체적인 사례를 들어 작성해주세요. 

 지금까지 가장 많은 노력을 쏟아부었던 성공 혹은 실패 경험과 그 과정을 통해 무엇을 배웠는지 작성해주세요. 

 경력기술서를 작성해주세요. (퇴직사유 포함)
신입의 경우 ''''해당없음''''으로 작성해주세요.', '2026-01-30 17:36:00', '2026-02-12 23:59:00', 'https://jasoseol.com/recruit/102329', '케미컬 개발 연구', '2026-02-03 12:57:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '세스코와 해당 직무에 지원한 동기 및 입사 후 이루고 싶은 목표를 구체적으로 작성해주세요.', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원하신 직무를 수행하기 위해 가장 중요한 역량은 무엇이고, 이를 위해 어떤 노력을 해왔는지 구체적인 사례를 들어 작성해주세요.', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지금까지 가장 많은 노력을 쏟아부었던 성공 혹은 실패 경험과 그 과정을 통해 무엇을 배웠는지 작성해주세요.', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '경력기술서를 작성해주세요. (퇴직사유 포함)
신입의 경우 ''해당없음''으로 작성해주세요.', 3, 5000);
END $$;

-- Recruitment 123: 2026년 2월 수시채용 [각 부문별] (ID: 102330)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한미그룹';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한미그룹', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/000/908/webp/%ED%95%9C%EB%AF%B8%EA%B7%B8%EB%A3%B9.webp?1725004004', '서울시 송파구 위례성대로 14 한미타워', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 2월 수시채용 [각 부문별]', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/332/webp/_%ED%95%9C%EB%AF%B8%EA%B7%B8%EB%A3%B9__26%EB%85%84_2%EC%9B%94_%EC%88%98%EC%8B%9C%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0_%EC%99%B8%EB%B6%80%EC%9A%A9_%281%29.webp?1770010327

한미그룹에 지원하게 된 계기와, 여러 기업 중 한미그룹을 선택한 이유를 구체적으로 작성해 주십시오. (최소 500자, 최대 800자 입력가능) 

 지원하신 직무에 관심을 갖게 된 계기와 지금까지 해당 직무 수행을 위해 준비해온 경험 및 역량을 구체적으로 설명해 주십시오. (최소 700자, 최대 1,000자 입력가능) 

 한미그룹의 10가지 인재상에 비추어, 본인이 어떻게 부합하는지 경험을 바탕으로 작성해 주십시오. (최소 500자, 최대 800자 입력가능) 

 본인이 지원한 한미그룹의 사업영역(제약, 바이오, 식품, 화장품, IT 등)에 대한 최근 트렌드나 이슈를 선정하여 자신의 견해를 작성해주십시오. (최소 700자, 최대 1,000자 입력가능) 

 경력기술서 [경력사원에 한하여 작성하며, 직무영역, 활동/경험/업무수행내용, 역할 및 성과 등에 관해서 작성해주시기 바랍니다] (최소 200자, 최대 10,000자 입력가능)', '2026-02-02 11:00:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102330', '[한미약품]의료정책교육, [한미약품]청구, [한미약품]Medical, [한미약품]사업개발, [한미약품]Regulatory Affairs, [한미약품]해외영업, [한미약품]해외영업기획, [한미약품]구매, [한미약품]R&D센터_C&G연구, [한미약품]R&D센터_단백체 분석 연구, [한미약품]팔탄제조본부_생산관리, [한미약품]팔탄제조본부_기술지원, [한미약품]팔탄제조본부_품질관리, [한미약품]팔탄제조본부_시설지원, [한미약품]평택제조본부_품질보증, [한미약품]팔탄제조본부_생산, [한미사이언스]Licensing, [한미사이언스]재경, [한미사이언스]컴플라이언스, [한미사이언스]보안, [한미사이언스]CSV, [한미사이언스]식품영업, [한미사이언스]식품품질관리, [한미사이언스]의료기기마케팅, [한미사이언스]의료기기영업, [한미사이언스]생산, [한미사이언스]물류운영관리', '2026-02-03 13:03:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한미그룹에 지원하게 된 계기와, 여러 기업 중 한미그룹을 선택한 이유를 구체적으로 작성해 주십시오. (최소 500자, 최대 800자 입력가능)', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원하신 직무에 관심을 갖게 된 계기와 지금까지 해당 직무 수행을 위해 준비해온 경험 및 역량을 구체적으로 설명해 주십시오. (최소 700자, 최대 1,000자 입력가능)', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한미그룹의 10가지 인재상에 비추어, 본인이 어떻게 부합하는지 경험을 바탕으로 작성해 주십시오. (최소 500자, 최대 800자 입력가능)', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 지원한 한미그룹의 사업영역(제약, 바이오, 식품, 화장품, IT 등)에 대한 최근 트렌드나 이슈를 선정하여 자신의 견해를 작성해주십시오. (최소 700자, 최대 1,000자 입력가능)', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '경력기술서 [경력사원에 한하여 작성하며, 직무영역, 활동/경험/업무수행내용, 역할 및 성과 등에 관해서 작성해주시기 바랍니다] (최소 200자, 최대 10,000자 입력가능)', 4, 10000);
END $$;

-- Recruitment 124: 퍼포먼스 마케터 신입사원 채용 (ID: 102331)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '에코마케팅';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('에코마케팅', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/091/webp/echo_logo_blue.webp?1684487221', '서울 송파구 올림픽로35다길 42, 10,15,24층 (신천동,한국루터회관)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '퍼포먼스 마케터 신입사원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/203/webp/%ED%8D%BC%ED%8F%AC%EB%A7%88_0130.webp?1769762734

1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요. 

 2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요. 

 3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', '2026-01-30 17:44:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102331', '퍼포먼스 마케터', '2026-02-03 13:03:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 직업을 선택하는 기준과 바라는 직장의 모습을 작성해주세요.', 0, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 높은 수준의 목표를 설정하고 탁월하게 성취했던 경험에 대해 작성해주세요.', 1, 9999);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원분야 직무를 위해 준비해온 것에 대해 작성해주시고, 에코마케팅 입사 후 어떤 길을 개척하고자 하는지 작성해주세요.', 2, 9999);
END $$;

-- Recruitment 125: IB솔루션3실 경력직 채용 (ID: 102332)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'IB솔루션3실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/469689d4-73a4-4c2b-ad37-9312bd308299.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-30 00:00:00', '2026-02-05 23:59:00', 'https://jasoseol.com/recruit/102332', 'IB솔루션3실', '2026-02-03 13:04:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 126: 법인주식파생실 경력직 채용 (ID: 102333)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '법인주식파생실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202601/4dfc39e0-1ccd-4f05-b90f-8259280a11e4.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', '2026-01-30 00:00:00', '2026-02-13 23:59:00', 'https://jasoseol.com/recruit/102333', '법인주식파생실', '2026-02-03 13:04:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항
상기 항목에서 기재하지 못한 내용 및 기타 특이사항을 자유롭게 기술', 3, 1000);
END $$;

-- Recruitment 127: 데이터 엔지니어 (Google Analytics) (ID: 102334)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '이노션';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('이노션', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/070/webp/b8334c4c-879f-430c-801c-b6bf52bd29c7.webp?1692252021', '서울 강남구 강남대로 308', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '데이터 엔지니어 (Google Analytics)', 'https://daoift3qrrnil.cloudfront.net/business_employment_companies/images/000/050/611/original/CI.jpg?1769986396

이노션 지원동기 및 지원 분야에 대한 업무 전문성을 작성해주세요. (최소 100자 ~ 최대 1,000자)', '2026-02-02 07:48:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102334', '데이터 엔지니어 (Google Analytics)', '2026-02-03 13:04:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '이노션 지원동기 및 지원 분야에 대한 업무 전문성을 작성해주세요. (최소 100자 ~ 최대 1,000자)', 0, 1000);
END $$;

-- Recruitment 128: 2026년 농업경제부문 신규직원 채용 (ID: 102335)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '농협경제지주';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('농협경제지주', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/553/webp/%EB%86%8D%ED%98%91%EA%B2%BD%EC%A0%9C%EC%A7%80%EC%A3%BC.webp?1684485921', '서울 중구 새문안로 16', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 농업경제부문 신규직원 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/319/webp/image.webp?1770006227

농협경제지주에 지원하게 된 동기와 입사 후 어떤 직원이 되고 싶은지 구체적으로 서술해 주세요. (700자) 
( 농협경제지주 지원 동기 / 입사 후 포부 ) 

 소속된 단체(동아리, 팀프로젝트 등)의 결정이 나의 생각과 달랐던 경험에서, 본인이 취한 행동과 그렇게 한 이유, 그리고 그 과정에서 느낀점을 서술해 주세요. (700자) 
( 팀의 결정이 나의 생각과 달랐던 경험 / 본인의 행동 / 행동의 근거 / 느낀점 ) 

 기존의 방식이나 관행을 답습하지 않고, 새로운 시각으로 접근하여 성과를 도출하거나 문제점을 해결한(비효율 개선 등) 경험에 대해 서술해 주세요. (700자) 
( 기존의 방식이나 관행을 답습하지 않음 / 새로운 시각 / 성과 도출 또는 문제점 개선 ) 

 입사를 위해 그동안(학창시절, 사회생활 등) 준비한 본인의 역량 또는 강점이 무엇인지 구체적으로 설명하고, 그것이 농협경제지주에서 어떻게 활용될 수 있을지 서술해 주세요. (700자) 
( 입사를 위해 그동안 준비한 역량·강점 / 농협경제지주에서의 활용 가능성 ) 

 자신이 삶에서 가장 중요하게 여기는 가치관은 무엇이며, 그 가치관 형성에 큰 영향을 준 계기나 경험을 서술해 주세요. (700자)', '2026-02-02 00:00:00', '2026-02-10 18:00:00', 'https://jasoseol.com/recruit/102335', '일반직 - 일반, 일반직 - 보훈(제한경쟁), 전산직 - 일반', '2026-02-03 13:05:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '농협경제지주에 지원하게 된 동기와 입사 후 어떤 직원이 되고 싶은지 구체적으로 서술해 주세요. (700자) 
( 농협경제지주 지원 동기 / 입사 후 포부 )', 0, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '소속된 단체(동아리, 팀프로젝트 등)의 결정이 나의 생각과 달랐던 경험에서, 본인이 취한 행동과 그렇게 한 이유, 그리고 그 과정에서 느낀점을 서술해 주세요. (700자) 
( 팀의 결정이 나의 생각과 달랐던 경험 / 본인의 행동 / 행동의 근거 / 느낀점 )', 1, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '기존의 방식이나 관행을 답습하지 않고, 새로운 시각으로 접근하여 성과를 도출하거나 문제점을 해결한(비효율 개선 등) 경험에 대해 서술해 주세요. (700자) 
( 기존의 방식이나 관행을 답습하지 않음 / 새로운 시각 / 성과 도출 또는 문제점 개선 )', 2, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사를 위해 그동안(학창시절, 사회생활 등) 준비한 본인의 역량 또는 강점이 무엇인지 구체적으로 설명하고, 그것이 농협경제지주에서 어떻게 활용될 수 있을지 서술해 주세요. (700자) 
( 입사를 위해 그동안 준비한 역량·강점 / 농협경제지주에서의 활용 가능성 )', 3, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신이 삶에서 가장 중요하게 여기는 가치관은 무엇이며, 그 가치관 형성에 큰 영향을 준 계기나 경험을 서술해 주세요. (700자)', 4, 700);
END $$;

-- Recruitment 129: 2026년 직원(일반직 기간제, 업무직, 청년인턴) 채용 공고 (ID: 102336)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '과천도시공사';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('과천도시공사', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/012/343/webp/%EA%B3%BC%EC%B2%9C%EB%8F%84%EC%8B%9C%EA%B3%B5%EC%82%AC_%EB%A1%9C%EA%B3%A0.webp?1684488281', '경기 과천시 통영로 5', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 직원(일반직 기간제, 업무직, 청년인턴) 채용 공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/316/webp/%EB%8C%80%EC%A7%80_1-100.webp?1770001952

지원분야와 관련된 본인의 보유 역량을 기술하시오. 

 직무수행을 통하여 문제해결능력을 발휘한 경험 또는 최근 5년 내에 직면했던 삶의 어려움이 무엇이었으며, 그것을 어떻게 극복 하였는지 기술하시오. 

 공기업 직원으로서 직업윤리가 왜 중요한지 본인의 가치관을 중심으로 설명하시오.', '2026-02-02 10:30:00', '2026-02-12 14:00:00', 'https://jasoseol.com/recruit/102336', '수영, 종합상황실, 운전(준고령자), 안내, 일반행정(청년인턴/장애인)', '2026-02-03 13:06:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원분야와 관련된 본인의 보유 역량을 기술하시오.', 0, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직무수행을 통하여 문제해결능력을 발휘한 경험 또는 최근 5년 내에 직면했던 삶의 어려움이 무엇이었으며, 그것을 어떻게 극복 하였는지 기술하시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '공기업 직원으로서 직업윤리가 왜 중요한지 본인의 가치관을 중심으로 설명하시오.', 2, 500);
END $$;

-- Recruitment 130: 제조운영부문 평택생산2팀 Production Operator 정규직 채용 (ID: 102337)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '린데코리아';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('린데코리아', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/317/webp/Linde_plc_logo_2.webp?1684488453', '경기도 성남시 분당구 구미로8, 6층 린데코리아', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '제조운영부문 평택생산2팀 Production Operator 정규직 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/338/webp/%EC%A0%9C%EC%A1%B0%EC%9A%B4%EC%98%81%EB%B6%80%EB%AC%B8_%ED%8F%89%ED%83%9D%EC%83%9D%EC%82%B02%ED%8C%80_Production_Operator_%EC%A0%95%EA%B7%9C%EC%A7%81_%EC%B1%84%EC%9A%A9.webp?1770011985

자신의 성장과정 

 관련경력 및 사회활동 내용 

 지원동기 및 경력 목표', '2026-02-02 14:58:00', '2026-02-15 23:59:00', 'https://jasoseol.com/recruit/102337', 'Production Operator', '2026-02-03 13:07:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자신의 성장과정', 0, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '관련경력 및 사회활동 내용', 1, 600);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '지원동기 및 경력 목표', 2, 600);
END $$;

-- Recruitment 131: 2026년 직원(정규직/계약직/청년인턴) 채용공고 (ID: 102338)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '한국해외인프라도시개발지원공사(KIND)';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('한국해외인프라도시개발지원공사(KIND)', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/006/497/webp/KINDCI.webp?1684487345', '서울 영등포구 국제금융로 10, 50층 (여의도동,쓰리아이에프씨)', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '2026년 직원(정규직/계약직/청년인턴) 채용공고', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/352/webp/%ED%95%9C%EA%B5%AD%ED%95%B4%EC%99%B8%EC%9D%B8%ED%94%84%EB%9D%BC%EB%8F%84%EC%8B%9C%EA%B0%9C%EB%B0%9C%EC%A7%80%EC%9B%90%EA%B3%B5%EC%82%AC_1.webp?1770013351

본인이 직장 선택 시 중요하게 생각하는 기준을 설명하고, 한국해외인프라도시개발지원공사가 해당 기준을 충족하는 이유를 구체적으로 기술해 주십시오. 또한, 본인의 역량과 장점이 공사의 주요 사업 및 비전과 어떻게 연계될 수 있는지 작성해 주십시오. 

 직무 수행 역량을 강화하기 위해 새로운 기술이나 전문 지식을 습득했던 경험을 설명하고, 이를 통해 얻은 성과를 구체적으로 작성해 주십시오. 해당 경험이 공사의 사업 수행에 필요한 역량과 어떻게 연결되며, 이를 어떻게 활용할 수 있을지 기술해 주십시오. 

 새로운 도전을 통해 개인적으로 성취한 경험을 설명하고, 목표 설정의 배경과 그 과정에서 직면한 문제를 해결하기 위해 기울인 노력을 구체적으로 기술해 주십시오. 또한, 이를 통해 배운 점이 향후 공사의 사업 수행 과정에 어떻게 기여할 수 있을지 작성해 주십시오. 

 목표 달성을 위해 다양한 이해관계를 조율해야 했던 경험을 설명하고, 그 과정에서 발생한 갈등을 해결하기 위해 본인이 적용한 접근 방식과 그 성과를 구체적으로 기술해 주십시오. 또한, 이를 바탕으로 향후 조직 내에서 원활한 협업을 위해 어떤 노력을 기울일 것인지 기술해 주십시오. 

 한정된 시간과 자원 속에서 최적의 해결책을 도출해야 했던 경험을 설명하고, 그 과정에서 창의적인 아이디어나 혁신적인 접근 방식을 어떻게 적용했는지 기술해 주십시오. 또한, 이를 통해 배운 점이 향후 공사의 사업 및 직무 수행에 어떻게 활용될 수 있을지 설명해 주십시오. 

 [경력(경험)기술서]
지원직무분야 경력 또는 경험 기술', '2026-02-02 14:46:00', '2026-02-12 17:00:00', 'https://jasoseol.com/recruit/102338', '정규직_재무(회계사), 정규직_사업개발(인프라·플랜트·도시개발)_3급, 정규직_사업개발(인프라·플랜트·도시개발)_4급, 정규직_금융·리스크, 정규직_일반, 정규직_전산(IT), 정규직_보훈, 계약직_도시컨설팅(전문계약직), 계약직_비서(육아휴직대체), 계약직_정보보안(육아휴직대체), 청년인턴(체험형)', '2026-02-03 13:09:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인이 직장 선택 시 중요하게 생각하는 기준을 설명하고, 한국해외인프라도시개발지원공사가 해당 기준을 충족하는 이유를 구체적으로 기술해 주십시오. 또한, 본인의 역량과 장점이 공사의 주요 사업 및 비전과 어떻게 연계될 수 있는지 작성해 주십시오.', 0, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '직무 수행 역량을 강화하기 위해 새로운 기술이나 전문 지식을 습득했던 경험을 설명하고, 이를 통해 얻은 성과를 구체적으로 작성해 주십시오. 해당 경험이 공사의 사업 수행에 필요한 역량과 어떻게 연결되며, 이를 어떻게 활용할 수 있을지 기술해 주십시오.', 1, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '새로운 도전을 통해 개인적으로 성취한 경험을 설명하고, 목표 설정의 배경과 그 과정에서 직면한 문제를 해결하기 위해 기울인 노력을 구체적으로 기술해 주십시오. 또한, 이를 통해 배운 점이 향후 공사의 사업 수행 과정에 어떻게 기여할 수 있을지 작성해 주십시오.', 2, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '목표 달성을 위해 다양한 이해관계를 조율해야 했던 경험을 설명하고, 그 과정에서 발생한 갈등을 해결하기 위해 본인이 적용한 접근 방식과 그 성과를 구체적으로 기술해 주십시오. 또한, 이를 바탕으로 향후 조직 내에서 원활한 협업을 위해 어떤 노력을 기울일 것인지 기술해 주십시오.', 3, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '한정된 시간과 자원 속에서 최적의 해결책을 도출해야 했던 경험을 설명하고, 그 과정에서 창의적인 아이디어나 혁신적인 접근 방식을 어떻게 적용했는지 기술해 주십시오. 또한, 이를 통해 배운 점이 향후 공사의 사업 및 직무 수행에 어떻게 활용될 수 있을지 설명해 주십시오.', 4, 800);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '[경력(경험)기술서]
지원직무분야 경력 또는 경험 기술', 5, 1000);
END $$;

-- Recruitment 132: 통상팀 인턴 사원 모집 (ID: 102339)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '세아홀딩스';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('세아홀딩스', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/002/236/webp/%EC%84%B8%EC%95%84%ED%99%80%EB%94%A9%EC%8A%A4_%EB%A1%9C%EA%B3%A0.webp?1684485786', '서울 마포구 양화로 45', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '통상팀 인턴 사원 모집', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/345/webp/26%EC%83%81_%EC%84%B8%EC%95%84%ED%99%80%EB%94%A9%EC%8A%A4_%ED%86%B5%EC%83%81%ED%8C%80_%EC%9D%B8%ED%84%B4_%EC%B1%84%EC%9A%A9_%EA%B3%B5%EA%B3%A0%EB%AC%B8_0202.webp?1770012443

자유양식 입니다.', '2026-02-02 15:02:00', '2026-02-10 23:59:00', 'https://jasoseol.com/recruit/102339', '통상팀 인턴 사원', '2026-02-03 13:10:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 133: 생산 관리자 신입 채용 (ID: 102340)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '타이슨푸드코리아';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('타이슨푸드코리아', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/014/250/webp/TFlogo_Full_color_RGB.webp?1713319499', '세종 전의면 산단길 258', 3) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '생산 관리자 신입 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/381/webp/20260126_%EC%83%9D%EC%82%B0_%EA%B4%80%EB%A6%AC%EC%9E%90_%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0.webp?1770018679

자유양식 입니다.', '2026-01-28 00:00:00', '2026-02-22 23:59:00', 'https://jasoseol.com/recruit/102340', '생산 관리자', '2026-02-03 13:10:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '자유양식 입니다.', 0, 500);
END $$;

-- Recruitment 134: 부동산금융본부 경력직 채용 (ID: 102341)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '부동산금융본부 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202602/2e8a4dd9-35fa-45a8-8331-0d095473b6cf.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항', '2026-02-02 00:00:00', '2026-02-09 23:55:00', 'https://jasoseol.com/recruit/102341', '부동산금융본부', '2026-02-03 13:10:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항', 3, 1000);
END $$;

-- Recruitment 135: 리스크관리실 경력직 채용 (ID: 102342)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '리스크관리실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202602/405a7f08-39d3-4112-8179-187e33babe8c.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항', '2026-02-02 00:00:00', '2026-02-08 23:59:00', 'https://jasoseol.com/recruit/102342', '리스크관리실', '2026-02-03 13:11:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항', 3, 1000);
END $$;

-- Recruitment 136: 신입/경력 채용 (ID: 102343)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '티웨이항공';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('티웨이항공', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/001/859/webp/images.webp?1684485630', '대구 중구 동덕로 167, 신관 10층', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '신입/경력 채용', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/379/webp/%ED%8B%B0%EC%9B%A8%EC%9D%B4%ED%95%AD%EA%B3%B5_%EC%9D%B4%EB%AF%B8%EC%A7%80.webp?1770017679

1. 본인을 가장 잘 나타내는 핵심 강점 2가지를 설명해 주십시오. 

 2. 티웨이항공을 선택한 이유는 무엇이며, 티웨이항공이 더 성장하기 위해 갖추어야 할 요소가 무엇인지 서술하여 주십시오. 

 3. 본인이 지원한 분야에서 그 일을 남들보다 잘 할 수 있는 차별화된 능력과 경험이 무엇인지 서술하여 주십시오. 

 역량기술서
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', '2026-01-30 00:00:00', '2026-02-11 14:00:00', 'https://jasoseol.com/recruit/102343', '여객영업(OTA 및 상용), 여객영업, 여객영업(Revenue Mamagement), 재무회계, 경영관리, 정비사, 부품수리, 정비 전문강사', '2026-02-03 13:13:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인을 가장 잘 나타내는 핵심 강점 2가지를 설명해 주십시오.', 0, 400);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 티웨이항공을 선택한 이유는 무엇이며, 티웨이항공이 더 성장하기 위해 갖추어야 할 요소가 무엇인지 서술하여 주십시오.', 1, 500);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 본인이 지원한 분야에서 그 일을 남들보다 잘 할 수 있는 차별화된 능력과 경험이 무엇인지 서술하여 주십시오.', 2, 700);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '역량기술서
경력사항과 보유기술에 대해 구체적으로 설명해주세요.', 3, 2000);
END $$;

-- Recruitment 137: 영업추진실 경력직 채용 (ID: 102344)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '하나증권';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('하나증권', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/013/891/webp/%ED%95%98%EB%82%98%EC%A6%9D%EA%B6%8C_CI.webp?1686894415', '서울 영등포구 의사당대로 82', 1) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '영업추진실 경력직 채용', 'https://hanaw-hr.recruiter.co.kr/upload/427615/image/202602/019ddbd7-051d-4c96-b43e-a18a88be3a15.png

1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술) 

 2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술) 

 3. 지원동기 및 입사 후 계획 / 포부 

 4. 기타사항', '2026-02-02 00:00:00', '2026-02-22 23:59:00', 'https://jasoseol.com/recruit/102344', '영업추진실', '2026-02-03 13:13:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '1. 본인의 강점과 단점 소개 (※ 성격측면 / 동아리 및 기타 대외활동 등의 주요경험 / 주요 자격사항 및 Skill 등을 포함하여 기술)', 0, 5000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '2. 경력사항 소개 (※ 前 근무지 주요 경력 / Performance 및 향후 영업계획 등을 기술)', 1, 10000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '3. 지원동기 및 입사 후 계획 / 포부', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '4. 기타사항', 3, 1000);
END $$;

-- Recruitment 138: 경리(신입) (ID: 102345)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '경리(신입)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/409/webp/%EA%B2%BD%EB%A6%AC%28%EC%8B%A0%EC%9E%85%29.webp?1770024330

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-02-02 18:24:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102345', '경리(신입)', '2026-02-03 13:14:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 139: 물류(신입) (ID: 102346)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '물류(신입)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/410/webp/%EB%AC%BC%EB%A5%98%28%EC%8B%A0%EC%9E%85%29.webp?1770024401

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-02-02 18:26:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102346', '물류(신입)', '2026-02-03 13:14:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 140: 원료/정제(신입) (ID: 102347)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '원료/정제(신입)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/412/webp/%EC%9B%90%EB%A3%8C%EC%A0%95%EC%A0%9C%28%EC%8B%A0%EC%9E%85%29.webp?1770024477

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-02-02 18:27:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102347', '원료/정제(신입)', '2026-02-03 13:14:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 141: 이물검사(계약직) (ID: 102348)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, '이물검사(계약직)', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/413/webp/%EC%9D%B4%EB%AC%BC%EA%B2%80%EC%82%AC%28%EA%B3%84%EC%95%BD%EC%A7%81%29.webp?1770024563

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-02-02 18:28:00', '2026-02-11 23:59:00', 'https://jasoseol.com/recruit/102348', '이물검사(계약직)', '2026-02-03 13:15:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 142: PV(Pharmacovigilance) 책임자 (ID: 102349)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'PV(Pharmacovigilance) 책임자', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/419/webp/pv.webp?1770026961

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-02-02 19:00:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102349', 'PV(Pharmacovigilance) 책임자', '2026-02-03 13:15:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

-- Recruitment 143: RA (ID: 102350)
DO $$
DECLARE
    v_company_id bigint;
    v_recruitment_id bigint;
BEGIN
    SELECT company_id INTO v_company_id FROM company WHERE name = '녹십자웰빙';
    IF v_company_id IS NULL THEN
        INSERT INTO company (name, img, location, size) VALUES ('녹십자웰빙', 'https://daoift3qrrnil.cloudfront.net/company_groups/images/000/008/313/webp/%EC%9D%B4%EB%AF%B8%EC%A7%80_3.webp?1684487813', '서울 성동구 왕십리로 241, 4층 (행당동,서울숲더샵)', 2) RETURNING company_id INTO v_company_id;
    END IF;

    INSERT INTO recruitment (company_id, title, content, started_at, ended_at, apply_url, position, created_at) 
    VALUES (v_company_id, 'RA', 'https://daoift3qrrnil.cloudfront.net/content_images/images/000/340/420/webp/ra.webp?1770027025

당사에 지원한 동기는 무엇인가요? 

 당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요? 

 본인의 가치관 또는 생활신조에 대해 기술해주세요 

 본인의 성격 및 대인관계에 대해 기술해주세요 

 입사 후 각오에 대하여 기술해주세요', '2026-02-02 19:00:00', '2026-02-18 23:59:00', 'https://jasoseol.com/recruit/102350', 'RA', '2026-02-03 13:15:00') 
    RETURNING recruitment_id INTO v_recruitment_id;

    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 지원한 동기는 무엇인가요?', 0, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '당사에 입사하기 위해, 또는 직무의 전문가가 되기 위하여 무엇을 준비했나요?', 1, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 가치관 또는 생활신조에 대해 기술해주세요', 2, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '본인의 성격 및 대인관계에 대해 기술해주세요', 3, 1000);
    INSERT INTO question (recruitment_id, content, order_val, char_max) 
    VALUES (v_recruitment_id, '입사 후 각오에 대하여 기술해주세요', 4, 1000);
END $$;

