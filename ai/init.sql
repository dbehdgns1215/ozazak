-- Fixed DDL: PK=bigserial, FK=bigint

CREATE TABLE account (
    account_id bigserial NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    img varchar(255) NOT NULL,
    role_code int NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    deleted_at timestamp,
    company_id bigint,
    PRIMARY KEY (account_id)
);

COMMENT ON COLUMN account.company_id IS 'nullable_pk';

CREATE TABLE activity (
    activity_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    title varchar,
    code int,
    rank_name varchar,
    organization varchar,
    awarded_at date,
    PRIMARY KEY (activity_id)
);

COMMENT ON TABLE activity IS '수상/자격증';

COMMENT ON COLUMN activity.code IS '수상/자격증';

CREATE TABLE block (
    block_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    title varchar,
    content text,
    vector bytea, -- Assumed bytea for vector, or generic specific type if extension enabled, usage implies undefined in prompt
    deleted_at timestamp,
    PRIMARY KEY (block_id)
);

CREATE TABLE block_category (
    block_id bigint NOT NULL,
    code int NOT NULL
);

COMMENT ON COLUMN block_category.code IS '다른 곳에 정리';

CREATE TABLE bookmark (
    account_id bigint NOT NULL,
    recruitment_id bigint NOT NULL,
    created_at timestamp NOT NULL
);

CREATE TABLE comment (
    comment_id bigserial NOT NULL,
    community_id bigint NOT NULL,
    account_id bigint NOT NULL,
    content text NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp,
    deleted_at timestamp,
    PRIMARY KEY (comment_id)
);

COMMENT ON TABLE comment IS '댓글';

CREATE TABLE community (
    community_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    title varchar,
    content text,
    view int,
    community_code int,
    is_hot boolean,
    created_at timestamp NOT NULL,
    updated_at timestamp,
    deleted_at timestamp,
    PRIMARY KEY (community_id)
);

COMMENT ON COLUMN community.account_id IS '작성자';

CREATE TABLE community_tag (
    community_id bigint NOT NULL,
    name varchar
);

COMMENT ON TABLE community_tag IS 'til 에서 사용하는 태그';

CREATE TABLE company (
    company_id bigserial NOT NULL,
    name varchar,
    img varchar,
    location varchar,
    PRIMARY KEY (company_id)
);

CREATE TABLE coverletter (
    coverletter_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    recruitment_id bigint NOT NULL,
    title varchar,
    is_complete boolean,
    is_passed boolean,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp,
    PRIMARY KEY (coverletter_id)
);

COMMENT ON TABLE coverletter IS '자소서';

CREATE TABLE essay (
    essay_id bigserial NOT NULL,
    coverletter_id bigint NOT NULL,
    question_id bigint NOT NULL,
    content text NOT NULL,
    version int NOT NULL,
    version_title varchar NOT NULL,
    is_current boolean,
    deleted_at timestamp,
    PRIMARY KEY (essay_id)
);

COMMENT ON TABLE essay IS '문항별 내용 및 버전';

CREATE TABLE follow (
    follower_id bigint NOT NULL,
    followee_id bigint NOT NULL
);

COMMENT ON TABLE follow IS '팔로우 관계';

COMMENT ON COLUMN follow.follower_id IS '팔로우를 건 사람';

COMMENT ON COLUMN follow.followee_id IS '팔로우를 받은 사람';

CREATE TABLE project (
    project_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    title varchar,
    content text,
    image text,
    started_at date,
    ended_at date,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp,
    PRIMARY KEY (project_id)
);

COMMENT ON TABLE project IS '프로젝트';

CREATE TABLE project_tag (
    project_id bigint NOT NULL,
    name varchar
);

COMMENT ON TABLE project_tag IS '프로젝트에서 사용하는 태그';

CREATE TABLE question (
    question_id bigserial NOT NULL,
    recruitment_id bigint,
    content text,
    order_val int, -- 'order' is reserved keyword
    char_max int,
    PRIMARY KEY (question_id)
);

