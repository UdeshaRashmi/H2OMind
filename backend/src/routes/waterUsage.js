const express = require('express');

const { readDb, writeDb, createId } = require('../store');

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
    const db = await readDb();

    let entries = db.waterUsage;

    if (userId) {
      entries = entries.filter((entry) => entry.userId === userId);
    }

    if (startDate) {
      entries = entries.filter((entry) => entry.date >= startDate);
    }

    if (endDate) {
      entries = entries.filter((entry) => entry.date <= endDate);
    }

    entries = entries
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
      .slice(0, limit ? Number(limit) : entries.length);

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

    const db = await readDb();
    const userExists = db.users.some((user) => user.id === userId);

    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const entry = {
      id: createId(),
      userId,
      date,
      liters: normalizedLiters,
      category,
      notes,
      createdAt: new Date().toISOString(),
    };

    db.waterUsage.push(entry);
    await writeDb(db);

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { date, liters, category, notes } = req.body || {};
    const db = await readDb();
    const index = db.waterUsage.findIndex((entry) => entry.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Usage entry not found.' });
    }

    if (typeof liters !== 'undefined') {
      const normalizedLiters = toNumber(liters);
      if (normalizedLiters === null) {
        return res.status(400).json({ message: 'liters must be a positive number.' });
      }
      db.waterUsage[index].liters = normalizedLiters;
    }

    if (date) db.waterUsage[index].date = date;
    if (category) db.waterUsage[index].category = category;
    if (typeof notes !== 'undefined') db.waterUsage[index].notes = notes;

    db.waterUsage[index].updatedAt = new Date().toISOString();

    await writeDb(db);
    res.json({ entry: db.waterUsage[index] });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await readDb();
    const index = db.waterUsage.findIndex((entry) => entry.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Usage entry not found.' });
    }

    db.waterUsage.splice(index, 1);
    await writeDb(db);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

