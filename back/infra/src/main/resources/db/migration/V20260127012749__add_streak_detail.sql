DROP TABLE IF EXISTS streak CASCADE;
DROP TABLE IF EXISTS streak_status CASCADE;

-- 일일 스트릭 기록 테이블
CREATE TABLE streak (
    account_id bigint NOT NULL,
    activity_date date NOT NULL,
    daily_count int NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, activity_date),
    FOREIGN KEY (account_id) REFERENCES account (account_id)
);

COMMENT ON TABLE streak IS '사용자 일일 스트릭 기록';
COMMENT ON COLUMN streak.account_id IS '사용자 ID';
COMMENT ON COLUMN streak.activity_date IS '활동 날짜';
COMMENT ON COLUMN streak.daily_count IS '해당 날짜 활동 횟수';
COMMENT ON COLUMN streak.created_at IS '기록 생성 시간';

CREATE INDEX idx_streak_account_date ON streak(account_id, activity_date DESC);

-- 스트릭 상태 요약 테이블 (빠른 조회용)
CREATE TABLE streak_status (
    account_id bigint PRIMARY KEY,
    current_streak int NOT NULL DEFAULT 0,
    longest_streak int NOT NULL DEFAULT 0,
    last_activity_date date,
    FOREIGN KEY (account_id) REFERENCES account (account_id)
);

COMMENT ON TABLE streak_status IS '사용자 스트릭 상태 요약';
COMMENT ON COLUMN streak_status.account_id IS '사용자 ID';
COMMENT ON COLUMN streak_status.current_streak IS '현재 연속 스트릭 수';
COMMENT ON COLUMN streak_status.longest_streak IS '최장 연속 스트릭 수';
COMMENT ON COLUMN streak_status.last_activity_date IS '마지막 활동 날짜';