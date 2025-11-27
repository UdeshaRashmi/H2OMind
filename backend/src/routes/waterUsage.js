const express = require('express');

const { WaterUsage, User } = require('../store');
const { createId } = require('../store');

const router = express.Router();

function toNumber(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

router.get('/', async (req, res, next) => {
  try {
    const { userId, startDate, endDate, limit } = req.query || {};

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (startDate) {
      query.date = { $gte: startDate };
    }

    if (endDate) {
      if (query.date) {
        query.date.$lte = endDate;
      } else {
        query.date = { $lte: endDate };
      }
    }

    let entries = await WaterUsage.find(query).sort({ date: -1, createdAt: -1 });

    if (limit) {
      entries = entries.slice(0, Number(limit));
    }

    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { userId, date, liters, category, notes = '' } = req.body || {};

    if (!userId || !date || typeof liters === 'undefined' || !category) {
      return res.status(400).json({ message: 'userId, date, liters, and category are required.' });
    }

    const normalizedLiters = toNumber(liters);
    if (normalizedLiters === null) {
      return res.status(400).json({ message: 'liters must be a positive number.' });
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const entry = new WaterUsage({
      id: createId(),
      userId,
      date,
      liters: normalizedLiters,
      category,
      notes,
      createdAt: new Date(),
    });

    await entry.save();

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { date, liters, category, notes } = req.body || {};
    const entry = await WaterUsage.findOne({ id: req.params.id });

    if (!entry) {
      return res.status(404).json({ message: 'Usage entry not found.' });
    }

    if (typeof liters !== 'undefined') {
      const normalizedLiters = toNumber(liters);
      if (normalizedLiters === null) {
        return res.status(400).json({ message: 'liters must be a positive number.' });
      }
      entry.liters = normalizedLiters;
    }

    if (date) entry.date = date;
    if (category) entry.category = category;
    if (typeof notes !== 'undefined') entry.notes = notes;

    entry.updatedAt = new Date();

    await entry.save();
    res.json({ entry });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const entry = await WaterUsage.findOne({ id: req.params.id });

    if (!entry) {
      return res.status(404).json({ message: 'Usage entry not found.' });
    }

    await WaterUsage.deleteOne({ id: req.params.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
