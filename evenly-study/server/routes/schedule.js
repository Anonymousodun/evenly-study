const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

const KINDS = ['class', 'study', 'work', 'other', 'break'];
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function validBlock(b) {
  if (!b) return 'Request body is required';
  if (!Number.isInteger(b.day) || b.day < 0 || b.day > 6) return 'day must be 0-6';
  if (!b.title || typeof b.title !== 'string') return 'title is required';
  if (!KINDS.includes(b.kind)) return 'kind must be class, study, work, or other';
  if (!TIME_RE.test(b.start_time || '')) return 'start_time must be HH:MM';
  if (!TIME_RE.test(b.end_time || '')) return 'end_time must be HH:MM';
  if (b.start_time >= b.end_time) return 'end_time must be after start_time';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM schedule_blocks WHERE user_id = $1 ORDER BY day ASC, start_time ASC',
      [req.appUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const err = validBlock(req.body);
  if (err) return res.status(400).json({ error: err });
  const { day, title, kind, start_time, end_time } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO schedule_blocks (user_id, day, title, kind, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.appUserId, day, title, kind, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (dbErr) {
    res.status(500).json({ error: dbErr.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM schedule_blocks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.appUserId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Schedule block not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
