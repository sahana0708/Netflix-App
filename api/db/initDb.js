import { query } from './pool.js';

async function initDb() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('[DB] Table "users" is ready.');
  } catch (err) {
    console.error('[DB] Init failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

initDb();
