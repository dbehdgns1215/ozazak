-- ========================================
-- 새 TIL 게시글 작성 (이미지 포함)
-- 생성일: 2026-02-03
-- 작업내용: community_code=1, account_id=1, 이미지 2장 포함한 새 글 삽입
-- ========================================

INSERT INTO community (account_id, title, content, view, community_code, is_hot, created_at, updated_at, deleted_at)
VALUES (
    1,                                  -- account_id
    '이미지 테스트용 게시글입니다',           -- title
    '# 이미지 업로드 테스트

새로운 글을 작성하여 이미지가 잘 나오는지 테스트합니다.

## 이미지 첨부

아래는 테스트용 랜덤 이미지입니다.

![랜덤 이미지 1](https://picsum.photos/400/300)

<br>

![랜덤 이미지 2](https://picsum.photos/400/300)

## 테스트 내용

- 커뮤니티 코드: 1
- 작성일: 2026-02-03 17:06:00
- 작성자: 1번 유저

끝.',                                  -- content
    0,                                  -- view
    1,                                  -- community_code (User requested 1)
    FALSE,                              -- is_hot
    '2026-02-03 17:06:00',              -- created_at
    NULL,                               -- updated_at
    NULL                                -- deleted_at
);
