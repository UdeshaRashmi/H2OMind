const express = require('express');
const bcrypt = require('bcryptjs');

const { User, WaterUsage } = require('../store');
const { sanitizeUser } = require('../store');
const { SALT_ROUNDS } = require('../config');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ users: users.map(sanitizeUser) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.params.id });

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
    const user = await User.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (email) {
      const existingEmailOwner = await User.findOne({
        email: email.toLowerCase(),
        id: { $ne: req.params.id },
      });

      if (existingEmailOwner) {
        return res.status(409).json({ message: 'Another user already uses that email.' });
      }

      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (typeof dailyGoal !== 'undefined') user.dailyGoal = Number(dailyGoal);
    if (theme) user.theme = theme;
    if (password) {
      user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    user.updatedAt = new Date();

    await user.save();

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await WaterUsage.deleteMany({ userId: req.params.id });
    await User.deleteOne({ id: req.params.id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
