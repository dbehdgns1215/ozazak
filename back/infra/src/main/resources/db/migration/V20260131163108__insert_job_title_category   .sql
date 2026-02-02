DO $$
DECLARE
_main_id INT;
    _sub_id INT;
BEGIN
    -------------------------------------------------------
    -- 1. 경영·사무
    -------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('경영·사무', NULL) RETURNING id INTO _main_id;

-- 기획·전략·경영
INSERT INTO category (name, parent_id) VALUES ('기획·전략·경영', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('경영기획', _sub_id), ('사업기획', _sub_id), ('경영전략', _sub_id), ('경영분석·컨설턴트', _sub_id), ('기타', _sub_id);

-- 인사·노무·교육
INSERT INTO category (name, parent_id) VALUES ('인사·노무·교육', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('인사', _sub_id), ('노무', _sub_id), ('교육', _sub_id), ('채용', _sub_id), ('급여', _sub_id), ('보상관리', _sub_id), ('기타', _sub_id);

-- 재무·세무·IR
INSERT INTO category (name, parent_id) VALUES ('재무·세무·IR', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('재무', _sub_id), ('세무', _sub_id), ('IR', _sub_id), ('자금', _sub_id), ('기타', _sub_id);

-- 경리·회계·결산
INSERT INTO category (name, parent_id) VALUES ('경리·회계·결산', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('경리', _sub_id), ('회계', _sub_id), ('결산', _sub_id);

-- 일반사무·총무·비서
INSERT INTO category (name, parent_id) VALUES ('일반사무·총무·비서', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('일반사무', _sub_id), ('총무', _sub_id), ('비서', _sub_id), ('사무보조', _sub_id), ('기타', _sub_id);

-- 법무
INSERT INTO category (name, parent_id) VALUES ('법무', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('법무', _sub_id);

-------------------------------------------------------
-- 2. 마케팅·광고·홍보
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('마케팅·광고·홍보', NULL) RETURNING id INTO _main_id;

-- 마케팅
INSERT INTO category (name, parent_id) VALUES ('마케팅', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('브랜드마케팅', _sub_id), ('콘텐츠마케팅', _sub_id), ('퍼포먼스·온라인마케팅', _sub_id), ('마케팅전략·기획', _sub_id), ('상품기획', _sub_id), ('기타', _sub_id);

-- 광고·홍보
INSERT INTO category (name, parent_id) VALUES ('광고·홍보', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('광고기획·AE', _sub_id), ('광고제작·카피', _sub_id), ('언론홍보·PR', _sub_id), ('사내홍보', _sub_id), ('기타', _sub_id);

-------------------------------------------------------
-- 3. 무역·유통
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('무역·유통', NULL) RETURNING id INTO _main_id;

-- 유통·물류·재고
INSERT INTO category (name, parent_id) VALUES ('유통·물류·재고', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('물류관리·기획', _sub_id), ('유통관리·기획', _sub_id), ('재고', _sub_id), ('기타', _sub_id);

-- 무역·해외영업
INSERT INTO category (name, parent_id) VALUES ('무역·해외영업', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('해외영업', _sub_id), ('무역·수출입관리', _sub_id), ('기타', _sub_id);

-- 구매·자재
INSERT INTO category (name, parent_id) VALUES ('구매·자재', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('구매', _sub_id), ('자재', _sub_id), ('기타', _sub_id);

-- 운전·운송
INSERT INTO category (name, parent_id) VALUES ('운전·운송', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('운전', _sub_id), ('운송', _sub_id);

-- 상품기획·MD
INSERT INTO category (name, parent_id) VALUES ('상품기획·MD', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('상품기획·MD', _sub_id);

-------------------------------------------------------
-- 4. IT
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('IT', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('QA', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('QA', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('앱개발', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('IOS개발', _sub_id), ('안드로이드개발', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('웹개발', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('프론트엔드개발', _sub_id), ('서버·백엔드개발', _sub_id), ('HTML·퍼블리싱', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('데이터엔지니어·분석·DBA', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('데이터엔지니어', _sub_id), ('데이터분석', _sub_id), ('DBA', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('시스템프로그래머', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('시스템프로그래머', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('응용프로그래머', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('응용프로그래머', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('네트워크·보안·운영', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('네트워크·보안·운영', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('빅데이터·AI', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('빅데이터·AI', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('HW·임베디드', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('HW·임베디드', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('SW·솔루션·ERP', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('SW·솔루션·ERP', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('서비스기획·PM', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('서비스기획·PM', _sub_id);

-------------------------------------------------------
-- 5. 생산·제조
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('생산·제조', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('생산관리·공정관리·품질관리', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('생산관리', _sub_id), ('공정관리', _sub_id), ('품질관리', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('안전·환경관리', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('안전관리', _sub_id), ('환경관리', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('생산·제조·설비·조립', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('생산·제조·설비·조립', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('설치·정비·AS·시공·공무', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('설치·정비·AS·시공·공무', _sub_id);

-------------------------------------------------------
-- 6. 영업·고객상담
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('영업·고객상담', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('제품·서비스영업', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('제품·서비스영업', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('IT·솔루션·기술영업', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('IT·솔루션·기술영업', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('B2B영업·법인영업', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('B2B영업·법인영업', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('영업관리·지원·기획', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('영업관리·지원·기획', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('아웃바운드', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('아웃바운드', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('인바운드', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('인바운드', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('고객응대·CS', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('고객응대·CS', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('금융·보험영업', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('금융·보험영업', _sub_id);

-------------------------------------------------------
-- 7. 건설
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('건설', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('현장·시공·감리·공무', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('현장·시공·감리·공무', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('안전·품질·관리', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('안전·품질·관리', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('전기·통신', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('전기·통신', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('기계·설비·화학', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('기계·설비·화학', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('토목·조경·도시', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('토목·조경·도시', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('건축·설계·인테리어', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('건축·설계·인테리어', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('환경·플랜트', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('환경·플랜트', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('부동산·영업·견적', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('부동산·영업·견적', _sub_id);

-------------------------------------------------------
-- 8. 금융
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('금융', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('증권·투자', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('증권·투자', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('외환·펀드·자산운용', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('외환·펀드·자산운용', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('보험계리사·손해사정', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('보험계리사·손해사정', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('채권·심사', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('채권·심사', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('은행원', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('은행원', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('애널리스트', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('애널리스트', _sub_id);

-------------------------------------------------------
-- 9. 연구개발·설계
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('연구개발·설계', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('자동차·기계', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('자동차', _sub_id), ('기계', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('화학·에너지·환경', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('화학', _sub_id), ('에너지', _sub_id), ('환경', _sub_id), ('화장품', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('바이오·제약·식품', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('바이오·제약', _sub_id), ('식품', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('기계설계·CAD·CAM', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('기계설계·CAD·CAM', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('전기·전자·제어', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('전기·전자·제어', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('반도체·디스플레이', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('반도체·디스플레이', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('통신기술·네트워크 구축', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('통신기술·네트워크 구축', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('금속·철강', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('금속·철강', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('조선·항공·우주', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('조선·항공·우주', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('인문·사회과학', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('인문·사회과학', _sub_id);

-------------------------------------------------------
-- 10. 디자인
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('디자인', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('광고·시각디자인', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('광고 디자인', _sub_id), ('그래픽디자인·CG', _sub_id), ('출판·편집디자인', _sub_id), ('캐릭터', _sub_id), ('애니메이션', _sub_id), ('기타', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('제품·산업디자인', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('제품·산업디자인', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('건축·인테리어디자인', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('건축·인테리어디자인', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('의류·패션·잡화디자인', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('의류·패션·잡화디자인', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('UI·UX디자인', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('UI·UX디자인', _sub_id);

-------------------------------------------------------
-- 11. 미디어
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('미디어', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('연출·제작·PD·작가', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('연출·제작·PD·작가', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('음악·영상·사진', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('음악·영상·사진', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('아나운서·리포터·성우·기자', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('아나운서·리포터·성우·기자', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('무대·스탭·오퍼레이터', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('무대·스탭·오퍼레이터', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('연예·엔터테이먼트', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('연예·엔터테이먼트', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('인쇄·출판·편집', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('인쇄·출판·편집', _sub_id);

-------------------------------------------------------
-- 12. 전문·특수직
-------------------------------------------------------
INSERT INTO category (name, parent_id) VALUES ('전문·특수직', NULL) RETURNING id INTO _main_id;

INSERT INTO category (name, parent_id) VALUES ('리서치·시장조사', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('리서치·시장조사', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('외국어·번역·통역', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('외국어·번역·통역', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('법률·특허·상표', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('법률·특허·상표', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('회계·세무·CPA·CFA', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('회계·세무·CPA·CFA', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('보안·경비·경호', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('보안·경비·경호', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('보건·의료', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('보건·의료', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('초·중·고 교사', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('초·중·고 교사', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('교육개발·기획', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('교육개발·기획', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('외국어·자격증·기술강사', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('외국어·자격증·기술강사', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('사회복지·요양보호·자원봉사', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('사회복지·요양보호·자원봉사', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('승무원·숙박·여행 서비스', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('승무원·숙박·여행 서비스', _sub_id);

INSERT INTO category (name, parent_id) VALUES ('음식서비스', _main_id) RETURNING id INTO _sub_id;
INSERT INTO category (name, parent_id) VALUES ('음식서비스', _sub_id);

END $$;