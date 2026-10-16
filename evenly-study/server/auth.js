const { betterAuth } = require('better-auth');
const { bearer } = require('better-auth/plugins');
const { pool } = require('./db');

const auth = betterAuth({
  database: pool,
  plugins: [bearer()],
  secret: process.env.BETTER_AUTH_SECRET || 'local-dev-secret-change-me',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  trustedOrigins: [
    'http://localhost:8082',
    'http://localhost:8081',
    'http://192.168.43.59:8081',
    'http://192.168.43.59:3001',
    'exp://192.168.43.59:8081',
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
});

module.exports = { auth };
