-- ========================================
-- 테스트 유저(페르소나 40명) 데이터 일괄 업데이트
-- 생성일: 2026-02-03
-- 작업내용: 
-- 1. 이메일 도메인 변경 (@test.com -> @ssafy.com)
-- 2. 비밀번호 초기화 ('test1234!' -> Bcrypt 해시 적용)
-- 대상: '이름.성@test.com' 형식을 가진 유저들 (admin, test1 등 제외)
-- ========================================

UPDATE account
SET 
    -- 1. 이메일 도메인 변경
    email = REPLACE(email, '@test.com', '@ssafy.com'),
    
    -- 2. 비밀번호 변경 (test1234! 의 해시값)
    password = '$2b$12$g9TR.DajwTm8cjJtYsgtr.oLtDVpv2MLrZ8kLdORNcQTvuDGdn9fO',
    
    updated_at = NOW()
WHERE 
    email LIKE '%@test.com'
    AND email LIKE '%.%'; -- admin@test.com, test1@test.com 등 제외하고 "이름.성" 패턴만 대상
