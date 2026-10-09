const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();

// Read-only advisor summary. Aggregates only — never individual check-in
// answers, sleep times, or personal notes (PRD 7.5). No session required;
// the unguessable token is the credential. Expired or revoked links 404.
router.get('/:token', async (req, res) => {
  try {
    const link = await pool.query(
      'SELECT * FROM share_links WHERE token = $1 AND revoked = FALSE AND expires_at > NOW()',
      [req.params.token]
    );
    if (link.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found or expired' });
    }
    const userId = link.rows[0].user_id;
    const week = await pool.query(`SELECT * FROM daily_checkins WHERE user_id = $1 AND date >= CURRENT_DATE - 7`, [userId]);
    const rest = await pool.query(`SELECT rest_score FROM sleep_entries WHERE user_id = $1 AND date >= CURRENT_DATE - 7`, [userId]);
    const done = await pool.query(`SELECT COUNT(*)::int AS n FROM tasks WHERE user_id = $1 AND completed = TRUE`, [userId]);
    const open = await pool.query(`SELECT COUNT(*)::int AS n FROM tasks WHERE user_id = $1 AND completed = FALSE`, [userId]);
    const moods = week.rows.map(r => r.mood_score);
    const rests = rest.rows.map(r => r.rest_score);
    res.json({
      generated_at: new Date().toISOString(),
      expires_at: link.rows[0].expires_at,
      week: {
        checkin_days: week.rows.length,
        avg_mood: moods.length ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10 : null,
        avg_rest: rests.length ? Math.round((rests.reduce((a, b) => a + b, 0) / rests.length) * 10) / 10 : null,
        tasks_completed: done.rows[0].n,
        tasks_open: open.rows[0].n,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use(requireSession);

// Create a share link. Expires automatically after 30 days (PRD 7.5).
router.post('/', async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const result = await pool.query(
      `INSERT INTO share_links (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days') RETURNING id, token, created_at, expires_at, revoked`,
      [req.appUserId, token]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, created_at, expires_at, revoked FROM share_links WHERE user_id = $1 ORDER BY created_at DESC',
      [req.appUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revoke a link at any time.
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE share_links SET revoked = TRUE WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.appUserId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json({ revoked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
