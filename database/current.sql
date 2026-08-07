-- =====================================================
-- 摆渡心理 V9.0
-- database/current.sql
-- 当前稳定版 D1 数据结构备份
-- Cloudflare D1 / SQLite
-- =====================================================


PRAGMA foreign_keys = ON;


-- =====================================================
-- 管理员表
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role TEXT DEFAULT 'admin',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



-- =====================================================
-- 咨询师用户表
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    username TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role TEXT DEFAULT 'consultant',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



-- =====================================================
-- 预约表（当前线上使用）
-- =====================================================

CREATE TABLE IF NOT EXISTS appointments (

    id INTEGER PRIMARY KEY AUTOINCREMENT,


    -- 客户姓名

    name TEXT NOT NULL,


    -- 电话

    phone TEXT,


    -- 咨询类型

    type TEXT,


    -- 预约时间

    appointment_time TEXT,


    -- 客户留言

    message TEXT,


    -- 创建时间

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    -- 微信号

    wechat TEXT,


    -- 预约状态

    status TEXT DEFAULT '待处理',


    -- 分配咨询师

    consultant TEXT

);



-- =====================================================
-- 初始化管理员
-- 如果已经存在不会重复创建
-- =====================================================

INSERT OR IGNORE INTO admins
(
username,
password,
role
)

VALUES

(
'admin',
'123456',
'admin'
);



-- =====================================================
-- 初始化咨询师
-- 当前项目使用：涂老师
-- =====================================================

INSERT OR IGNORE INTO users
(
name,
username,
password,
role
)

VALUES

(
'涂老师',
'consultant1',
'123456',
'consultant'
);



-- =====================================================
-- 检查索引
-- 提升查询速度
-- =====================================================


CREATE INDEX IF NOT EXISTS idx_appointments_consultant

ON appointments(consultant);



CREATE INDEX IF NOT EXISTS idx_appointments_status

ON appointments(status);



CREATE INDEX IF NOT EXISTS idx_appointments_phone

ON appointments(phone);



-- =====================================================
-- 当前版本说明
--
-- 已验证：
--
-- appointments
--   id
--   name
--   phone
--   type
--   appointment_time
--   message
--   created_at
--   wechat
--   status
--   consultant
--
-- admins
--   id
--   username
--   password
--   role
--
-- users
--   id
--   name
--   username
--   password
--   role
--
-- =====================================================
