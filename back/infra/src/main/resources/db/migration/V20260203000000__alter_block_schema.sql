-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Alter block table schema
-- 1. Drop existing bytea vector column and recreate as vector(1536)
-- 2. Add source tracking columns
ALTER TABLE block
    DROP COLUMN IF EXISTS vector,
    ADD COLUMN vector vector(1536),
    ADD COLUMN source_type varchar(50),
    ADD COLUMN source_title varchar(255);  -- 출처 제목 (프로젝트명, TIL 제목 등)

-- Add index for vector similarity search
CREATE INDEX IF NOT EXISTS block_vector_idx ON block USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);

-- Add index for source lookup
CREATE INDEX IF NOT EXISTS block_source_idx ON block(account_id, source_type) WHERE deleted_at IS NULL;
