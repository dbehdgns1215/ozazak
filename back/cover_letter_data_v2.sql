-- ============================================================
-- Cover Letter Test Data Insertion SQL
-- Generated: 2026-02-02
-- CRITICAL: Each question must be matched by CONTENT, not just recruitment_id!
-- ============================================================

-- ============================================================
-- USER 1: admin
-- ============================================================

-- ==================== Coverletter 1 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (1, 47, '건설공제조합 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (47, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=47 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=47 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (47, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 2, 1200);

-- Essay 2 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=47 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=47 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (47, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 3, 800);

-- Essay 3 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=47 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=47 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 2 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (1, 14, '유비쿼스 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (14, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=14 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=14 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (14, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=14 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=14 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 3 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (1, 71, 'SK키파운드리 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 4 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (1, 80, '롯데글로벌로지스 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 1, 1000);

-- Essay 1 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 2, 1000);

-- Essay 2 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 5 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (1, 75, '롯데글로벌로지스 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 1, 1500);

-- Essay 1 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 3, 1000);

-- Essay 3 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=1 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);



-- ============================================================
-- USER 2: admin
-- ============================================================

-- ==================== Coverletter 1 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (2, 71, '건설공제조합 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 3, 800);

-- Essay 3 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 2 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (2, 46, '이노션 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 3, 1500);

-- Essay 3 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 3 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (2, 80, '이노션 HR 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 1, 800);

-- Essay 1 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 3, 1500);

-- Essay 3 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 4, 1000);

-- Essay 4 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 4 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (2, 3, 'KB국민은행 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 1, 1000);

-- Essay 1 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 5 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (2, 39, '일화 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (39, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=39 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=39 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (39, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 2, 1500);

-- Essay 2 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=39 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=39 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (39, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=39 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=39 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (39, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 4, 800);

-- Essay 4 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=39 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=39 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 6 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (2, 12, '이노션 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (12, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=12 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=12 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (12, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=2 AND recruitment_id=12 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=12 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);



-- ============================================================
-- USER 3: admin
-- ============================================================

-- ==================== Coverletter 1 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (3, 57, 'KB국민은행 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 2, 1500);

-- Essay 2 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 3, 1000);

-- Essay 3 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 2 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (3, 3, '이노션 HR 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 1, 800);

-- Essay 1 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 3, 1000);

-- Essay 3 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 3 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (3, 80, '로레알 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 4, 1500);

-- Essay 4 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 4 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (3, 25, '롯데글로벌로지스 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (25, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 1, 1500);

-- Essay 1 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=25 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=25 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (25, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=25 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=25 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 5 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (3, 85, '이노션 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (85, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=85 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=85 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (85, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 2, 1500);

-- Essay 2 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=85 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=85 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (85, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 3, 1000);

-- Essay 3 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=85 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=85 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 6 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (3, 3, '로레알 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 1, 1500);

-- Essay 1 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 3, 1200);

-- Essay 3 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (3, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 4, 1000);

-- Essay 4 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=3 AND recruitment_id=3 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=3 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);



-- ============================================================
-- USER 4: test
-- ============================================================

-- ==================== Coverletter 1 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, 58, '건설공제조합 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 1, 1000);

-- Essay 1 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 2 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, 24, 'NHN Cloud 개발자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (24, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=24 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=24 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (24, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 2, 1200);

-- Essay 2 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=24 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=24 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 3 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, 57, '로레알 경력 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 1, 1000);

-- Essay 1 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 2, 1000);

-- Essay 2 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 3, 1200);

-- Essay 3 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (57, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 4, 800);

-- Essay 4 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=57 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=57 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 4 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, 40, 'SK키파운드리 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (40, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 1, 800);

-- Essay 1 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=40 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=40 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (40, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=40 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=40 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (40, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 3, 1500);

-- Essay 3 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=40 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=40 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 5 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, 80, '일화 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 2, 1500);

-- Essay 2 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 4, 1000);

-- Essay 4 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);



-- ============================================================
-- USER 5: test
-- ============================================================

-- ==================== Coverletter 1 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, 14, '일화 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (14, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=14 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=14 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (14, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=14 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=14 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (14, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 3, 1000);

-- Essay 3 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=14 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=14 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (14, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 4, 1500);

-- Essay 4 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=14 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=14 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 2 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, 7, '한국토요타 개발자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (7, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=7 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=7 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (7, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=7 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=7 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 3 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, 46, '건설공제조합 개발자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 2, 1500);

-- Essay 2 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 3, 1200);

-- Essay 3 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 4 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, 75, '한국토요타 마케터 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 3, 1200);

-- Essay 3 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 4, 1500);

-- Essay 4 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 5 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, 71, '한국토요타 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 1, 800);

-- Essay 1 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 2, 1000);

-- Essay 2 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (71, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=71 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=71 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 6 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, 75, 'KB국민은행 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 1, 1500);

-- Essay 1 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 2, 1000);

-- Essay 2 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (75, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 3, 1200);

-- Essay 3 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND recruitment_id=75 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=75 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);



-- ============================================================
-- USER 6: test
-- ============================================================

-- ==================== Coverletter 1 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, 46, '이노션 신입 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 1, 1500);

-- Essay 1 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (46, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 2, 1000);

-- Essay 2 for Coverletter 1
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=46 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=46 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 2 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, 58, '로레알 기획자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 1, 1000);

-- Essay 1 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 2, 1000);

