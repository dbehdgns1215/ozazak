-- ============================================================
-- USER 4: test (Dummy Data Insertion)
-- ============================================================

-- -------------------- 1. SK텔링크 (SK Telink) --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, NULL, 'SK텔링크 마케팅 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '목표를 세우고, 달성하고자 노력한 경험.', 1, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='목표를 세우고, 달성하고자 노력한 경험.' ORDER BY question_id DESC LIMIT 1),
    '[120개 팀 중 3위, 준비가 만든 결과]

비전 AI를 처음 접한 지 2주 만에 AI 해커톤 우수상을 수상했습니다. 저는 불가능해 보이는 도전에서도 체계적 준비로 결과를 만드는 인재입니다.

대회 주제는 ''지능형 CCTV 시스템'' 개발이었습니다. 비전 AI 경험이 전무했지만, 지능형 CCTV의 핵심 과제인 ''사람 객체 분류와 상품 인식''에 도전하기로 했습니다. 대회 2주 전부터 매일 4시간씩 YOLOv8 공식 문서를 분석하며 객체 인식의 기초를 다졌고, 데이터 전처리부터 모델 학습, GPT-API 연동까지 전체 파이프라인을 세 차례 반복 구현하며 이해도를 높였습니다.

특히 대회장 환경을 사전 시뮬레이션한 것이 주효했습니다. 일반 CCTV는 천장에서 하향 촬영하지만, 대회에서는 노트북 카메라로 시연해야 했습니다. 이 각도 차이를 고려해 학습 데이터를 다각도로 구성했고, 대회장 시연 시 상품 인식률 저하를 최소화할 수 있도록 세팅했습니다. 덕분에 24시간 중 12시간 만에 핵심 기능을 완성하고, 남은 시간에는 UI 개선과 엣지 케이스 대응에 집중했습니다.

그 결과, 120팀 중 3위로 우수상을 수상했습니다. 심사위원께서 "준비의 완성도가 결과의 차이를 만들었다"고 평가하신 것처럼, 이 경험을 통해 ''철저한 준비가 실력 격차를 뛰어넘는다''는 것을 배웠습니다. SK텔링크에서도 마케팅 캠페인 하나를 기획하더라도, 고객 데이터 분석부터 경쟁사 벤치마킹, A/B 테스트 시나리오까지 빈틈없이 준비해 최고의 성과를 만들겠습니다.',
    1, 'v1', true, NULL
);

-- Q2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '남다른 아이디어를 통해 문제를 개선한 경험.', 2, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='남다른 아이디어를 통해 문제를 개선한 경험.' ORDER BY question_id DESC LIMIT 1),
    '“상업성을 위해 기능을 포기하다”

AI 해커톤에서 지능형 CCTV 기술을 개발했지만, 상업성이 부족했습니다. 저희 팀이 만든 기술이 실제 시장에서도 통하는지 검증하기 위해 창업경진대회에 도전했고, 가장 효과적으로 작용할 시장을 탐색했습니다.

무인점포 업계를 분석한 결과, 점주들의 페인 포인트를 발견했습니다. 기존 무인점포 업계는 수백만 원대 토탈 보안솔루션을 도입하거나, 사람이 직접 CCTV를 24시간 감시해야 했습니다. 전자는 소상공인에게 과도한 비용 부담을, 후자는 24시간 모니터링 불가능이라는 인적 부담을 안겼습니다.

저희는 기존 CCTV에 소프트웨어만 추가하는 방식을 제안했습니다. 고가 하드웨어 교체 없이 AI 알고리즘을 탑재해 이상행동을 자동 감지하고 실시간 알림을 보내는 방식으로, 도입 비용을 80% 이상 절감했습니다. 또한 본연의 경쟁력인 비용 절감 기능을 확보하기 위해, GPT-API 기반 고성능 기능 일부를 포기해야 했습니다. 팀원들은 "기능을 줄이면 경쟁력이 떨어지지 않겠냐"며 우려했지만, 저는 "완벽한 기술보다 고객이 감당 가능한 솔루션이 더 가치 있다"고 설득했습니다. 무인점포 점주 대다수가 소상공인이라는 점에서, 저비용이 최대 경쟁력이 될 것으로 확신했기 때문입니다.

이러한 전략으로 기존 보안 솔루션 대비 경쟁력을 인정받으며 대상을 수상했습니다. 혁신은 최첨단 기술이 아닌, 고객의 실질적 니즈 해결에서 시작된다는 것을 배웠습니다. SK텔링크에서도 고객의 니즈 해결을 최우선으로 삼는 마케터가 되겠습니다.',
    1, 'v1', true, NULL
);

-- Q3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '전문성을 키우기 위해 노력한 구체적인 경험.', 3, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='전문성을 키우기 위해 노력한 구체적인 경험.' ORDER BY question_id DESC LIMIT 1),
    '"AI 역량을 기른 도전"

학과 커리큘럼을 넘어 학습하고 싶어 타과 교수님께 학부연구생을 자청했습니다. 인공지능 연구실에서 6개월간 ''SNS 데이터를 통한 MBTI 이진분류'' 프로젝트를 수행하며 데이터 수집부터 전처리, 문장 임베딩, 모델링, 평가까지 자연어 처리의 전 과정을 주도했습니다. 이를 통해 NLP 프로젝트를 처음부터 끝까지 이끌 수 있는 실무 역량을 갖추게 되었습니다.

"데이터로 페인 포인트를 찾고, AI로 해결하다"

전문성은 실전과 비슷한 경험에서 나온다고 생각합니다. ''에어비앤비 매출 증대'' 캡스톤 프로젝트에서 야놀자 출신 멘토님과 마케팅·AI 교수님께 인정받아 최종 1등을 차지한 경험이 있습니다.

에어비앤비는 플랫폼-호스트-게스트로 구성된 C2C 구조로, 호스트 확보가 곧 경쟁력입니다. 사업 모델과 사용자 데이터를 분석한 결과, 신규 호스트 이탈이 성장의 최대 걸림돌임을 발견했습니다. 게스트는 숙소 선택 시 사진과 설명을 가장 중요하게 보지만, 신규 호스트는 이를 간과해 초기 예약률이 저조했고 결국 플랫폼을 떠났습니다.

PM으로서 AI 기술(이미지 분석, 자연어 처리)을 활용한 실시간 피드백 시스템을 기획했습니다. 사진은 구도·밝기를 자동 평가하고, 설명은 가독성과 우수 숙소 키워드 포함 여부를 체크해 개선안을 제시하도록 설계했습니다. A/B테스트 결과 개선 사진은 75%, 설명은 70%의 선호도를 기록하며 전체 1위와 개인 수석을 달성했습니다.

"데이터 기반 마케팅, AI기반 솔루션"

SK텔링크 입사 후 데이터 기반 마케터로 성장하겠습니다. 알뜰폰 시장은 가격과 프로모션에 민감한 고객층으로, 데이터 분석으로 그들의 니즈를 선제적으로 대응하면 큰 효과를 낼 수 있다고 생각합니다.

