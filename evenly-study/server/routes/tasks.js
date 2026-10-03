const express = require('express');
const { pool } = require('../db');
const { requireSession } = require('../middleware');

const router = express.Router();
router.use(requireSession);

const EFFORTS = ['light', 'medium', 'heavy'];

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC',
      [req.appUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, type, effort, due_date } = req.body || {};
  if (!title || !type || !effort || !due_date) {
    return res.status(400).json({ error: 'title, type, effort, due_date are required' });
  }
  if (!EFFORTS.includes(effort)) {
    return res.status(400).json({ error: 'effort must be light, medium, or heavy' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, type, effort, due_date, completed) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *',
      [req.appUserId, title, type, effort, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const allowed = ['title', 'type', 'effort', 'due_date', 'completed'];
  const updates = Object.keys(req.body || {}).filter(k => allowed.includes(k));
  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  try {
    const setClause = updates.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = updates.map(k => req.body[k]);
    values.push(req.params.id, req.appUserId);
    const result = await pool.query(
      `UPDATE tasks SET ${setClause} WHERE id = $${updates.length + 1} AND user_id = $${updates.length + 2} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.appUserId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
