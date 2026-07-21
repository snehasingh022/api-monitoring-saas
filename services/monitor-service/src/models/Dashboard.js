const { pool } = require('../database/connection');

class Dashboard {
  /**
   * Aggregate per-monitor stats for a user over a lookback window.
   * Uptime = up_checks / total_checks within the window.
   */
  static async getUserAggregation(userId, lookbackHours = 24) {
    const result = await pool.query(
      `WITH user_monitors AS (
         SELECT id, name, url, method, interval_minutes, is_active, created_at, updated_at
         FROM monitors
         WHERE user_id = $1
       ),
       window_stats AS (
         SELECT
           m.id AS monitor_id,
           COUNT(ch.id)::int AS total_checks,
           COUNT(ch.id) FILTER (WHERE ch.status = 'up')::int AS up_checks,
           COUNT(ch.id) FILTER (WHERE ch.status = 'down')::int AS down_checks,
           ROUND(AVG(ch.response_time_ms) FILTER (WHERE ch.response_time_ms IS NOT NULL))::int AS avg_response_time_ms
         FROM user_monitors m
         LEFT JOIN check_history ch
           ON ch.monitor_id = m.id
          AND ch.checked_at >= NOW() - ($2 * INTERVAL '1 hour')
         GROUP BY m.id
       ),
       latest AS (
         SELECT DISTINCT ON (ch.monitor_id)
           ch.monitor_id,
           ch.status,
           ch.status_code,
           ch.response_time_ms,
           ch.checked_at,
           ch.error_message
         FROM check_history ch
         INNER JOIN user_monitors m ON m.id = ch.monitor_id
         ORDER BY ch.monitor_id, ch.checked_at DESC
       )
       SELECT
         m.id,
         m.name,
         m.url,
         m.method,
         m.interval_minutes,
         m.is_active,
         m.created_at,
         m.updated_at,
         COALESCE(ws.total_checks, 0) AS total_checks,
         COALESCE(ws.up_checks, 0) AS up_checks,
         COALESCE(ws.down_checks, 0) AS down_checks,
         ws.avg_response_time_ms,
         l.status AS current_status,
         l.status_code AS last_status_code,
         l.response_time_ms AS last_response_time_ms,
         l.checked_at AS last_checked_at,
         l.error_message AS last_error_message
       FROM user_monitors m
       LEFT JOIN window_stats ws ON ws.monitor_id = m.id
       LEFT JOIN latest l ON l.monitor_id = m.id
       ORDER BY m.created_at DESC`,
      [userId, lookbackHours]
    );

    return result.rows;
  }
}

module.exports = Dashboard;
