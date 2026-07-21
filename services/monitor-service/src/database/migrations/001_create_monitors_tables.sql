-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Monitors table
CREATE TABLE IF NOT EXISTS monitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  method VARCHAR(10) NOT NULL DEFAULT 'GET',
  interval_minutes INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT monitors_method_check CHECK (method IN ('GET', 'POST', 'HEAD')),
  CONSTRAINT monitors_interval_check CHECK (interval_minutes >= 1 AND interval_minutes <= 60)
);

CREATE INDEX IF NOT EXISTS idx_monitors_user_id ON monitors (user_id);
CREATE INDEX IF NOT EXISTS idx_monitors_is_active ON monitors (is_active);

-- Check history table
CREATE TABLE IF NOT EXISTS check_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error_message TEXT,
  CONSTRAINT check_history_status_check CHECK (status IN ('up', 'down'))
);

CREATE INDEX IF NOT EXISTS idx_check_history_monitor_id ON check_history (monitor_id);
CREATE INDEX IF NOT EXISTS idx_check_history_checked_at ON check_history (checked_at DESC);
