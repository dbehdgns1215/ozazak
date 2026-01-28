-- Add admin account for testing and QA
INSERT INTO account (email, password, name, img, role_code, created_at, updated_at)
VALUES (
    'admin1@ssafy.com',
    '$2a$10$Sq8tVMrnGcHSuOsjYB116.4sJzz0oyma8xFdcxOr28BZwCNmWg17C',
    '어드민',
    'default_img.png',
    2,
    NOW(),
    NOW()
);