COMMENT ON COLUMN question.recruitment_id IS 'nullable_fk';

CREATE TABLE reaction (
    community_id bigint NOT NULL,
    account_id bigint NOT NULL,
    code int
);

COMMENT ON TABLE reaction IS '리액션';

COMMENT ON COLUMN reaction.account_id IS '사용자';

CREATE TABLE recruitment (
    recruitment_id bigserial NOT NULL,
    company_id bigint NOT NULL,
    title varchar(255),
    content text,
    started_at date,
    ended_at date,
    apply_url varchar,
    created_at timestamp NOT NULL,
    PRIMARY KEY (recruitment_id)
);

COMMENT ON TABLE recruitment IS '미정. 추가 될 수 있음';

CREATE TABLE resume (
    resume_id bigserial NOT NULL,
    account_id bigint NOT NULL,
    title varchar NOT NULL,
    content varchar,
    started_at date,
    ended_at date,
    PRIMARY KEY (resume_id)
);

COMMENT ON TABLE resume IS '이력';

CREATE TABLE streak (
    account_id bigint NOT NULL,
    cnt int NOT NULL,
    updated_at timestamp NOT NULL
);

-- Foreign Keys

ALTER TABLE streak
ADD CONSTRAINT FK_account_TO_streak FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE recruitment
ADD CONSTRAINT FK_company_TO_recruitment FOREIGN KEY (company_id) REFERENCES company (company_id);

ALTER TABLE bookmark
ADD CONSTRAINT FK_account_TO_bookmark FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE bookmark
ADD CONSTRAINT FK_recruitment_TO_bookmark FOREIGN KEY (recruitment_id) REFERENCES recruitment (recruitment_id);

ALTER TABLE resume
ADD CONSTRAINT FK_account_TO_resume FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE block_category
ADD CONSTRAINT FK_block_TO_block_category FOREIGN KEY (block_id) REFERENCES block (block_id);

ALTER TABLE coverletter
ADD CONSTRAINT FK_account_TO_coverletter FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE coverletter
ADD CONSTRAINT FK_recruitment_TO_coverletter FOREIGN KEY (recruitment_id) REFERENCES recruitment (recruitment_id);

ALTER TABLE essay
ADD CONSTRAINT FK_coverletter_TO_essay FOREIGN KEY (coverletter_id) REFERENCES coverletter (coverletter_id);

ALTER TABLE essay
ADD CONSTRAINT FK_question_TO_essay FOREIGN KEY (question_id) REFERENCES question (question_id);

ALTER TABLE block
ADD CONSTRAINT FK_account_TO_block FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE community
ADD CONSTRAINT FK_account_TO_community FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE community_tag
ADD CONSTRAINT FK_community_TO_community_tag FOREIGN KEY (community_id) REFERENCES community (community_id);

ALTER TABLE reaction
ADD CONSTRAINT FK_community_TO_reaction FOREIGN KEY (community_id) REFERENCES community (community_id);

ALTER TABLE comment
ADD CONSTRAINT FK_community_TO_comment FOREIGN KEY (community_id) REFERENCES community (community_id);

ALTER TABLE reaction
ADD CONSTRAINT FK_account_TO_reaction FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE comment
ADD CONSTRAINT FK_account_TO_comment FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE follow
ADD CONSTRAINT FK_account_TO_follow FOREIGN KEY (followee_id) REFERENCES account (account_id);

ALTER TABLE follow
ADD CONSTRAINT FK_account_TO_follow1 FOREIGN KEY (follower_id) REFERENCES account (account_id);

ALTER TABLE project
ADD CONSTRAINT FK_account_TO_project FOREIGN KEY (account_id) REFERENCES account (account_id);

ALTER TABLE project_tag
ADD CONSTRAINT FK_project_TO_project_tag FOREIGN KEY (project_id) REFERENCES project (project_id);

ALTER TABLE activity
ADD CONSTRAINT FK_account_TO_activity FOREIGN KEY (account_id) REFERENCES account (account_id);