-- Change started_at and ended_at columns to timestamp to support time components
ALTER TABLE recruitment ALTER COLUMN started_at TYPE timestamp USING started_at::timestamp;
ALTER TABLE recruitment ALTER COLUMN ended_at TYPE timestamp USING ended_at::timestamp;
