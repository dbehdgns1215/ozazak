-- 1. 게시글 본문 삽입
INSERT INTO community (
    community_id,
    account_id,
    title,
    content,
    view,
    community_code,
    is_hot,
    created_at
) VALUES (
             304,
             1,
             '글로벌 삼성이 정의하는 ''초연결 시대''의 디자인 언어',
             '<blockquote>"오늘은 글로벌 브랜드 가치를 통합하는 디자인 시스템과 ''One UI''의 핵심 원칙에 대해 정리했다."</blockquote>
             <br>
             💡 <strong>핵심 성과</strong><br>
             <mark>디자인 토큰(Design Token) 도입으로 파편화 문제 40% 이상 개선</mark><br>
             <br>
             🔍 <strong>상세 인사이트</strong><br>
             <strong>학습 배경:</strong> 모바일, 가전, TV 등 수만 개의 제품 접점을 하나의 브랜드 경험으로 통합해야 하는 디자인적 난제를 해결해야 했다. 전 세계 사용자에게 <u>일관된 심미성과 사용성</u>을 제공하기 위한 체계적인 시스템의 필요성을 절감했다.<br>
             <br>
             <strong>주요 인사이트:</strong><br>
             <ul>
                 <li><strong>초연결 가이드라인:</strong> 기기 간 시각적 일관성을 유지하면서도 스마트폰부터 냉장고 스크린까지 각 환경에 최적화된 반응형 컴포넌트 설계법을 정립했다.</li>
                 <li><strong>접근성(Accessibility):</strong> 단순히 예쁜 디자인을 넘어 고령자 및 장애인을 고려한 대비값, 폰트 스케일링 시스템을 구축했다.</li>
                 <li><strong>아이코노그래피:</strong> 언어의 장벽을 넘는 글로벌 공통 심볼릭 디자인 원칙을 수립했다.</li>
             </ul>
             <strong>실무 적용:</strong> 실제 개발 팀과 협업하며 <strong>디자인 토큰(Design Token)</strong>을 도입했다. 이를 통해 수백 개의 UI 에셋을 자동화된 프로세스로 배포했으며, 결과적으로 디자인 파편화 문제를 기존 대비 <mark>40% 이상 개선</mark>할 수 있었다.<br>
             <br>
             📝 <strong>느낀 점 및 향후 계획</strong><br>
             <small>디자인은 단순히 시각적인 화려함을 추구하는 것이 아니라, 브랜드의 철학을 모든 기술적 접점에 정교하게 녹여내는 설계 과정임을 깊이 깨달았다. 향후 AI 기반 가변형 UI 컴포넌트 연구와 글로벌 사용자 피드백 기반 가이드라인 고도화를 진행할 예정이다.</small><br>
             <br>
             <figure style="text-align: center; margin: 2rem 0;">
               <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/images/86418d3e-5941-4e59-9d48-39d4cdfb165f/large.jpg" alt="samsung_design" style="width: 100%; height: auto; display: inline-block;" />
             </figure>',
             134,
             4,
             true,
             '2026-02-05 09:00:00'
         );

-- 2. 해당 게시글의 태그 삽입
INSERT INTO community_tag (community_id, name) VALUES
                                                   (304, 'BrandIdentity'),
                                                   (304, 'CX디자인'),
                                                   (304, 'DesignSystem'),
                                                   (304, 'SamsungUX');

