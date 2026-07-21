const { pool } = require('../database/connection');

class CheckHistory {
  static async create({
    monitorId,
    status,
    statusCode = null,
    responseTimeMs = null,
    errorMessage = null,
  }) {
    const result = await pool.query(
      `INSERT INTO check_history
         (monitor_id, status, status_code, response_time_ms, error_message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, monitor_id, status, status_code, response_time_ms, checked_at, error_message`,
      [monitorId, status, statusCode, responseTimeMs, errorMessage]
    );

    return result.rows[0];
  }

  static async findLatestByMonitorId(monitorId) {
    const result = await pool.query(
      `SELECT id, monitor_id, status, status_code, response_time_ms, checked_at, error_message
       FROM check_history
       WHERE monitor_id = $1
       ORDER BY checked_at DESC
       LIMIT 1`,
      [monitorId]
    );

    return result.rows[0] || null;
  }

  static async findByMonitorId(monitorId, { limit = 50, offset = 0 } = {}) {
    const result = await pool.query(
      `SELECT id, monitor_id, status, status_code, response_time_ms, checked_at, error_message
       FROM check_history
       WHERE monitor_id = $1
       ORDER BY checked_at DESC
       LIMIT $2 OFFSET $3`,
      [monitorId, limit, offset]
    );

    return result.rows;
  }

  static async countByMonitorId(monitorId) {
    const result = await pool.query(
      'SELECT COUNT(*)::int AS total FROM check_history WHERE monitor_id = $1',
      [monitorId]
    );

    return result.rows[0].total;
  }

  static async findLatestByMonitorIds(monitorIds) {
    if (!monitorIds.length) {
      return [];
    }

    const result = await pool.query(
      `SELECT DISTINCT ON (monitor_id)
         id, monitor_id, status, status_code, response_time_ms, checked_at, error_message
       FROM check_history
       WHERE monitor_id = ANY($1::uuid[])
       ORDER BY monitor_id, checked_at DESC`,
      [monitorIds]
    );

    return result.rows;
  }

  static toPublic(check) {
    if (!check) {
      return null;
    }

    return {
      id: check.id,
      monitorId: check.monitor_id,
      status: check.status,
      statusCode: check.status_code,
      responseTimeMs: check.response_time_ms,
      checkedAt: check.checked_at,
      errorMessage: check.error_message,
    };
  }
}

module.exports = CheckHistory;