첫째, 고객 이탈 방지 전략을 수립하겠습니다. 요금제 변경 패턴, 데이터 사용량, 해지 이력을 분석해 이탈 위험군을 조기 식별하고 맞춤형 프로모션을 제안하는 CRM 전략을 구축하겠습니다.

둘째, 경쟁사 모니터링을 자동화하겠습니다. Python 크롤링으로 경쟁 MVNO의 실시간 요금제 데이터를 수집하고 가격 경쟁력 리포트를 자동 생성해 빠른 의사결정을 지원하겠습니다.

셋째, AI 기반 VOC 분석으로 서비스 개선점을 발굴하겠습니다. 고객센터 상담 텍스트와 앱 리뷰를 자연어 처리로 분석해 불만 키워드를 추출하고 우선 개선 영역을 제시하겠습니다.

각종 공모전과 학부연구생을 통해 쌓아온 역량을 SK텔링크의 실제 비즈니스 성과로 증명하겠습니다. 데이터로 문제를 발견하고 AI로 해결하는 마케터로 성장해 SK텔링크의 사업 경쟁력 강화에 기여하겠습니다.',
    1, 'v1', true, NULL
);

-- Q4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, 'AI 도구를 활용한 문제를 해결한 경험.', 4, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='AI 도구를 활용한 문제를 해결한 경험.' ORDER BY question_id DESC LIMIT 1),
    '삼성 SW·AI 아카데미에서 AI를 학습 코치로 활용해 알고리즘 실력을 향상시켰습니다.

처음 GPT에게 질문했을 때는 전체 정답까지 알려줘서 학습 효과가 없었습니다. 이를 개선하기 위해 프롬프트 엔지니어링을 적용했습니다. AI가 정답을 직접 제공하지 않고, 오류를 알고리즘 분류 실패·로직 오류·구현 실수 세 단계로 구분해 힌트만 제시하도록 프롬프트를 설계했습니다.

이를 통해 스스로 사고하는 훈련을 반복한 결과, 백준 골드 달성과 아카데미 알고리즘 테스트 상위 10%에 진입할 수 있었습니다.',
    1, 'v1', true, NULL
);


-- -------------------- 2. 비씨카드 (BC Card) --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, NULL, '비씨카드 AX/DX 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '자신을 가장 잘 표현하는 역량과 이유를 설명하세요.', 1, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='자신을 가장 잘 표현하는 역량과 이유를 설명하세요.' ORDER BY question_id DESC LIMIT 1),
    '도전

[철저한 준비 아래 도전하다]

‘철저한 준비’와 ''도전''이라는 두가지 키워드로 저를 소개하고 싶습니다. 계획 없이 도전하는 게 아닌, 철저한 준비 하에 도전해 결국 결과를 만들어내는 힘을 가지고 있기 때문입니다.

AI 해커톤 참여 제의를 받았을 때, Vision 영역은 제가 다뤄보지 않은 분야였습니다. 하지만 새로운 기술을 배울 수 있는 기회라고 생각해 망설임 없이 AI 개발을 맡겠다고 자원했습니다. 이러한 도전을 성공시키기 위해 학습 데이터의 XML, JSON 형식, OpenCV, YOLOv8, GPT API Prompt Engineering 등을 철저히 학습하며 준비했습니다.

대회 당일, 유일한 AI 개발자로서 상당한 부담이 있었지만, 사전에 준비한 지식을 바탕으로 차근차근 접근했습니다. 기능을 필수와 부가로 분류하여 우선순위를 정하고, MVP 방식으로 개발 전략을 수립했습니다. 24시간이라는 제한된 시간 중 16시간만에 데이터 전처리부터 YOLOv8 모델 학습, 데이터 파이프라인 구축까지 모든 기능을 구현했고, 남은 8시간에는 팀원들을 도와 프로젝트 완성도를 높였습니다. 그 결과 120팀 중 3위를 차지하며 새로운 분야에서도 철저한 준비와 체계적인 접근으로 성과를 낼 수 있다는 자신감을 얻었습니다.

국내 카드업계는 기존 카드업계뿐만 아니라 핀테크들까지 시장에 뛰어들어 경쟁이 격해지고 있습니다. 이런 상황속에서 철저한 준비를 통한 도전으로 결과를 만들어내는 저의 역량은 비씨카드에 기여할 수 있을 것이라 생각합니다.',
    1, 'v1', true, NULL
);

-- Q2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '지원 동기.', 2, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='지원 동기.' ORDER BY question_id DESC LIMIT 1),
    '도전

[철저한 준비 아래 도전하다]

‘철저한 준비’와 ''도전''이라는 두가지 키워드로 저를 소개하고 싶습니다. 계획 없이 도전하는 게 아닌, 철저한 준비 하에 도전해 결국 결과를 만들어내는 힘을 가지고 있기 때문입니다.

AI 해커톤 참여 제의를 받았을 때, Vision 영역은 제가 다뤄보지 않은 분야였습니다. 하지만 새로운 기술을 배울 수 있는 기회라고 생각해 망설임 없이 AI 개발을 맡겠다고 자원했습니다. 이러한 도전을 성공시키기 위해 학습 데이터의 XML, JSON 형식, OpenCV, YOLOv8, GPT API Prompt Engineering 등을 철저히 학습하며 준비했습니다.

대회 당일, 유일한 AI 개발자로서 상당한 부담이 있었지만, 사전에 준비한 지식을 바탕으로 차근차근 접근했습니다. 기능을 필수와 부가로 분류하여 우선순위를 정하고, MVP 방식으로 개발 전략을 수립했습니다. 24시간이라는 제한된 시간 중 16시간만에 데이터 전처리부터 YOLOv8 모델 학습, 데이터 파이프라인 구축까지 모든 기능을 구현했고, 남은 8시간에는 팀원들을 도와 프로젝트 완성도를 높였습니다. 그 결과 120팀 중 3위를 차지하며 새로운 분야에서도 철저한 준비와 체계적인 접근으로 성과를 낼 수 있다는 자신감을 얻었습니다.

국내 카드업계는 기존 카드업계뿐만 아니라 핀테크들까지 시장에 뛰어들어 경쟁이 격해지고 있습니다. 이런 상황속에서 철저한 준비를 통한 도전으로 결과를 만들어내는 저의 역량은 비씨카드에 기여할 수 있을 것이라 생각합니다.',
    1, 'v1', true, NULL
);

-- Q3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '자신만의 차별화된 경쟁력.', 3, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='자신만의 차별화된 경쟁력.' ORDER BY question_id DESC LIMIT 1),
    '도전

[철저한 준비 아래 도전하다]

‘철저한 준비’와 ''도전''이라는 두가지 키워드로 저를 소개하고 싶습니다. 계획 없이 도전하는 게 아닌, 철저한 준비 하에 도전해 결국 결과를 만들어내는 힘을 가지고 있기 때문입니다.

AI 해커톤 참여 제의를 받았을 때, Vision 영역은 제가 다뤄보지 않은 분야였습니다. 하지만 새로운 기술을 배울 수 있는 기회라고 생각해 망설임 없이 AI 개발을 맡겠다고 자원했습니다. 이러한 도전을 성공시키기 위해 학습 데이터의 XML, JSON 형식, OpenCV, YOLOv8, GPT API Prompt Engineering 등을 철저히 학습하며 준비했습니다.

