-- 1. 제약조건이 존재할 때만 삭제 (에러 방지)
ALTER TABLE question
DROP CONSTRAINT IF EXISTS "fk4vtwc4kyq75jy9thxk2wm4iia";

-- 2. CASCADE 옵션으로 다시 생성
ALTER TABLE question
    ADD CONSTRAINT "fk4vtwc4kyq75jy9thxk2wm4iia"
        FOREIGN KEY (recruitment_id)
            REFERENCES recruitment(recruitment_id)
            ON DELETE CASCADE;

-- 3. 데이터 삭제
DELETE FROM recruitment
WHERE position IS NULL OR category_id IS NULL;

-- 4. CASCADE 제약조건 다시 삭제
ALTER TABLE question
DROP CONSTRAINT IF EXISTS "fk4vtwc4kyq75jy9thxk2wm4iia";

-- 5. 원래대로(일반) 제약조건 복구
ALTER TABLE question
    ADD CONSTRAINT "fk4vtwc4kyq75jy9thxk2wm4iia"
        FOREIGN KEY (recruitment_id)
            REFERENCES recruitment(recruitment_id);