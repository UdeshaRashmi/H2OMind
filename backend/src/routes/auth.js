const express = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../store');
const { sanitizeUser, createId } = require('../store');
const { SALT_ROUNDS } = require('../config');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, dailyGoal = 2000, theme = 'light' } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      id: createId(),
      name,
      email: normalizedEmail,
      passwordHash,
      dailyGoal: Number(dailyGoal) || 2000,
      theme,
      createdAt: new Date(),
    });

    await user.save();

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
