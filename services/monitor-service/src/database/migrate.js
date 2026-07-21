require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const getExecutedMigrations = async (client) => {
  const result = await client.query(
    'SELECT filename FROM schema_migrations ORDER BY id ASC'
  );
  return new Set(result.rows.map((row) => row.filename));
};

const getMigrationFiles = () => {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();
};

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await ensureMigrationsTable(client);

    const executed = await getExecutedMigrations(client);
    const files = getMigrationFiles();
    let applied = 0;

    for (const filename of files) {
      if (executed.has(filename)) {
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, filename);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migrations (filename) VALUES ($1)',
        [filename]
      );

      console.log(`Applied migration: ${filename}`);
      applied += 1;
    }

    await client.query('COMMIT');

    if (applied === 0) {
      console.log('No pending migrations');
    } else {
      console.log(`Successfully applied ${applied} migration(s)`);
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err.message);
      process.exit(1);
    });
}

module.exports = { runMigrations };
