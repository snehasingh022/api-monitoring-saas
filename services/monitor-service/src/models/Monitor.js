const { pool } = require('../database/connection');

class Monitor {
  static async create({
    userId,
    name,
    url,
    method = 'GET',
    intervalMinutes = 5,
    alertEmail = null,
  }) {
    const result = await pool.query(
      `INSERT INTO monitors (user_id, name, url, method, interval_minutes, alert_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, name, url, method, interval_minutes, is_active, alert_email, created_at, updated_at`,
      [userId, name, url, method, intervalMinutes, alertEmail]
    );

    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT id, user_id, name, url, method, interval_minutes, is_active, alert_email, created_at, updated_at
       FROM monitors
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  static async findByIdAndUserId(id, userId) {
    const result = await pool.query(
      `SELECT id, user_id, name, url, method, interval_minutes, is_active, alert_email, created_at, updated_at
       FROM monitors
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    return result.rows[0] || null;
  }

  static async deleteByIdAndUserId(id, userId) {
    const result = await pool.query(
      `DELETE FROM monitors
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    return result.rowCount > 0;
  }

  /**
   * Active monitors whose interval has elapsed since the last check
   * (or that have never been checked).
   */
  static async findDueForCheck() {
    const result = await pool.query(
      `SELECT
         m.id,
         m.user_id,
         m.name,
         m.url,
         m.method,
         m.interval_minutes,
         m.is_active,
         m.alert_email,
         m.created_at,
         m.updated_at,
         last_check.checked_at AS last_checked_at,
         last_check.status AS previous_status
       FROM monitors m
       LEFT JOIN LATERAL (
         SELECT checked_at, status
         FROM check_history
         WHERE monitor_id = m.id
         ORDER BY checked_at DESC
         LIMIT 1
       ) last_check ON TRUE
       WHERE m.is_active = TRUE
         AND (
           last_check.checked_at IS NULL
           OR last_check.checked_at <= NOW() - (m.interval_minutes * INTERVAL '1 minute')
         )
       ORDER BY m.created_at ASC`
    );

    return result.rows;
  }

  static toPublic(monitor) {
    if (!monitor) {
      return null;
    }

    return {
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
      method: monitor.method,
      intervalMinutes: monitor.interval_minutes,
      isActive: monitor.is_active,
      alertEmail: monitor.alert_email || null,
      createdAt: monitor.created_at,
      updatedAt: monitor.updated_at,
    };
  }
}

module.exports = Monitor;
