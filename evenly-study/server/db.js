const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'evenly_study',
  user: process.env.DB_USER || 'evenly_user',
  password: process.env.DB_PASSWORD || 'evenly_password',
});

pool.on('error', (err) => {
  console.error('Postgres pool error:', err.message);
});

module.exports = { pool };
