-- Add job_type column to recruitment table
ALTER TABLE recruitment ADD COLUMN job_type INT;

COMMENT ON COLUMN recruitment.job_type IS '고용 형태: 0=정규직, 1=계약직, 2=인턴, 3=파견직, 4=프리랜서';
