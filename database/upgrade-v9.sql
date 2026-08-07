-- V9 upgrade script

ALTER TABLE users ADD COLUMN last_login DATETIME;

CREATE INDEX IF NOT EXISTS idx_appointments_status
ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_records_client
ON records(client_id);
