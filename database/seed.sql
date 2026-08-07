-- Initial demo data

INSERT INTO roles(name, permissions)
VALUES
('admin','all'),
('consultant','records,clients'),
('user','booking')
ON CONFLICT(name) DO NOTHING;

INSERT INTO users(username,password_hash,name,role)
VALUES
('admin','demo_hash','管理员','admin'),
('consultant','demo_hash','咨询师','consultant')
ON CONFLICT(username) DO NOTHING;
