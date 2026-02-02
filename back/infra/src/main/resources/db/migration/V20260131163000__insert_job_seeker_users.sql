-- ========================================
-- 취준생 유저 데이터 삽입
-- 생성일: 2026-01-31
-- 설명: 20명의 취준생 페르소나
-- 비밀번호: 모두 'test1234!' (BCrypt 암호화)
-- ========================================

-- 30. 이준혁 - 컴공 4학년 (졸업 프로젝트 진행 중)
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('junhyuk.lee@test.com', '$2a$10$7AgN8S5P4qXtKbZ3C4DYZ0.RgYq5Aa1Qd9yFiM8OyF4kQz7MvNc8L', '이준혁', 'https://i.pravatar.cc/150?img=31', 1, NOW(), NOW(), NULL);

-- 31. 박서영 - 싸피 수료생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('seoyoung.park@test.com', '$2a$10$8BhO9T6Q5rYuLcA4D5EZA1.ShZr6Bb2Re0zGjN9PzG5lRa8NwOd9M', '박서영', 'https://i.pravatar.cc/150?img=32', 1, NOW(), NOW(), NULL);

-- 32. 김도현 - 비전공자 국비교육 수료
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('dohyun.kim@test.com', '$2a$10$9CiP0U7R6sZvMdB5E6FAB2.TiAs7Cc3Sf1aHkO0QaH6mSb9OwPe0N', '김도현', 'https://i.pravatar.cc/150?img=33', 1, NOW(), NOW(), NULL);

-- 33. 정민지 - 현직 재직 중 이직 준비
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('minji.jung@test.com', '$2a$10$0DjQ1V8S7tAwNeC6F7GBC3.UjBt8Dd4Tg2bIlP1RbI7nTc0PxQf1O', '정민지', 'https://i.pravatar.cc/150?img=34', 1, NOW(), NOW(), NULL);

-- 34. 최우진 - 해외 석사 졸업 후 귀국
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('woojin.choi@test.com', '$2a$10$1EkR2W9T8uBxOfD7G8HCD4.VkCu9Ee5Uh3cJmQ2ScJ8oUd1QyRg2P', '최우진', 'https://i.pravatar.cc/150?img=35', 1, NOW(), NOW(), NULL);

-- 35. 강예은 - 싸피 수료생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('yeeun.kang@test.com', '$2a$10$2FlS3X0U9vCyPgE8H9IDE5.WlDv0Ff6Vi4dKnR3TdK9pVe2RzSh3Q', '강예은', 'https://i.pravatar.cc/150?img=36', 1, NOW(), NOW(), NULL);

-- 36. 윤재민 - GitHub 오픈소스 기여자
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('jaemin.yoon@test.com', '$2a$10$3GmT4Y1V0wDzQhF9I0JEF6.XmEw1Gg7Wj5eLsS4UeL0qWf3SaTi4R', '윤재민', 'https://i.pravatar.cc/150?img=37', 1, NOW(), NOW(), NULL);

-- 37. 서한별 - 알고리즘 대회 참가자
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('hanbyul.seo@test.com', '$2a$10$4HnU5Z2W1xEaRiG0J1KFG7.YnFx2Hh8Xk6fMtT5VfM1rXg4TbUj5S', '서한별', 'https://i.pravatar.cc/150?img=38', 1, NOW(), NOW(), NULL);

-- 38. 임지호 - 디자인 전공 → 프론트엔드 전환
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('jiho.lim@test.com', '$2a$10$5IoV6A3X2yFbSjH1K2LGH8.ZoGy3Ii9Yl7gNuU6WgN2sYh5UcVk6T', '임지호', 'https://i.pravatar.cc/150?img=39', 1, NOW(), NOW(), NULL);