대회 당일, 유일한 AI 개발자로서 상당한 부담이 있었지만, 사전에 준비한 지식을 바탕으로 차근차근 접근했습니다. 기능을 필수와 부가로 분류하여 우선순위를 정하고, MVP 방식으로 개발 전략을 수립했습니다. 24시간이라는 제한된 시간 중 16시간만에 데이터 전처리부터 YOLOv8 모델 학습, 데이터 파이프라인 구축까지 모든 기능을 구현했고, 남은 8시간에는 팀원들을 도와 프로젝트 완성도를 높였습니다. 그 결과 120팀 중 3위를 차지하며 새로운 분야에서도 철저한 준비와 체계적인 접근으로 성과를 낼 수 있다는 자신감을 얻었습니다.

국내 카드업계는 기존 카드업계뿐만 아니라 핀테크들까지 시장에 뛰어들어 경쟁이 격해지고 있습니다. 이런 상황속에서 철저한 준비를 통한 도전으로 결과를 만들어내는 저의 역량은 비씨카드에 기여할 수 있을 것이라 생각합니다.',
    1, 'v1', true, NULL
);

-- Q4
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '선택한 업무 수행을 위해 필요한 핵심 역량.', 4, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='선택한 업무 수행을 위해 필요한 핵심 역량.' ORDER BY question_id DESC LIMIT 1),
    '[데이터를 기반으로 기회를 도출하다]

‘에어비앤비 매출 증대’를 주제로 한 캡스톤 프로젝트에서 복잡한 이해관계 속에서 데이터를 기반으로 핵심 문제를 도출했던 경험이 있습니다.

에어비앤비는 호스트, 게스트, 플랫폼이라는 세 주체의 이해관계가 얽혀 있습니다. 이에 먼저 플랫폼의 수익모델인 Flywheel 구조와 연간 실적보고서를 분석했고, 신규 호스트 이탈률이 플랫폼 성장의 병목이 된다는 문제를 도출했습니다. 특히 ML을 통한 상관관계 분석 결과 게스트는 숙소 사진이나 설명의 질에 따라 예약을 결정하지만 신규 호스트는 이를 간과하고 있다는 점이 핵심 원인이었습니다.

이 문제를 해결하기 위해 저희 팀은 ‘신규 호스트를 위한 가이드 툴’을 기획했습니다. YOLOv8, SAM, CLIP 모델을 활용하여 숙소 사진의 구도, 조도, 피사체 중심성 등 게스트에게 큰 영향을 주는 12개 항목을 자동 진단하고 개선점 및 수정 기능을 제공했습니다. 또한 GPT-API와 TDA 분석을 통해 우수 숙소 키워드와 문체 패턴을 추출해 호스트가 숙소 설명 작성 시 참고 및 자동 재작성 할 수 있는 기능도 제공했습니다.

이후 A/B 테스트에서 수정된 숙소 사진은 기존 사진과 비교해 75%의 선호도를 기록했고 수정된 숙소 설명은 72.5%의 선호도를 기록했습니다. 그 결과, 최종 발표에서 종합 1위를 기록할 수 있었습니다.

카드 프로세싱 업무가 개별 기업으로 흡수되는 환경 변화 속에서, 비씨카드는 AI/DX 기반의 새로운 가치 창출에 집중하고 있습니다. 특히 금융권 최초로 AI 전담 조직을 신설하고 퍼플렉시티, 데이터브릭스 등과 전략적 파트너십을 구축하며 디지털 혁신을 가속화하고 있습니다.

이런 변화의 중심에서 제가 기여하고자 하는 것은 기술 구현보다도 데이터 속에서 고객의 숨겨진 니즈를 찾아내는 것입니다. 에어비앤비에서 여러 이해관계자의 관점을 종합해 핵심 문제를 도출했던 경험을 바탕으로 비씨카드에서도 고객 데이터를 면밀히 분석하여 새로운 서비스 기회를 발견해 나가겠습니다.',
    1, 'v1', true, NULL
);


-- -------------------- 3. 교보증권 (Kyobo Securities) --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (4, NULL, '교보증권 AI-DX 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '지원 동기', 1, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='지원 동기' ORDER BY question_id DESC LIMIT 1),
    '[AI-DX 퍼스트 무버로서 교보증권의 디지털 영토를 확장하겠습니다]

교보증권의 미래전략파트 신설과 AI-DX 가속화 전략은 단순한 조직개편이 아닌, 비즈니스 모델 재편의 신호탄이라고 생각합니다. 특히 AI와 디지털 자산을 담당하는 조직을 기획부 산하에 배치함으로써 테크 기술을 교보증권의 핵심 엔진으로 삼겠다는 의지를 읽었습니다. 저 또한 AI를 금융의 새로운 엔진으로 생각하는 사람으로서, 교보증권이 지향하는 방향성과 일치한다고 느껴 지원하게 되었습니다.

삼성청년SW·AI아카데미에서 1학기의 대미를 장식하는 관통프로젝트로 ''RAG 기반 주식 추천 서비스''를 개발하며, AI의 파괴력을 몸소 체감한 경험이 있습니다. 해당 프로젝트는 과거 뉴스 데이터를 GPT-API 임베딩을 통해 PostgreSQL에 저장하고, 새로운 뉴스 발생 시 코사인 유사도로 가장 유사했던 과거 뉴스와 당시 주가 흐름을 사용자에게 즉각 전달하는 방식이었습니다. 이 경험을 통해 AI 솔루션이 과거 뉴스 탐색, 주가 패턴 파악, 수혜주 발굴까지의 긴 투자 여정을 얼마나 단축시킬 수 있는지 직접 체감했습니다.

이 경험을 통해 AI 기반 금융 서비스의 가능성을 확신하게 되었고, 이를 가장 선도적으로 추진하는 교보증권에서 그 비전을 실현하고 싶습니다. AI 프론티어를 향해 나아가는 교보증권의 여정에 실무로 기여하는 인재가 되겠습니다.

[입사 후 포부: 기술과 비즈니스의 균형점을 찾는 인재]

교보증권의 AI-DX 전환도 "기술 완성도"와 "비용 효율성" 사이의 균형이 핵심이라고 생각합니다. 아무리 뛰어난 AI 솔루션이라도 현업의 니즈와 맞지 않거나 비용 대비 효용이 낮다면 실제 도입으로 이어지기 어렵습니다. 저는 창업경진대회에서 이 trade-off를 직접 경험했습니다.

AI 해커톤에서 3위를 차지한 지능형 CCTV 프로젝트를 SaaS 비즈니스 모델로 발전시켜 창업경진대회에 참가했습니다. 무인점포 업계를 분석한 결과, 기존 보안 솔루션의 비효율성을 파악했고, 이를 해결하는 AI 솔루션을 제안했습니다. 하지만 팀 내에서 방향이 갈렸습니다. 개발 팀원들은 기술 완성도를 위해 고성능 기능 추가를 원했고, 저는 시장성을 높이기 위해 비용 효율화를 우선해야 한다고 판단했습니다.

PM으로서 주관적 주장보다 데이터를 통해 설득하기로 했습니다. BMC 모델로 수익 구조를 시각화하고, SWOT 분석으로 경쟁사 대비 강점을 정리했습니다. 또한 점주 인터뷰 결과를 Word Cloud로 시각화해 "점주의 핵심 니즈는 비용 절감"임을 제시했습니다. 이를 근거로 핵심 기능은 유지하되 고성능 기능을 축소해 비용을 50% 절감하는 방향을 제안했고, 팀원 모두가 공감해 주었습니다. 그 결과 대회에서 대상을 수상할 수 있었습니다.

이 경험을 통해 기술은 비즈니스 가치로 연결되어야 의미가 있다는 것을 배웠습니다. 교보증권에서도 이 관점을 적용하고 싶습니다. 최근 선보인 ''알고리즘 트레이딩 리서치 MCP''와 같은 혁신 과제를 고도화할 때, 단순히 기술적 완성도만 추구하는 것이 아니라 실제 트레이더와 리서치 인력이 체감할 수 있는 효용을 중심으로 개발하겠습니다. 또한 ERP 자동화와 리포트 분석 지원을 넘어, 고객이 복잡한 포트폴리오 데이터를 직관적으로 이해할 수 있는 AI 투자 어시스턴트 개발에도 기여하고 싶습니다.

더 나아가 디지털자산Biz부와의 협업을 통해 토큰증권(STO) 등 차별화된 금융 인프라 구축에도 동참하여, 교보증권이 전 세대를 아우르는 ''디지털 자산관리의 명가''로 자리매김하는 데 일조하겠습니다. AI 프론티어를 향해 나아가는 교보증권의 여정에 실무로 기여하는 인재가 되겠습니다.',
    1, 'v1', true, NULL
);

