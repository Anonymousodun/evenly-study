const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

router.post('/', async (req, res) => {
  const { break_length } = req.body || {};
  try {
    const result = await pool.query(
      'INSERT INTO sessions (user_id, start_time, break_length, completed, skipped) VALUES ($1, NOW(), $2, FALSE, FALSE) RETURNING *',
      [req.appUserId, break_length || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { completed, skipped, end_time } = req.body || {};
  try {
    const result = await pool.query(
      'UPDATE sessions SET end_time = COALESCE($1, NOW()), completed = COALESCE($2, completed), skipped = COALESCE($3, skipped) WHERE id = $4 AND user_id = $5 RETURNING *',
      [end_time || null, completed ?? null, skipped ?? null, req.params.id, req.appUserId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
