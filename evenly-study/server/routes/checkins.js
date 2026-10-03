const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM daily_checkins WHERE user_id = $1 ORDER BY date DESC',
      [req.appUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { date, mood_score } = req.body || {};
  if (!date || mood_score === undefined) {
    return res.status(400).json({ error: 'date and mood_score are required' });
  }
  if (mood_score < 1 || mood_score > 5) {
    return res.status(400).json({ error: 'mood_score must be 1-5' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO daily_checkins (user_id, date, mood_score) VALUES ($1, $2, $3) RETURNING *',
      [req.appUserId, date, mood_score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