-- Q2
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '필요해 보이는 역량과 자신의 특별한 경험.', 2, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='필요해 보이는 역량과 자신의 특별한 경험.' ORDER BY question_id DESC LIMIT 1),
    '[금융 도메인 지식을 겸비한 인재]
금융 IT는 타 IT와 다르게 금융 도메인의 이해도가 중요하다고 생각합니다. 금융 IT는 규제 요건이 시스템 로직에 직접 반영되고, 실시간 정확성이 고객 자산과 직결되기 때문입니다. 또한 금융 데이터의 경우 도메인 이해 없이는 의미 해석 자체가 불가능한 경우도 많습니다.

실제로 OO증권 공모전에서 PM을 맡아 뉴스 기반 주가 예측 프로젝트를 진행하며, 금융 도메인 지식 부족으로 인한 실패를 경험했습니다. 당시 뉴스 데이터와 주가를 연결하는 과정에서 종목의 업종/섹터 분류를 누락시켰습니다. 유사한 과거 뉴스를 검색해도 해당 뉴스가 어떤 업종에 영향을 미치는지 연결하지 못해, 수혜주 추천의 정확도가 크게 떨어졌습니다. 뒤늦게 동일한 매크로 뉴스도 섹터별로 상반된 영향을 준다는 점을 깨달았습니다. 예를 들어 금리 인상 뉴스는 금융주에는 호재지만 성장주에는 악재로 작용합니다. 이처럼 금융 시장의 연결 구조를 이해하지 못한 것이 근본적인 문제였습니다.

해당 경험을 계기로 금융 도메인 지식의 필요성을 깨달았습니다. 이후 투자자산운용사 자격증을 취득하며 금융상품 구조, 시장 지표, 섹터별 특성을 체계적으로 학습했습니다. 그리고 삼성청년SW·AI아카데미에서 ''RAG 기반 주식 추천 서비스''를 다시 설계하며 부족했던 부분을 보완해, 뉴스 데이터에 업종 태깅을 추가하고, 섹터별 주가 반응 패턴을 함께 저장하여 "이 뉴스가 어떤 업종에 어떤 영향을 주는가"까지 연결되는 구조로 개선했습니다. 그 결과 수혜주 추천의 정확도와 설명력을 높일 수 있었습니다.

[원활한 기술 소통 능력]
금융 업계에서 기술팀과 현업 간의 원활한 소통은 곧 가치창출로 이어진다고 생각합니다. 소통의 미스매치는 요구사항 오해와 재작업으로 이어지고, 이는 곧 시간 지연을 의미합니다. 금융권에서 시간은 곧 비용이자 기회입니다. 특히 AI-DX를 추진하는 환경에서는 "이 기술이 왜 필요한지, 어떻게 작동하는지"를 비개발 직군과 현업이 명학하게 소통하는 능력이 프로젝트 성패와 기업의 성과를 좌우한다고 생각합니다.

저는 복잡한 기술 개념을 쉽게 전달하는 데 강점이 있습니다. 삼성청년SW·AI아카데미에서 알고리즘 스터디장을 맡아 매주 동료들에게 개념을 설명했고, AI 프로젝트를 진행하며 RAG, Langchain 등 생소한 기술을 팀원들에게 공유하는 역할을 자처했습니다. 설명할 때는 이해를 돕기 위해서 항상 비유를 드는 습관이 있습니다. 예를 들어 RAG는 "오픈북 시험"에 비유했습니다. 기존 LLM이 모든 걸 암기해서 답하는 방식이라면, RAG는 관련 자료를 먼저 찾아본 뒤 답하는 오픈북 시험과 같다고 설명했습니다. 비유만으로 부족할 때는 A4 용지에 데이터 흐름을 직접 그려가며 설명했습니다.

이러한 노력을 인정받아 SSAFY 입과 첫 달 ''이달의 동료''로 선정되었습니다. 동료들이 직접 투표로 뽑아주었다는 점에서, 단순한 친화력이 아닌 실질적인 협업 기여를 인정받았다고 생각합니다. 교보증권에서도 현업과 기술팀의 가교로서 이 역량을 발휘하고 싶습니다. AI-DX전환 과정에서 현업의 니즈를 기술 요건으로 정확히 전환하고, 기술팀의 솔루션을 현업이 이해할 수 있도록 연결하겠습니다.

금융 도메인 이해와 기술 소통 능력, 이 두 가지 역량은 결국 하나로 연결됩니다. 도메인을 알아야 현업의 언어를 이해할 수 있고, 기술을 쉽게 설명할 수 있어야 현업과 함께 문제를 해결할 수 있습니다. 저는 공모전의 실패를 통해 금융 도메인 학습의 필요성을 깨달았고, 스터디와 프로젝트를 통해 기술 소통의 경험을 쌓아왔습니다.

교보증권의 AI-DX 전환은 기술만으로 완성되지 않습니다. 기술을 이해하는 동시에 현업과 소통할 수 있는 인재가 필요하다고 생각합니다.저는 그 접점에서 교보증권의 디지털 전환을 실무로 뒷받침하는 인재가 되겠습니다.',
    1, 'v1', true, NULL
);

-- Q3
INSERT INTO question (recruitment_id, content, order_val, char_max)
VALUES (NULL, '차별화된 강점과 보완해야 할 약점.', 3, 1000);

INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=4 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='차별화된 강점과 보완해야 할 약점.' ORDER BY question_id DESC LIMIT 1),
    '[철저한 준비로 결과를 만들어내다]

