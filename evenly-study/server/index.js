const express = require('express');
const cors = require('cors');
const { toNodeHandler } = require('better-auth/node');
const { auth } = require('./auth');

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'evenly-study-api' });
});

// Better Auth handles /api/auth/sign-up, /sign-in, /sign-out, /session, etc.
app.use('/api/auth', toNodeHandler(auth));

app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/sleep', require('./routes/sleep'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/skips', require('./routes/skips'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/me', require('./routes/me'));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evenly Study API listening on port ${PORT}`);
});
