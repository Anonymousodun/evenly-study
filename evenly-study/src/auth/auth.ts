import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'evenly_study',
  user: process.env.DB_USER || 'evenly_user',
  password: process.env.DB_PASSWORD || 'evenly_password',
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
});
