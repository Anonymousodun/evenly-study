const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM skipped_breaks WHERE user_id = $1 ORDER BY date DESC',
      [req.appUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { date } = req.body || {};
  if (!date) {
    return res.status(400).json({ error: 'date is required' });
  }
  try {
    const existing = await pool.query(
      'SELECT * FROM skipped_breaks WHERE user_id = $1 AND date = $2',
      [req.appUserId, date]
    );
    if (existing.rows.length > 0) {
      const bumped = await pool.query(
        'UPDATE skipped_breaks SET count = count + 1 WHERE id = $1 RETURNING *',
        [existing.rows[0].id]
      );
      return res.json(bumped.rows[0]);
    }
    const result = await pool.query(
      'INSERT INTO skipped_breaks (user_id, date, count) VALUES ($1, $2, 1) RETURNING *',
      [req.appUserId, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