-- 1. 게시글 본문 삽입
INSERT INTO community (
    community_id,
    account_id,
    title,
    content,
    view,
    community_code,
    is_hot,
    created_at
) VALUES (
             305,
             1,
             '100만 명의 일상에 녹아드는 하이퍼로컬 서비스 기획법',
             '<figure style="text-align: center; margin: 2rem 0;">
               <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/images/7008af1e-0a13-4248-9ed6-52560f957bd3/large.jpg" alt="hyperlocal_service" style="width: 383px; height: 293px; display: inline-block;" />
             </figure>
             <br>
             <strong>"데이터로 분석한 유저의 심리적 불신, 어떻게 신뢰로 바꿀 것인가?"</strong><br>
             <br>
             💡 <strong>핵심 성과</strong><br>
             <mark>신뢰 지표 개편 후 유저 채팅 연결 성공률 28% 상승</mark><br>
             <br>
             🎯 <strong>기획 포인트</strong><br>
             <strong>기획 배경:</strong> 이웃 간 거래와 소통이 중심인 하이퍼로컬 서비스에서 유저들이 느끼는 <strong>''심리적 불신''</strong>이 서비스 이탈의 가장 큰 원인임을 데이터로 확인했습니다. 이를 해결할 기획적 장치가 절실했습니다.<br>
             <br>
             <strong>주요 분석 내용:</strong><br>
             <ul>
                 <li><strong>이탈 지점 분석:</strong> 거래 전 채팅 단계에서 발생하는 특정 키워드와 이탈률의 상관관계를 도출하여 마찰 지점을 찾아냈습니다.</li>
                 <li><strong>신뢰 지표 설계:</strong> 단순한 별점 시스템을 넘어, 응답 속도와 매너 평가를 결합한 알고리즘 기반의 <u>''유저 신뢰 점수''</u> 체계를 설계했습니다.</li>
                 <li><strong>동네 인증 UX:</strong> 보안과 편의성 사이의 균형을 맞춘 위치 인증 주기 로직을 설계했습니다.</li>
             </ul>
             <strong>실전 활용:</strong> 신뢰 지표 개편 후 <strong>유저 간 채팅 연결 성공률이 전월 대비 <mark>28% 상승</mark>했습니다.</strong> 또한 부정 거래 신고율이 현저히 감소하며 건강한 커뮤니티 생태계가 구축되는 성과를 거두었습니다.<br>
             <br>
             ⚠️ <strong>주의사항 및 느낀 점</strong><br>
             <small>데이터 수치에만 매몰되지 말고 유저의 정성적인 목소리에 귀를 기울여야 합니다. 서비스 기획자의 역할은 유저의 불편함을 해결하는 것을 넘어, 유저들이 서로를 믿고 소통할 수 있는 <strong>''무대''</strong>를 만들어주는 것임을 배웠습니다.</small>',
             4800,
             4,
             true,
             '2026-02-06 10:00:00'
         );

-- 2. 해당 게시글의 태그 삽입
INSERT INTO community_tag (community_id, name) VALUES
                                                   (305, '데이터분석'),
                                                   (305, '하이퍼로컬'),
                                                   (305, 'PM'),
                                                   (305, 'ServicePlanning');

-- 1. 게시글 본문 삽입
INSERT INTO community (
    community_id,
    account_id,
    title,
    content,
    view,
    community_code,
    is_hot,
    created_at
) VALUES (
             306,
             1,
             '팬덤을 만드는 카카오만의 감성 마케팅과 보이스 톤',
             '<em>*"유저의 친한 친구가 되는 법: 카카오프렌즈 IP와 스토리텔링 전략"*</em><br>
             <br>
             💡 <strong>핵심 성과</strong><br>
             <mark>시즌 캠페인 유저 반응률(CTR) 기존 대비 2.5배 증가</mark><br>
             <br>
             ✨ <strong>캠페인 전략</strong><br>
             <strong>캠페인 배경:</strong> ''국민 메신저''라는 인식을 넘어 유저의 취향을 선도하는 플랫폼으로 도약하기 위해, 카카오프렌즈 IP를 활용한 정서적 유대감 형성 프로젝트를 기획하게 되었습니다.<br>
             <br>
             <strong>핵심 전략 내용:</strong><br>
             <ul>
                 <li><strong>보이스 톤 가이드:</strong> 선물하기, 뱅크, 페이 등 각 서비스 성격에 맞게 유저 연령층에 최적화된 친근한 화법과 문체를 정의했습니다.</li>
                 <li><strong>스토리텔링:</strong> 라이언과 춘식이의 일상 서사를 활용한 <u>숏폼 콘텐츠</u>를 기획하여 자연스러운 바이럴을 유도했습니다.</li>
             </ul>
             <figure style="text-align: center; margin: 2rem 0;">
               <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/images/38c37931-19cf-4470-af05-0a3888661015/large.jpg" alt="chunsik" style="width: 398px; height: 398px; display: inline-block;" />
               <figcaption style="text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">춘식이 입니다</figcaption>
             </figure>
             <br>
             <strong>참여형 마케팅:</strong> 유저가 직접 차기 굿즈 제작 결정에 참여하는 ''팬슈머'' 캠페인을 설계하여 소속감을 고취시켰습니다.<br>
             <br>
             <strong>실무 적용 사례:</strong> 시즌별 캠페인 진행 시 <strong>유저 반응률(CTR)이 기존 대비 <mark>2.5배 이상 증가</mark></strong>했으며, SNS 언급량 역시 역대 최고치를 기록하는 성과를 얻었습니다.<br>
             <br>
             📝 <strong>주의사항 및 느낀 점</strong><br>
             <strong>트렌디한 밈(Meme)을 사용할 때는 브랜드의 핵심 가치를 훼손하지 않도록 적정 수위를 유지하는 것이 매우 중요합니다. 마케팅은 단순히 상품의 장점을 나열하는 것이 아니라, 유저가 우리 브랜드의 세계관 안에서 즐겁게 놀 수 있도록 판을 짜는 예술임을 깨달았습니다.</strong>',
             114,
             4,
             true,
             '2026-02-06 11:00:00'
         );

