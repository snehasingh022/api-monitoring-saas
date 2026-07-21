const { pool } = require('../database/connection');

class RefreshToken {
  static async create({ userId, tokenHash, expiresAt }) {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, expires_at, created_at`,
      [userId, tokenHash, expiresAt]
    );

    return result.rows[0];
  }

  static async findValidByTokenHash(tokenHash) {
    const result = await pool.query(
      `SELECT id, user_id, token_hash, expires_at, created_at, revoked_at
       FROM refresh_tokens
       WHERE token_hash = $1
         AND revoked_at IS NULL
         AND expires_at > NOW()`,
      [tokenHash]
    );

    return result.rows[0] || null;
  }

  static async revokeById(id) {
    await pool.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW()
       WHERE id = $1 AND revoked_at IS NULL`,
      [id]
    );
  }
}

module.exports = RefreshToken;
