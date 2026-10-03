const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM sleep_entries WHERE user_id = $1 ORDER BY date DESC',
      [req.appUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { date, bedtime, wake_time, rest_score } = req.body || {};
  if (!date || !bedtime || !wake_time || rest_score === undefined) {
    return res.status(400).json({ error: 'date, bedtime, wake_time, rest_score are required' });
  }
  if (rest_score < 1 || rest_score > 5) {
    return res.status(400).json({ error: 'rest_score must be 1-5' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO sleep_entries (user_id, date, bedtime, wake_time, rest_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.appUserId, date, bedtime, wake_time, rest_score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