''철저한 준비''라는 키워드로 저의 강점을 소개하고 싶습니다. 낯선 영역에서도 체계적으로 준비하고,결국 결과를 만들어내는 힘을 가지고 있기 때문입니다.

AI 해커톤 참여 제의를 받았을 때, Vision 영역은 제가 다뤄보지 않은 분야였습니다. 하지만 새로운 기술을 배울 수 있는 기회라고 생각해 망설임 없이 AI 개발을 맡겠다고 자원했습니다. 이러한 도전을 성공시키기 위해 학습 데이터의 XML, JSON 형식, OpenCV, YOLOv8, GPT API Prompt Engineering 등을 철저히 학습하며 준비했습니다.

대회 당일, 유일한 AI 개발자로서 상당한 부담이 있었지만, 사전에 준비한 지식을 바탕으로 차근차근 접근했습니다. 기능을 필수와 부가로 분류하여 우선순위를 정하고, MVP 방식으로 개발 전략을 수립했습니다. 24시간이라는 제한된 시간 중 16시간 만에 데이터 전처리부터 YOLOv8 모델 학습, 데이터 파이프라인 구축까지 모든 핵심 기능을 구현했고, 남은 8시간에는 팀원들을 도와 프로젝트 완성도를 높였습니다. 그 결과 120팀 중 3위를 차지하며 새로운 분야에서도 철저한 준비와 체계적인 접근으로 성과를 낼 수 있다는 자신감을 얻었습니다.

증권업계는 사소한 오차만으로도 큰 리스크가 발생하는 업종입니다. 시스템 장애 한 번이 고객 자산 손실로 직결될 수 있고, 데이터 처리 오류 하나가 컴플라이언스 이슈로 이어질 수 있습니다. 저의 철저한 준비성은 이러한 리스크를 사전에 방지하고,안정적인 시스템 운영에 기여할 수 있는 역량이라고 생각합니다. 교보증권의 AI-DX 전환 과정에서도 새로운 기술 도입 시 충분한 검증과 준비를 통해 안정성과 혁신을 동시에 추구하겠습니다.

[보완 중인 약점: 자바 기반 백엔드 역량]

금융권 IT 시스템은 안정성과 유지보수를 이유로 자바 기반 백엔드가 주류입니다. 대규모 트랜잭션 처리, 엄격한 타입 시스템, 검증된 엔터프라이즈 생태계 등이 금융권에서 자바를 선호하는 이유라고 이해하고 있습니다. 저는 그동안 Python 중심의 AI/데이터 프로젝트에 집중해왔기에, 자바 백엔드 경험이 상대적으로 부족합니다. 이는 금융 IT 직무를 수행하는 데 있어 반드시 보완이 필요한 부분임을 명확히 인지하고 있습니다.

이를 보완하기 위해 현재 삼성청년SW·AI아카데미에서 Spring Boot 기반 프로젝트를 수행하고 있습니다. 자소서 작성을 도와주는 AI 서비스를 개발하며, 헥사고날 아키텍처를 적용해 도메인과 인프라를 분리하는 구조를 직접 설계하고 구현하고 있습니다. 포트와 어댑터 패턴을 통해 외부 의존성을 격리하고, 비즈니스 로직의 독립성을 유지하는 설계를 구현하고 있습니다. 이러한 아키텍처 선택은 단순히 학습 목적이 아니라, 금융권에서 중시하는 유지보수성과 확장성, 그리고 테스트 용이성을 직접 체험하기 위함입니다.

아직 숙련 단계는 아니지만, Vision AI처럼 낯선 영역에서도 단기간에 학습해 성과를 낸 경험이 있습니다. 2주간의 집중 학습으로 해커톤에서 3위를 차지했던 것처럼, 자바 백엔드 역량 역시 같은 방식으로 빠르게 갖춰나가겠습니다. 부족함을 인정하고 꾸준히 채워나가는 자세로, 교보증권에 입사 후에도 멈추지 않고 성장하는 인재가 되겠습니다.',
    1, 'v1', true, NULL
);


-- ============================================================
-- USER 5: Dummy Data (Same content as User 4)
-- ============================================================

-- -------------------- 1. SK텔링크 --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, NULL, 'SK텔링크 마케팅 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1 essay (참조: 목표를 세우고, 달성하고자 노력한 경험.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='목표를 세우고, 달성하고자 노력한 경험.' ORDER BY question_id DESC LIMIT 1),
    '[120개 팀 중 3위, 준비가 만든 결과]

비전 AI를 처음 접한 지 2주 만에 AI 해커톤 우수상을 수상했습니다. 저는 불가능해 보이는 도전에서도 체계적 준비로 결과를 만드는 인재입니다.

대회 주제는 ''지능형 CCTV 시스템'' 개발이었습니다. 비전 AI 경험이 전무했지만, 지능형 CCTV의 핵심 과제인 ''사람 객체 분류와 상품 인식''에 도전하기로 했습니다. 대회 2주 전부터 매일 4시간씩 YOLOv8 공식 문서를 분석하며 객체 인식의 기초를 다졌고, 데이터 전처리부터 모델 학습, GPT-API 연동까지 전체 파이프라인을 세 차례 반복 구현하며 이해도를 높였습니다.

특히 대회장 환경을 사전 시뮬레이션한 것이 주효했습니다. 일반 CCTV는 천장에서 하향 촬영하지만, 대회에서는 노트북 카메라로 시연해야 했습니다. 이 각도 차이를 고려해 학습 데이터를 다각도로 구성했고, 대회장 시연 시 상품 인식률 저하를 최소화할 수 있도록 세팅했습니다. 덕분에 24시간 중 12시간 만에 핵심 기능을 완성하고, 남은 시간에는 UI 개선과 엣지 케이스 대응에 집중했습니다.

그 결과, 120팀 중 3위로 우수상을 수상했습니다. 심사위원께서 "준비의 완성도가 결과의 차이를 만들었다"고 평가하신 것처럼, 이 경험을 통해 ''철저한 준비가 실력 격차를 뛰어넘는다''는 것을 배웠습니다. SK텔링크에서도 마케팅 캠페인 하나를 기획하더라도, 고객 데이터 분석부터 경쟁사 벤치마킹, A/B 테스트 시나리오까지 빈틈없이 준비해 최고의 성과를 만들겠습니다.',
    1, 'v1', true, NULL
);

-- Q2 essay (참조: 남다른 아이디어를 통해 문제를 개선한 경험.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='남다른 아이디어를 통해 문제를 개선한 경험.' ORDER BY question_id DESC LIMIT 1),
    '"상업성을 위해 기능을 포기하다"

AI 해커톤에서 지능형 CCTV 기술을 개발했지만, 상업성이 부족했습니다. 저희 팀이 만든 기술이 실제 시장에서도 통하는지 검증하기 위해 창업경진대회에 도전했고, 가장 효과적으로 작용할 시장을 탐색했습니다.

