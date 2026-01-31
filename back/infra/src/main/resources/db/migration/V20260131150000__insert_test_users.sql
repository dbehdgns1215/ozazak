-- ========================================  
-- 테스트 유저 데이터 삽입
-- 생성일: 2026-01-31
-- 설명: 20명의 다양한 페르소나를 가진 테스트 유저
-- 비밀번호: 모두 'test1234!' (BCrypt 암호화)
-- ========================================

-- 1. 김지훈 - 신입 개발자 지망생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('jihoon.kim@test.com', '$2a$10$7ZXmF5R3L8kQnYW9VxPJ4.KZqH4Lm6Pw3rXcF8YhN5tVzJ9RqLx0S', '김지훈', 'https://i.pravatar.cc/150?img=11', 1, NOW(), NOW(), NULL);

-- 2. 이서연 - 주니어 프론트엔드 개발자
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('seoyeon.lee@test.com', '$2a$10$8AmG6S4M9lRoZpX0WyQK5.LaRi5Nn7Qx4sYdG9ZiO6uWaK0SrMy1T', '이서연', 'https://i.pravatar.cc/150?img=5', 1, NOW(), NOW(), NULL);

-- 3. 박민준 - 백엔드 경력 3년차
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('minjun.park@test.com', '$2a$10$9BnH7T5N0mSpAqY1XzRL6.MbSj6Oo8Ry5tZeH0AjP7vXbL1TsNz2U', '박민준', 'https://i.pravatar.cc/150?img=12', 1, NOW(), NOW(), NULL);

-- 4. 최유진 - 데이터 분석가 전환 희망
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('yujin.choi@test.com', '$2a$10$0CoI8U6O1nTqBrZ2YzSM7.NcTk7Pp9Sz6uAfI1BkQ8wYcM2UtOa3V', '최유진', 'https://i.pravatar.cc/150?img=9', 1, NOW(), NOW(), NULL);

-- 5. 정도윤 - 풀스택 개발자 5년차
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('doyoon.jung@test.com', '$2a$10$1DpJ9V7P2oUrCsA3ZzTN8.OdUl8Qq0Ta7vBgJ2ClR9xZdN3VuPb4W', '정도윤', 'https://i.pravatar.cc/150?img=13', 1, NOW(), NOW(), NULL);

-- 6. 강하은 - UI/UX 디자이너
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('haeun.kang@test.com', '$2a$10$2EqK0W8Q3pVsDtB4A0UO9.PeVm9Rr1Ub8wChK3DmS0aEo4WvQc5X', '강하은', 'https://i.pravatar.cc/150?img=10', 1, NOW(), NOW(), NULL);

-- 7. 윤서준 - 취업 준비 대학생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('seojun.yoon@test.com', '$2a$10$3FrL1X9R4qWtEuC5B1VPO0.QfWn0Ss2Vc9xDiL4EnT1bFp5XwRd6Y', '윤서준', 'https://i.pravatar.cc/150?img=14', 1, NOW(), NOW(), NULL);

-- 8. 임수아 - 마케터에서 PM 전환
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('sua.lim@test.com', '$2a$10$4GsM2Y0S5rXuFvD6C2WQP1.RgXo1Tt3Wd0yEjM5FoU2cGq6YxSe7Z', '임수아', 'https://i.pravatar.cc/150?img=20', 1, NOW(), NOW(), NULL);

-- 9. 한지우 - 시니어 개발자 10년차
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('jiwoo.han@test.com', '$2a$10$5HtN3Z1T6sYvGwE7D3XRQ2.ShYp2Uu4Xe1zFkN6GpV3dHr7ZyTf8A', '한지우', 'https://i.pravatar.cc/150?img=15', 1, NOW(), NOW(), NULL);

-- 10. 서예준 - 스타트업 창업 준비 중
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('yejun.seo@test.com', '$2a$10$6IuO4A2U7tZwHxF8E4YSR3.TiZq3Vv5Yf2aGlO7HqW4eIs8AzUg9B', '서예준', 'https://i.pravatar.cc/150?img=16', 1, NOW(), NOW(), NULL);

-- 11. 조아인 - 신입 QA 엔지니어
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('ain.cho@test.com', '$2a$10$7JvP5B3V8uAwIyG9F5ZTS4.UjAr4Ww6Zg3bHmP8IrX5fJt9BzVh0C', '조아인', 'https://i.pravatar.cc/150?img=23', 1, NOW(), NOW(), NULL);

-- 12. 신태양 - DevOps 엔지니어 4년차
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('taeyang.shin@test.com', '$2a$10$8KwQ6C4W9vBxJzH0G6AUT5.VkBs5Xx7Ah4cInQ9JsY6gKu0CzWi1D', '신태양', 'https://i.pravatar.cc/150?img=17', 1, NOW(), NOW(), NULL);

-- 13. 배수빈 - 보안 전문가 지망생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('subin.bae@test.com', '$2a$10$9LxR7D5X0wCyKaI1H7BVU6.WlCt6Yy8Bi5dJoR0KtZ7hLv1DzXj2E', '배수빈', 'https://i.pravatar.cc/150?img=24', 1, NOW(), NOW(), NULL);

-- 14. 노시현 - 게임 기획자
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('sihyun.noh@test.com', '$2a$10$0MyS8E6Y1xDzLbJ2I8CWV7.XmDu7Zz9Cj6eKpS1LuA8iMw2EzYk3F', '노시현', 'https://i.pravatar.cc/150?img=18', 1, NOW(), NOW(), NULL);

-- 15. 홍다은 - 신입 데이터 사이언티스트
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('daeun.hong@test.com', '$2a$10$1NzT9F7Z2yEaLcK3J9DXW8.YnEv8Aa0Dk7fLqT2MvB9jNx3FaZl4G', '홍다은', 'https://i.pravatar.cc/150?img=25', 1, NOW(), NOW(), NULL);

-- 16. 송민석 - 클라우드 아키텍트
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('minseok.song@test.com', '$2a$10$2OaU0G8A3zFbMdL4K0EYX9.ZoFw9Bb1El8gMrU3NwC0kOy4GbAm5H', '송민석', 'https://i.pravatar.cc/150?img=19', 1, NOW(), NOW(), NULL);

-- 17. 문채원 - AI 연구원 희망
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('chaewon.moon@test.com', '$2a$10$3PbV1H9B4aGcNeM5L1FZY0.ApGx0Cc2Fm9hNsV4OxD1lPz5HcBn6I', '문채원', 'https://i.pravatar.cc/150?img=26', 1, NOW(), NOW(), NULL);

-- 18. 안지훈 - 모바일 앱 개발자
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('jihoon.ahn@test.com', '$2a$10$4QcW2I0C5bHdOfN6M2GAZ1.BqHy1Dd3Gn0iOtW5PyE2mQa6IdCo7J', '안지훈', 'https://i.pravatar.cc/150?img=21', 1, NOW(), NOW(), NULL);

-- 19. 오서윤 - 블록체인 개발자
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('seoyun.oh@test.com', '$2a$10$5RdX3J1D6cIeaPg7N3HBA2.CrIz2Ee4Ho1jPuX6QzF3nRb7JeDp8K', '오서윤', 'https://i.pravatar.cc/150?img=27', 1, NOW(), NOW(), NULL);

-- 20. 황준서 - 리드 개발자 12년차
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('junseo.hwang@test.com', '$2a$10$6SeY4K2E7dJfBqh8O4ICB3.DsJa3Ff5Ip2kQvY7RaG4oSc8KfEq9L', '황준서', 'https://i.pravatar.cc/150?img=22', 1, NOW(), NOW(), NULL);