-- Essay 2 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.', 3, 1500);

-- Essay 3 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='본인의 가장 뛰어난 역량과 이를 증명할 수 있는 구체적인 경험을 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 대한 깊은 이해와 큰 열정을 바탕으로, 관련 분야에서의 다양하고 풍부한 경험과 지속적인 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 이론적 지식을 실무에 적용하는 능력을 키웠고, 산학 협력 프로그램과 인턴십 경험을 통해 실제 업무 환경에서의 문제해결 능력을 배양했습니다. 특히 복잡한 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 배경을 가진 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 프로젝트 진행 중 발생한 여러 어려움을 창의적인 해결책으로 극복한 경험은 제게 큰 자산이 되었습니다. 이러한 실무 경험과 문제해결 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 실질적으로 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 빠르게 변화하는 시장 환경과 기술 트렌드에 능동적으로 적응하는 유연성과 학습 능력도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 4 for Coverletter 2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 4, 1200);

-- Essay 4 for Coverletter 2
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 3 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, 86, '롯데글로벌로지스 경력 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (86, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=86 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=86 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (86, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=86 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=86 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (86, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 3
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=86 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=86 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 4 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, 58, 'NHN Cloud 개발자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (58, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 4
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=58 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=58 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 5 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, 9, 'NHN Cloud HR 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (9, '팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.', 1, 1000);

-- Essay 1 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=9 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=9 AND content='팀 프로젝트에서 문제를 해결한 경험을 구체적으로 작성해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (9, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 2, 1200);

-- Essay 2 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=9 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=9 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 3 for Coverletter 5
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (9, '지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.', 3, 1000);

-- Essay 3 for Coverletter 5
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=9 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=9 AND content='지원동기 및 입사 후 회사에서 이루고 싶은 목표를 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험을 통해 필요한 역량을 체계적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 실질적으로 기여하고 싶습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여, 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있습니다.',
    1,
    'v1',
    true,
    NULL
);


-- ==================== Coverletter 6 ====================
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, 80, '로레알 개발자 지원', false, NULL, NOW(), NOW(), NULL);

-- Question 1 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.', 1, 1200);

-- Essay 1 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='해당 직무에 지원하기 위해 어떤 노력과 준비를 해왔는지 구체적으로 기술하십시오.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 열정을 가지고 있으며, 관련 분야에서의 다양한 경험과 학습을 통해 필요한 역량을 체계적이고 전문적으로 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 여러 차례 수행하며 실무 능력을 키웠고, 이론과 실무를 결합한 접근 방식으로 문제를 해결하는 능력을 배양했습니다. 특히 팀 프로젝트에서 리더십과 협업 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 다양한 이해관계자들과의 원활한 커뮤니케이션을 통해 프로젝트를 성공으로 이끌었습니다. 이러한 역량을 귀사에서 더욱 발전시켜 나가고 싶으며, 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하여 회사의 비전 달성에 기여하겠습니다. 도전적인 업무 환경에서도 포기하지 않고 최선을 다하는 열정과 끈기를 가지고 있으며, 변화하는 시장 환경에 빠르게 적응하는 유연성도 갖추고 있습니다.',
    1,
    'v1',
    true,
    NULL
);

-- Question 2 for Coverletter 6
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (80, '본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.', 2, 800);

-- Essay 2 for Coverletter 6
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND recruitment_id=80 ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE recruitment_id=80 AND content='본인의 강점과 약점을 솔직하게 작성하고, 약점을 극복하기 위한 노력을 기술해주세요.' ORDER BY question_id DESC LIMIT 1),
    '저는 이 직무에 큰 관심을 가지고 있으며, 관련 분야에서의 경험을 통해 필요한 역량을 쌓아왔습니다. 대학 재학 중 관련 프로젝트를 수행하며 실무 능력을 키웠고, 이를 바탕으로 귀사에 기여하고 싶습니다. 팀워크와 문제해결 능력을 발휘하여 성공적인 결과를 도출한 경험이 있으며, 이러한 역량을 귀사에서 더욱 발전시키고 싶습니다. 끊임없이 학습하고 성장하는 자세로 귀사의 핵심 인재로 성장하겠습니다.',
    1,
    'v1',
    true,
    NULL
);