무인점포 업계를 분석한 결과, 점주들의 페인 포인트를 발견했습니다. 기존 무인점포 업계는 수백만 원대 토탈 보안솔루션을 도입하거나, 사람이 직접 CCTV를 24시간 감시해야 했습니다. 전자는 소상공인에게 과도한 비용 부담을, 후자는 24시간 모니터링 불가능이라는 인적 부담을 안겼습니다.

저희는 기존 CCTV에 소프트웨어만 추가하는 방식을 제안했습니다. 고가 하드웨어 교체 없이 AI 알고리즘을 탑재해 이상행동을 자동 감지하고 실시간 알림을 보내는 방식으로, 도입 비용을 80% 이상 절감했습니다. 또한 본연의 경쟁력인 비용 절감 기능을 확보하기 위해, GPT-API 기반 고성능 기능 일부를 포기해야 했습니다. 팀원들은 "기능을 줄이면 경쟁력이 떨어지지 않겠냐"며 우려했지만, 저는 "완벽한 기술보다 고객이 감당 가능한 솔루션이 더 가치 있다"고 설득했습니다. 무인점포 점주 대다수가 소상공인이라는 점에서, 저비용이 최대 경쟁력이 될 것으로 확신했기 때문입니다.

이러한 전략으로 기존 보안 솔루션 대비 경쟁력을 인정받으며 대상을 수상했습니다. 혁신은 최첨단 기술이 아닌, 고객의 실질적 니즈 해결에서 시작된다는 것을 배웠습니다. SK텔링크에서도 고객의 니즈 해결을 최우선으로 삼는 마케터가 되겠습니다.',
    1, 'v1', true, NULL
);

-- Q3 essay (참조: 전문성을 키우기 위해 노력한 구체적인 경험.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='전문성을 키우기 위해 노력한 구체적인 경험.' ORDER BY question_id DESC LIMIT 1),
    '"AI 역량을 기른 도전"

학과 커리큘럼을 넘어 학습하고 싶어 타과 교수님께 학부연구생을 자청했습니다. 인공지능 연구실에서 6개월간 ''SNS 데이터를 통한 MBTI 이진분류'' 프로젝트를 수행하며 데이터 수집부터 전처리, 문장 임베딩, 모델링, 평가까지 자연어 처리의 전 과정을 주도했습니다. 이를 통해 NLP 프로젝트를 처음부터 끝까지 이끌 수 있는 실무 역량을 갖추게 되었습니다.

SK텔링크 입사 후 데이터 기반 마케터로 성장하겠습니다. 알뜰폰 시장은 가격과 프로모션에 민감한 고객층으로, 데이터 분석으로 그들의 니즈를 선제적으로 대응하면 큰 효과를 낼 수 있다고 생각합니다.',
    1, 'v1', true, NULL
);

-- Q4 essay (참조: AI 도구를 활용한 문제를 해결한 경험.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='AI 도구를 활용한 문제를 해결한 경험.' ORDER BY question_id DESC LIMIT 1),
    '삼성 SW·AI 아카데미에서 AI를 학습 코치로 활용해 알고리즘 실력을 향상시켰습니다.

처음 GPT에게 질문했을 때는 전체 정답까지 알려줘서 학습 효과가 없었습니다. 이를 개선하기 위해 프롬프트 엔지니어링을 적용했습니다. AI가 정답을 직접 제공하지 않고, 오류를 알고리즘 분류 실패·로직 오류·구현 실수 세 단계로 구분해 힌트만 제시하도록 프롬프트를 설계했습니다.

이를 통해 스스로 사고하는 훈련을 반복한 결과, 백준 골드 달성과 아카데미 알고리즘 테스트 상위 10%에 진입할 수 있었습니다.',
    1, 'v1', true, NULL
);


-- -------------------- 2. 비씨카드 --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, NULL, '비씨카드 AX/DX 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1 essay (참조: 자신을 가장 잘 표현하는 역량과 이유를 설명하세요.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='자신을 가장 잘 표현하는 역량과 이유를 설명하세요.' ORDER BY question_id DESC LIMIT 1),
    '도전

[철저한 준비 아래 도전하다]

''철저한 준비''와 ''도전''이라는 두가지 키워드로 저를 소개하고 싶습니다. 계획 없이 도전하는 게 아닌, 철저한 준비 하에 도전해 결국 결과를 만들어내는 힘을 가지고 있기 때문입니다.

AI 해커톤 참여 제의를 받았을 때, Vision 영역은 제가 다뤄보지 않은 분야였습니다. 하지만 새로운 기술을 배울 수 있는 기회라고 생각해 망설임 없이 AI 개발을 맡겠다고 자원했습니다. 이러한 도전을 성공시키기 위해 학습 데이터의 XML, JSON 형식, OpenCV, YOLOv8, GPT API Prompt Engineering 등을 철저히 학습하며 준비했습니다.

대회 당일, 유일한 AI 개발자로서 상당한 부담이 있었지만, 사전에 준비한 지식을 바탕으로 차근차근 접근했습니다. 기능을 필수와 부가로 분류하여 우선순위를 정하고, MVP 방식으로 개발 전략을 수립했습니다. 24시간이라는 제한된 시간 중 16시간만에 데이터 전처리부터 YOLOv8 모델 학습, 데이터 파이프라인 구축까지 모든 기능을 구현했고, 남은 8시간에는 팀원들을 도와 프로젝트 완성도를 높였습니다. 그 결과 120팀 중 3위를 차지하며 새로운 분야에서도 철저한 준비와 체계적인 접근으로 성과를 낼 수 있다는 자신감을 얻었습니다.

국내 카드업계는 기존 카드업계뿐만 아니라 핀테크들까지 시장에 뛰어들어 경쟁이 격해지고 있습니다. 이런 상황속에서 철저한 준비를 통한 도전으로 결과를 만들어내는 저의 역량은 비씨카드에 기여할 수 있을 것이라 생각합니다.',
    1, 'v1', true, NULL
);

-- Q2 essay (참조: 지원 동기.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='지원 동기.' ORDER BY question_id DESC LIMIT 1),
    '비씨카드의 AI/DX 혁신 전략에 공감하여 지원하게 되었습니다. 특히 금융권 최초로 AI 전담 조직을 신설하고 퍼플렉시티, 데이터브릭스 등과 전략적 파트너십을 구축하며 디지털 혁신을 가속화하고 있다는 점에서 큰 매력을 느꼈습니다.

저는 데이터 속에서 고객의 숨겨진 니즈를 찾아내는 것에 강점이 있습니다. 비씨카드에서도 고객 데이터를 면밀히 분석하여 새로운 서비스 기회를 발견해 나가겠습니다.',
    1, 'v1', true, NULL
);

-- Q3 essay (참조: 자신만의 차별화된 경쟁력.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='자신만의 차별화된 경쟁력.' ORDER BY question_id DESC LIMIT 1),
    '[데이터 기반 문제 해결 역량]

에어비앤비 매출 증대 캡스톤 프로젝트에서 PM을 맡아 복잡한 이해관계 속에서 핵심 문제를 도출한 경험이 있습니다. 호스트, 게스트, 플랫폼이라는 세 주체의 이해관계를 분석하고, 신규 호스트 이탈률이 성장의 병목이 된다는 문제를 발견했습니다.

