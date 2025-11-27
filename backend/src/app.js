const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const usageRoutes = require('./routes/waterUsage');
const insightsRoutes = require('./routes/insights');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/insights', insightsRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

