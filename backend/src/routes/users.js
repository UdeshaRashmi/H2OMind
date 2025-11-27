const express = require('express');
const bcrypt = require('bcryptjs');

const { readDb, writeDb, sanitizeUser } = require('../store');
const { SALT_ROUNDS } = require('../config');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = await readDb();
    res.json({ users: db.users.map(sanitizeUser) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const db = await readDb();
    const user = db.users.find((entry) => entry.id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, password, dailyGoal, theme } = req.body || {};
    const db = await readDb();
    const userIndex = db.users.findIndex((entry) => entry.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingEmailOwner = email
      ? db.users.find((entry) => entry.email === email.toLowerCase() && entry.id !== req.params.id)
      : null;

    if (existingEmailOwner) {
      return res.status(409).json({ message: 'Another user already uses that email.' });
    }

    const user = db.users[userIndex];
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (typeof dailyGoal !== 'undefined') user.dailyGoal = Number(dailyGoal);
    if (theme) user.theme = theme;
    if (password) {
      user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    user.updatedAt = new Date().toISOString();

    db.users[userIndex] = user;
    await writeDb(db);

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await readDb();
    const userIndex = db.users.findIndex((entry) => entry.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    db.users.splice(userIndex, 1);
    db.waterUsage = db.waterUsage.filter((usage) => usage.userId !== req.params.id);

    await writeDb(db);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