이 문제를 해결하기 위해 YOLOv8, SAM, CLIP 모델을 활용하여 숙소 사진을 자동 진단하는 가이드 툴을 기획했습니다. A/B 테스트 결과 수정된 사진은 75%, 설명은 72.5%의 선호도를 기록하며 종합 1위를 달성했습니다.',
    1, 'v1', true, NULL
);

-- Q4 essay (참조: 선택한 업무 수행을 위해 필요한 핵심 역량.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='선택한 업무 수행을 위해 필요한 핵심 역량.' ORDER BY question_id DESC LIMIT 1),
    '[데이터를 기반으로 기회를 도출하다]

''에어비앤비 매출 증대''를 주제로 한 캡스톤 프로젝트에서 복잡한 이해관계 속에서 데이터를 기반으로 핵심 문제를 도출했던 경험이 있습니다.

에어비앤비는 호스트, 게스트, 플랫폼이라는 세 주체의 이해관계가 얽혀 있습니다. 이에 먼저 플랫폼의 수익모델인 Flywheel 구조와 연간 실적보고서를 분석했고, 신규 호스트 이탈률이 플랫폼 성장의 병목이 된다는 문제를 도출했습니다.

카드 프로세싱 업무가 개별 기업으로 흡수되는 환경 변화 속에서, 비씨카드는 AI/DX 기반의 새로운 가치 창출에 집중하고 있습니다. 이런 변화의 중심에서 제가 기여하고자 하는 것은 기술 구현보다도 데이터 속에서 고객의 숨겨진 니즈를 찾아내는 것입니다.',
    1, 'v1', true, NULL
);


-- -------------------- 3. 교보증권 --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (5, NULL, '교보증권 AI-DX 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1 essay (참조: 지원 동기)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='지원 동기' ORDER BY question_id DESC LIMIT 1),
    '[AI-DX 퍼스트 무버로서 교보증권의 디지털 영토를 확장하겠습니다]

교보증권의 미래전략파트 신설과 AI-DX 가속화 전략은 단순한 조직개편이 아닌, 비즈니스 모델 재편의 신호탄이라고 생각합니다. 특히 AI와 디지털 자산을 담당하는 조직을 기획부 산하에 배치함으로써 테크 기술을 교보증권의 핵심 엔진으로 삼겠다는 의지를 읽었습니다.

삼성청년SW·AI아카데미에서 1학기의 대미를 장식하는 관통프로젝트로 ''RAG 기반 주식 추천 서비스''를 개발하며, AI의 파괴력을 몸소 체감한 경험이 있습니다. AI 프론티어를 향해 나아가는 교보증권의 여정에 실무로 기여하는 인재가 되겠습니다.',
    1, 'v1', true, NULL
);

-- Q2 essay (참조: 필요해 보이는 역량과 자신의 특별한 경험.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='필요해 보이는 역량과 자신의 특별한 경험.' ORDER BY question_id DESC LIMIT 1),
    '[금융 도메인 지식을 겸비한 인재]

금융 IT는 타 IT와 다르게 금융 도메인의 이해도가 중요하다고 생각합니다. 금융 IT는 규제 요건이 시스템 로직에 직접 반영되고, 실시간 정확성이 고객 자산과 직결되기 때문입니다.

실제로 OO증권 공모전에서 PM을 맡아 뉴스 기반 주가 예측 프로젝트를 진행하며, 금융 도메인 지식 부족으로 인한 실패를 경험했습니다. 해당 경험을 계기로 투자자산운용사 자격증을 취득하며 금융상품 구조, 시장 지표, 섹터별 특성을 체계적으로 학습했습니다.

저는 복잡한 기술 개념을 쉽게 전달하는 데 강점이 있습니다. 교보증권에서도 현업과 기술팀의 가교로서 이 역량을 발휘하고 싶습니다.',
    1, 'v1', true, NULL
);

-- Q3 essay (참조: 차별화된 강점과 보완해야 할 약점.)
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=5 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='차별화된 강점과 보완해야 할 약점.' ORDER BY question_id DESC LIMIT 1),
    '[철저한 준비로 결과를 만들어내다]

''철저한 준비''라는 키워드로 저의 강점을 소개하고 싶습니다. 낯선 영역에서도 체계적으로 준비하고, 결국 결과를 만들어내는 힘을 가지고 있기 때문입니다.

AI 해커톤에서 Vision AI라는 낯선 분야에 도전해 120팀 중 3위를 차지했습니다. 저의 철저한 준비성은 리스크를 사전에 방지하고, 안정적인 시스템 운영에 기여할 수 있는 역량이라고 생각합니다.

[보완 중인 약점: 자바 기반 백엔드 역량]

현재 삼성청년SW·AI아카데미에서 Spring Boot 기반 프로젝트를 수행하며 자바 백엔드 역량을 보완하고 있습니다.',
    1, 'v1', true, NULL
);


-- ============================================================
-- USER 6: Dummy Data (Same content as User 4)
-- ============================================================

-- -------------------- 1. SK텔링크 --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, NULL, 'SK텔링크 마케팅 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='목표를 세우고, 달성하고자 노력한 경험.' ORDER BY question_id DESC LIMIT 1),
    '[120개 팀 중 3위, 준비가 만든 결과]

비전 AI를 처음 접한 지 2주 만에 AI 해커톤 우수상을 수상했습니다. 저는 불가능해 보이는 도전에서도 체계적 준비로 결과를 만드는 인재입니다.

대회 주제는 ''지능형 CCTV 시스템'' 개발이었습니다. 비전 AI 경험이 전무했지만, 지능형 CCTV의 핵심 과제인 ''사람 객체 분류와 상품 인식''에 도전하기로 했습니다. 대회 2주 전부터 매일 4시간씩 YOLOv8 공식 문서를 분석하며 객체 인식의 기초를 다졌고, 데이터 전처리부터 모델 학습, GPT-API 연동까지 전체 파이프라인을 세 차례 반복 구현하며 이해도를 높였습니다.

그 결과, 120팀 중 3위로 우수상을 수상했습니다. SK텔링크에서도 마케팅 캠페인 하나를 기획하더라도, 고객 데이터 분석부터 경쟁사 벤치마킹, A/B 테스트 시나리오까지 빈틈없이 준비해 최고의 성과를 만들겠습니다.',
    1, 'v1', true, NULL
);

-- Q2 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='남다른 아이디어를 통해 문제를 개선한 경험.' ORDER BY question_id DESC LIMIT 1),
    '"상업성을 위해 기능을 포기하다"

AI 해커톤에서 지능형 CCTV 기술을 개발했지만, 상업성이 부족했습니다. 창업경진대회에 도전하며 무인점포 업계의 페인 포인트를 발견했습니다.

저희는 기존 CCTV에 소프트웨어만 추가하는 방식을 제안했습니다. 고가 하드웨어 교체 없이 AI 알고리즘을 탑재해 이상행동을 자동 감지하고 실시간 알림을 보내는 방식으로, 도입 비용을 80% 이상 절감했습니다.

이러한 전략으로 대상을 수상했습니다. 혁신은 최첨단 기술이 아닌, 고객의 실질적 니즈 해결에서 시작된다는 것을 배웠습니다.',
    1, 'v1', true, NULL
);

