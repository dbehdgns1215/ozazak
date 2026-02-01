-- ========================================
-- author_status 컬럼 추가 및 기존 데이터 업데이트
-- 생성일: 2026-02-01
-- 설명: 
--   - author_status 컬럼 추가 (varchar, NOT NULL, DEFAULT 'default')
--   - 'default': 취준생/무직자
--   - 'passed': 합격자/재직자
-- ========================================

-- Step 1: author_status 컬럼 추가 (기본값 'default'로 설정)
ALTER TABLE account
ADD COLUMN author_status varchar NOT NULL DEFAULT 'default';

-- Step 2: 기존 데이터에 대해 페르소나별로 status 설정
-- PASSED ('passed'): 경력자, 재직 중 이직 준비, 현직 재직 중인 사람들

-- 경력자 및 재직 중인 유저들을 PASSED로 설정
UPDATE account
SET author_status = 'passed'
WHERE name IN (
    -- 테스트 유저 중 경력자/재직자
    '박민준',      -- 백엔드 경력 3년차
    '정도윤',      -- 풀스택 개발자 5년차
    '한지우',      -- 시니어 개발자 10년차
    '신태양',      -- DevOps 엔지니어 4년차
    '송민석',      -- 클라우드 아키텍트
    '황준서',      -- 리드 개발자 12년차
    
    -- 취준생 유저 중 재직 중 이직 준비자
    '정민지',      -- 현직 재직 중 이직 준비
    '홍지민',      -- 인턴 후 정규직 준비
    '송다은',      -- 프리랜서 → 정규직 지원
    '문태윤'       -- 소규모 스타트업 → 대기업 지원
);

-- DEFAULT ('default'): 나머지 모두 (신입, 취준생, 학생 등)
-- 이미 DEFAULT 'default'로 설정되어 있으므로 별도 작업 불필요

COMMENT ON COLUMN account.author_status IS '작성자 상태: default=취준생/무직자, passed=합격자/재직자';
