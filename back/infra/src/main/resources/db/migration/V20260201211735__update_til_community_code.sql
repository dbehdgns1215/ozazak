-- ========================================
-- TIL community_code 수정: 0 -> 1
-- 생성일: 2026-02-01
-- 설명: 애플리케이션 코드와 데이터베이스 일치시키기
--       기존 TIL 데이터의 community_code를 0에서 1로 변경
-- ========================================

UPDATE community
SET community_code = 1
WHERE community_code = 0;
