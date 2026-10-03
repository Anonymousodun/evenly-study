const { fromNodeHeaders } = require('better-auth/node');
const { auth } = require('./auth');
const { pool } = require('./db');

// Verifies the Better Auth session, then maps the login email
// to our app `users` row (creating it on first login).
async function requireSession(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Not signed in' });
    }

    const email = session.user.email;
    const name = session.user.name || null;

    let result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    let appUserId;
    if (result.rows.length === 0) {
      const created = await pool.query(
        'INSERT INTO users (email, name, target_bedtime) VALUES ($1, $2, $3) RETURNING id',
        [email, name, '23:00']
      );
      appUserId = created.rows[0].id;
    } else {
      appUserId = result.rows[0].id;
    }

    req.authUser = session.user;
    req.appUserId = appUserId;
    next();
  } catch (err) {
    console.error('Session check failed:', err.message);
    res.status(500).json({ error: 'Session check failed' });
  }
}

module.exports = { requireSession };
