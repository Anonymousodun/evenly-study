const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, target_bedtime, settings FROM users WHERE id = $1',
      [req.appUserId]
    );
    res.json({ user: req.authUser, profile: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/settings', async (req, res) => {
  const { settings } = req.body || {};
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'settings object is required' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET settings = COALESCE(settings, \'{}\'::jsonb) || $1::jsonb, updated_at = NOW() WHERE id = $2 RETURNING settings',
      [JSON.stringify(settings), req.appUserId]
    );
    res.json({ settings: result.rows[0].settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
