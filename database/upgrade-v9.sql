-- =====================================================
-- 摆渡心理 V9.0 企业正式版
-- database/upgrade-v9.sql
--
-- 数据库升级脚本
-- Cloudflare D1 / SQLite
-- =====================================================

PRAGMA foreign_keys = ON;

-- =====================================================
-- 1. 历史数据迁移
-- 王老师 -> 涂老师
-- =====================================================

UPDATE appointments
SET consultant='涂老师'
WHERE consultant='王老师';


-- =====================================================
-- 2. appointments 增加备注字段
-- （如果已经存在，请跳过执行）
-- =====================================================

ALTER TABLE appointments ADD COLUMN remark TEXT;


-- =====================================================
-- 3. 咨询记录表
-- =====================================================

CREATE TABLE IF NOT EXISTS consultation_records (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    appointment_id INTEGER NOT NULL,

    consultant TEXT NOT NULL,

    title TEXT,

    content TEXT NOT NULL,

    mood TEXT,

    risk_level TEXT DEFAULT '低',

    next_plan TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


-- =====================================================
-- 4. 客户档案
-- =====================================================

CREATE TABLE IF NOT EXISTS clients (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    appointment_id INTEGER,

    name TEXT,

    phone TEXT,

    wechat TEXT,

    gender TEXT,

    birthday TEXT,

    occupation TEXT,

    emergency_contact TEXT,

    emergency_phone TEXT,

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


-- =====================================================
-- 5. 系统日志
-- =====================================================

CREATE TABLE IF NOT EXISTS logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    operator TEXT,

    action TEXT,

    detail TEXT,

    ip TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


-- =====================================================
-- 6. AI 咨询摘要
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_summaries (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    appointment_id INTEGER,

    consultant TEXT,

    summary TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


-- =====================================================
-- 7. 创建索引
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_records_appointment
ON consultation_records(appointment_id);

CREATE INDEX IF NOT EXISTS idx_records_consultant
ON consultation_records(consultant);

CREATE INDEX IF NOT EXISTS idx_clients_phone
ON clients(phone);

CREATE INDEX IF NOT EXISTS idx_logs_operator
ON logs(operator);


-- =====================================================
-- V9.0 升级完成
-- =====================================================
