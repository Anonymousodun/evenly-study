const { betterAuth } = require('better-auth');
const { bearer } = require('better-auth/plugins');
const { pool } = require('./db');

const auth = betterAuth({
  database: pool,
  plugins: [bearer()],
  secret: process.env.BETTER_AUTH_SECRET || 'local-dev-secret-change-me',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
});

module.exports = { auth };
