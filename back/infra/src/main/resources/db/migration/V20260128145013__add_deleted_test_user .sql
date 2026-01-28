INSERT INTO account (email, password, name, img, role_code, deleted_at, created_at, updated_at)
VALUES (
            'deletedUser1@ssafy.com',
            '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
            '김탈퇴',
            'default_img.png',
            1,
            null,
            NOW() - INTERVAL '30 days',
            NOW()
       );

INSERT INTO account (email, password, name, img, role_code, deleted_at, created_at, updated_at)
VALUES (
           'deletedUser2@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '최탈퇴',
           'default_img.png',
           1,
           null,
           NOW() - INTERVAL '30 days',
           NOW()
       );

INSERT INTO account (email, password, name, img, role_code, deleted_at, created_at, updated_at)
VALUES (
           'deletedUser3@ssafy.com',
           '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
           '왕탈퇴',
           'default_img.png',
           1,
           null,
           NOW() - INTERVAL '30 days',
           NOW()
       );