-- 39. 한소율 - 마케팅 → IT 기획자 전환
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('soyul.han@test.com', '$2a$10$6JpW7B4Y3zGcTkI2L3MHI9.ApHz4Jj0Zm8hOvV7XhO3tZi6VdWl7U', '한소율', 'https://i.pravatar.cc/150?img=40', 1, NOW(), NOW(), NULL);

-- 40. 조민성 - N수생 (여러 번 도전)
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('minsung.cho@test.com', '$2a$10$7KqX8C5Z4aHdUlJ3M4NI J0.BqIa5Kk1An9iPwW8YiP4uAj7WeXm8V', '조민성', 'https://i.pravatar.cc/150?img=41', 1, NOW(), NOW(), NULL);

-- 41. 신유나 - 부트캠프 재수강
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('yuna.shin@test.com', '$2a$10$8LrY9D6A5bIeVmK4N5OJK1.CrJb6Ll2Bo0jQxX9ZjQ5vBk8XfYn9W', '신유나', 'https://i.pravatar.cc/150?img=42', 1, NOW(), NOW(), NULL);

-- 42. 백승환 - 대학원생 (연구+취업 병행)
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('seunghwan.baek@test.com', '$2a$10$9MsZ0E7B6cJfWnL5O6PKL2.DsKc7Mm3Cp1kRyY0AkR6wCl9YgZo0X', '백승환', 'https://i.pravatar.cc/150?img=43', 1, NOW(), NOW(), NULL);

-- 43. 노현우 - 전역 후 취업 준비
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('hyunwoo.noh@test.com', '$2a$10$0NtA1F8C7dKgXoM6P7QLM3.EtLd8Nn4Dq2lSzZ1BlS7xDm0ZhAp1Y', '노현우', 'https://i.pravatar.cc/150?img=44', 1, NOW(), NOW(), NULL);

-- 44. 홍지민 - 인턴 후 정규직 준비
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('jimin.hong@test.com', '$2a$10$1OuB2G9D8eLhYpN7Q8RMN4.FuMe9Oo5Er3mTaA2CmT8yEn1AiBq2Z', '홍지민', 'https://i.pravatar.cc/150?img=45', 1, NOW(), NOW(), NULL);

-- 45. 송다은 - 프리랜서 → 정규직 지원
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('daeun.song@test.com', '$2a$10$2PvC3H0E9fMiZqO8R9SNO5.GvNf0Pp6Fs4nUbB3DnU9zFo2BjCr3A', '송다은', 'https://i.pravatar.cc/150?img=46', 1, NOW(), NOW(), NULL);

-- 46. 문태윤 - 소규모 스타트업 → 대기업 지원
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('taeyoon.moon@test.com', '$2a$10$3QwD4I1F0gNjArP9S0TOP6.HwOg1Qq7Gt5oVcC4EoV0aGp3CkDs4B', '문태윤', 'https://i.pravatar.cc/150?img=47', 1, NOW(), NOW(), NULL);

-- 47. 안서준 - 게임 개발자 준비생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('seojun.ahn@test.com', '$2a$10$4RxE5J2G1hOkBsQ0T1UPQ7.IxPh2Rr8Hu6pWdD5FpW1bHq4DlEt5C', '안서준', 'https://i.pravatar.cc/150?img=48', 1, NOW(), NOW(), NULL);

-- 48. 오채원 - AI/ML 공부 중
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('chaewon.oh@test.com', '$2a$10$5SyF6K3H2iPl CtR1U2VQR8.JyQi3Ss9Iv7qXeE6GqX2cIr5EmFu6D', '오채원', 'https://i.pravatar.cc/150?img=49', 1, NOW(), NOW(), NULL);

-- 49. 황시우 - 풀스택 웹 개발 준비생
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at, company_id)
VALUES ('siwoo.hwang@test.com', '$2a$10$6TzG7L4I3jQmDuS2V3WRR9.KzRj4Tt0Jw8rYfF7HrY3dJs6FnGv7E', '황시우', 'https://i.pravatar.cc/150?img=50', 1, NOW(), NOW(), NULL);
