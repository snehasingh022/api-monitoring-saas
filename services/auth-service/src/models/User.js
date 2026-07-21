const { pool } = require('../database/connection');

class User {
  static async create({ email, passwordHash, name }) {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at, updated_at`,
      [email, passwordHash, name]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT id, email, password_hash, name, created_at, updated_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, email, name, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  static async emailExists(email) {
    const result = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );

    return result.rowCount > 0;
  }

  static toPublic(user) {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}

module.exports = User;
