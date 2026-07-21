ALTER TABLE monitors
  ADD COLUMN IF NOT EXISTS alert_email VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_monitors_alert_email ON monitors (alert_email);