-- Q3 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='전문성을 키우기 위해 노력한 구체적인 경험.' ORDER BY question_id DESC LIMIT 1),
    '"AI 역량을 기른 도전"

학과 커리큘럼을 넘어 학습하고 싶어 타과 교수님께 학부연구생을 자청했습니다. 인공지능 연구실에서 6개월간 ''SNS 데이터를 통한 MBTI 이진분류'' 프로젝트를 수행하며 NLP 프로젝트를 처음부터 끝까지 이끌 수 있는 실무 역량을 갖추게 되었습니다.

SK텔링크 입사 후 데이터 기반 마케터로 성장하겠습니다.',
    1, 'v1', true, NULL
);

-- Q4 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='SK텔링크 마케팅 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='AI 도구를 활용한 문제를 해결한 경험.' ORDER BY question_id DESC LIMIT 1),
    '삼성 SW·AI 아카데미에서 AI를 학습 코치로 활용해 알고리즘 실력을 향상시켰습니다.

처음 GPT에게 질문했을 때는 전체 정답까지 알려줘서 학습 효과가 없었습니다. 이를 개선하기 위해 프롬프트 엔지니어링을 적용했습니다. AI가 정답을 직접 제공하지 않고, 오류를 세 단계로 구분해 힌트만 제시하도록 프롬프트를 설계했습니다.

이를 통해 백준 골드 달성과 아카데미 알고리즘 테스트 상위 10%에 진입할 수 있었습니다.',
    1, 'v1', true, NULL
);


-- -------------------- 2. 비씨카드 --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, NULL, '비씨카드 AX/DX 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='자신을 가장 잘 표현하는 역량과 이유를 설명하세요.' ORDER BY question_id DESC LIMIT 1),
    '도전

[철저한 준비 아래 도전하다]

''철저한 준비''와 ''도전''이라는 두가지 키워드로 저를 소개하고 싶습니다. AI 해커톤에서 Vision 영역이라는 낯선 분야에 도전해 120팀 중 3위를 차지한 경험이 있습니다.

국내 카드업계는 핀테크들까지 시장에 뛰어들어 경쟁이 격해지고 있습니다. 이런 상황속에서 철저한 준비를 통한 도전으로 결과를 만들어내는 저의 역량은 비씨카드에 기여할 수 있을 것이라 생각합니다.',
    1, 'v1', true, NULL
);

-- Q2 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='지원 동기.' ORDER BY question_id DESC LIMIT 1),
    '비씨카드의 AI/DX 혁신 전략에 공감하여 지원하게 되었습니다. 금융권 최초로 AI 전담 조직을 신설하고 디지털 혁신을 가속화하고 있다는 점에서 큰 매력을 느꼈습니다.

저는 데이터 속에서 고객의 숨겨진 니즈를 찾아내는 것에 강점이 있습니다. 비씨카드에서도 고객 데이터를 면밀히 분석하여 새로운 서비스 기회를 발견해 나가겠습니다.',
    1, 'v1', true, NULL
);

-- Q3 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='자신만의 차별화된 경쟁력.' ORDER BY question_id DESC LIMIT 1),
    '[데이터 기반 문제 해결 역량]

에어비앤비 매출 증대 캡스톤 프로젝트에서 PM을 맡아 신규 호스트 이탈률이 성장의 병목이 된다는 문제를 발견했습니다. YOLOv8, SAM, CLIP 모델을 활용하여 숙소 사진을 자동 진단하는 가이드 툴을 기획해 종합 1위를 달성했습니다.',
    1, 'v1', true, NULL
);

-- Q4 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='비씨카드 AX/DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='선택한 업무 수행을 위해 필요한 핵심 역량.' ORDER BY question_id DESC LIMIT 1),
    '[데이터를 기반으로 기회를 도출하다]

''에어비앤비 매출 증대'' 캡스톤 프로젝트에서 복잡한 이해관계 속에서 데이터를 기반으로 핵심 문제를 도출했습니다. 플랫폼의 수익모델과 연간 실적보고서를 분석해 신규 호스트 이탈률이 병목이 된다는 문제를 발견했습니다.

비씨카드에서도 데이터 속에서 고객의 숨겨진 니즈를 찾아내겠습니다.',
    1, 'v1', true, NULL
);


-- -------------------- 3. 교보증권 --------------------
INSERT INTO coverletter (account_id, recruitment_id, title, is_complete, is_passed, created_at, updated_at, deleted_at)
VALUES (6, NULL, '교보증권 AI-DX 지원', true, NULL, NOW(), NOW(), NULL);

-- Q1 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='지원 동기' ORDER BY question_id DESC LIMIT 1),
    '[AI-DX 퍼스트 무버로서 교보증권의 디지털 영토를 확장하겠습니다]

교보증권의 미래전략파트 신설과 AI-DX 가속화 전략에 공감하여 지원합니다. 특히 AI와 디지털 자산을 담당하는 조직을 기획부 산하에 배치함으로써 테크 기술을 핵심 엔진으로 삼겠다는 의지를 읽었습니다.

삼성청년SW·AI아카데미에서 ''RAG 기반 주식 추천 서비스''를 개발하며 AI의 파괴력을 몸소 체감했습니다. AI 프론티어를 향해 나아가는 교보증권의 여정에 실무로 기여하는 인재가 되겠습니다.',
    1, 'v1', true, NULL
);

-- Q2 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='필요해 보이는 역량과 자신의 특별한 경험.' ORDER BY question_id DESC LIMIT 1),
    '[금융 도메인 지식을 겸비한 인재]

금융 IT는 규제 요건이 시스템 로직에 직접 반영되고, 실시간 정확성이 고객 자산과 직결됩니다. 저는 투자자산운용사 자격증을 취득하며 금융상품 구조, 시장 지표, 섹터별 특성을 체계적으로 학습했습니다.

또한 복잡한 기술 개념을 쉽게 전달하는 데 강점이 있어, 교보증권에서 현업과 기술팀의 가교 역할을 할 수 있습니다.',
    1, 'v1', true, NULL
);

-- Q3 essay
INSERT INTO essay (coverletter_id, question_id, content, version, version_title, is_current, deleted_at)
VALUES (
    (SELECT coverletter_id FROM coverletter WHERE account_id=6 AND title='교보증권 AI-DX 지원' ORDER BY coverletter_id DESC LIMIT 1),
    (SELECT question_id FROM question WHERE content='차별화된 강점과 보완해야 할 약점.' ORDER BY question_id DESC LIMIT 1),
    '[철저한 준비로 결과를 만들어내다]

낯선 영역에서도 체계적으로 준비하고, 결국 결과를 만들어내는 힘을 가지고 있습니다. AI 해커톤에서 Vision AI라는 낯선 분야에 도전해 120팀 중 3위를 차지했습니다.

[보완 중인 약점]

현재 삼성청년SW·AI아카데미에서 Spring Boot 기반 프로젝트를 수행하며 자바 백엔드 역량을 보완하고 있습니다. 부족함을 인정하고 꾸준히 채워나가는 자세로 성장하겠습니다.',
    1, 'v1', true, NULL
);