-- 2. 해당 게시글의 태그 삽입
INSERT INTO community_tag (community_id, name) VALUES
                                                   (306, '브랜딩'),
                                                   (306, '콘텐츠전략'),
                                                   (306, '팬덤마케팅'),
                                                   (306, 'GrowthMarketing');

-- 1. 게시글 본문 삽입
INSERT INTO community (
    community_id,
    account_id,
    title,
    content,
    view,
    community_code,
    is_hot,
    created_at
) VALUES (
             307,
             1,
             '제조사를 넘어 모빌리티 플랫폼으로, 현대차의 비즈니스 전환',
             '<strong>[PREMIUM REPORT] 자동차에서 생활 공간으로, SDV(소프트웨어 중심 자동차) 패러다임의 근본적 변화</strong><br>
             <br>
             <em>"자동차는 이제 단순한 이동 수단(Hardware)을 넘어, 소프트웨어로 정의되는 움직이는 거실(Software Defined Vehicle)이 되었습니다."</em><br>
             <br>
             💡 <strong>핵심 성과</strong><br>
             <mark><u>글로벌 모빌리티 트렌드 심층 분석을 통한 차년도 중장기 신사업 로드맵(Roadmap) 수립</u></mark><br>
             <br>
             <figure style="text-align: left; margin: 2rem 0;">
               <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/images/82e7fbf4-75a2-486d-a4c4-b3cef11bec9d/large.jpg" alt="hyundai_sdv" style="width: 289px; height: 307px; display: inline-block;" />
             </figure>
             <br>
             🛣️ <strong>전략적 방향 (Strategic Direction)</strong><br>
             <strong>🔍 분석 배경 (Background Analysis):</strong> 자동차 산업의 핵심 가치가 엔진과 마력에서 <strong>''소프트웨어와 사용자 경험''</strong>으로 전이되고 있습니다. 하드웨어 판매 중심의 일회성 수익 구조를 탈피하여, 차량 전체 생애 주기 동안 가치를 창출하는 <strong>서비스 중심의 구독 모델(Subscription Model)</strong>로의 전환이 <u>필연적 선택</u>임을 데이터로 증명했습니다.<br>
             <br>
             🚀 <strong>주요 전략 상세 내용</strong><br>
             <ul>
                 <li><strong>IVI(In-Vehicle Infotainment) 생태계 구축:</strong> 단순히 음악을 듣는 공간을 넘어 게임, 영화 스트리밍 등 <u>독자적 콘텐츠 구독 서비스</u>의 타당성을 검토했습니다.</li>
                 <li><strong>데이터 기반 신규 비즈니스:</strong> 지능형 정비 모델 및 운전 습관 기반 보험 상품(UBI) 연계 전략을 설계했습니다.</li>
                 <li><strong>라스트 마일(Last-Mile) 통합 연계:</strong> 자율주행 셔틀과 개인용 모빌리티를 잇는 거점 사업 및 <u>통합 결제 시스템</u>을 기획했습니다.</li>
             </ul>
             <br>
             <figure style="text-align: right; margin: 2rem 0;">
               <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/images/2c9e0641-48f7-4c97-b0b2-5a1abda0720d/large.jpg" alt="mobility_strategy" style="width: 324px; height: 324px; display: inline-block;" />
             </figure>
             <br>
             ✅ <strong>실전 활용 및 성과 (Implementation)</strong><br>
             내부 신사업 TF의 로드맵을 수립하여 경영진으로부터 <strong><mark>차년도 중장기 사업 계획의 핵심 KPI이자 지표</mark></strong>로 최종 채택되었습니다.<br>
             <br>
             <figure style="text-align: center; margin: 2rem 0;">
               <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/images/15d022af-d845-4715-933f-a3d267abdf54/large.jpg" alt="future_vision" style="width: auto; height: auto; display: inline-block;" />
               <figcaption style="text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">와우와우와우와우와우와우</figcaption>
             </figure>
             <br>
             🚩 <strong>향후 과제 및 느낀 점 (Future & Vision)</strong><br>
             <small>친환경 에너지 솔루션 V2G 비즈니스 고도화 및 스마트 시티 V2X 전략을 수립할 예정입니다. 미래 이동 수단이 인간의 삶을 혁신하는 과정은 전략가로서 가슴 벅찬 경험이었습니다.</small>',
             110,
             4,
             true,
             '2026-02-06 12:00:00'
         );

-- 2. 해당 게시글의 태그 삽입
INSERT INTO community_tag (community_id, name) VALUES
                                                   (307, '미래전략'),
                                                   (307, '현대자동차'),
                                                   (307, 'BusinessStrategy'),
                                                   (307, 'Mobility'),
                                                   (307, 'SDV');