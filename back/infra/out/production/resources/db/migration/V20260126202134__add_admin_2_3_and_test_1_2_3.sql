-- Add admin account for testing and QA
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at)
VALUES (
           'admin2@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '어드민2',
           'default_img.png',
           2,
           NOW(),
           NOW()
       );

INSERT INTO account (email, password, name, img, role_code, created_at, updated_at)
VALUES (
           'admin3@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '어드민3',
           'default_img.png',
           2,
           NOW(),
           NOW()
       );

INSERT INTO account (email, password, name, img, role_code, created_at, updated_at)
VALUES (
           'test1@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '홍길동',
           'default_img.png',
           2,
           NOW(),
           NOW()
       );


INSERT INTO account (email, password, name, img, role_code, created_at, updated_at)
VALUES (
           'test2@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '김길동',
           'default_img.png',
           2,
           NOW(),
           NOW()
       );

INSERT INTO account (email, password, name, img, role_code, created_at, updated_at)
VALUES (
           'test3@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '최길동',
           'default_img.png',
           2,
           NOW(),
           NOW()
       );