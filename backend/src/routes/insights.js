const express = require('express');

const { WaterUsage, User } = require('../store');
const { sanitizeUser } = require('../store');

const router = express.Router();

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toISODate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().split('T')[0];
}

function summarizeUsage(entries, user) {
  const today = toISODate(new Date());
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const monthAgo = new Date(now);
  monthAgo.setDate(monthAgo.getDate() - 29);

  let totalToday = 0;
  let totalWeek = 0;
  let totalMonth = 0;

  const categoryTotals = {};

  entries.forEach((entry) => {
    const entryDateKey = toISODate(entry.date || entry.createdAt);
    if (!entryDateKey) {
      return;
    }
    const entryDate = new Date(entryDateKey);
    const liters = Number(entry.liters) || 0;

    if (entryDateKey === today) {
      totalToday += liters;
    }
    if (entryDate >= weekAgo && entryDate <= now) {
      totalWeek += liters;
    }
    if (entryDate >= monthAgo && entryDate <= now) {
      totalMonth += liters;
    }

    categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + liters;
  });

  const weeklyTrend = Array.from({ length: 7 }).map((_, indexFromEnd) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - indexFromEnd));
    const key = toISODate(date);
    const usageForDay = entries
      .filter((entry) => toISODate(entry.date || entry.createdAt) === key)
      .reduce((sum, entry) => sum + (Number(entry.liters) || 0), 0);

    return {
      day: WEEKDAY_LABELS[date.getDay()],
      usage: Math.round(usageForDay),
      date: key,
    };
  });

  const monthlyTrend = [];
  for (let i = 3; i >= 0; i -= 1) {
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() - i * 7);
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - 6);

    const total = entries
      .filter((entry) => {
        const isoDate = toISODate(entry.date || entry.createdAt);
        if (!isoDate) return false;
        const entryDate = new Date(isoDate);
        return entryDate >= periodStart && entryDate <= periodEnd;
      })
      .reduce((sum, entry) => sum + (Number(entry.liters) || 0), 0);

    monthlyTrend.push({
      label: `Week ${4 - i}`,
      usage: Math.round(total),
    });
  }

  const totalCategoryLiters = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0) || 1;
  const categoryBreakdown = Object.entries(categoryTotals).map(([category, value]) => ({
    category,
    value: Math.round(value),
    percentage: Math.round((value / totalCategoryLiters) * 100),
  }));

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 6)
    .map((entry) => ({
      id: entry.id,
      liters: entry.liters,
      category: entry.category,
      notes: entry.notes || '',
      date: toISODate(entry.date || entry.createdAt),
    }));

  const progressPercentage = user.dailyGoal ? Math.min((totalToday / user.dailyGoal) * 100, 200) : 0;
  const alerts = [];

  if (user.dailyGoal && totalToday > user.dailyGoal) {
    alerts.push({
      id: `alert-${today}-goal`,
      type: 'warning',
      message: `You've exceeded your daily goal by ${Math.round(((totalToday - user.dailyGoal) / user.dailyGoal) * 100)}%.`,
      date: today,
      read: false,
    });
  }

  if (totalWeek > user.dailyGoal * 7) {
    alerts.push({
      id: `alert-${today}-weekly`,
      type: 'warning',
      message: 'Weekly consumption is trending above your goal.',
      date: today,
      read: false,
    });
  }

  if (alerts.length === 0 && totalToday > 0) {
    alerts.push({
      id: `alert-${today}-success`,
      type: 'success',
      message: 'Great job keeping your water usage on track today!',
      date: today,
      read: false,
    });
  }

  const recommendations = [];

  if (totalToday > user.dailyGoal) {
    recommendations.push('Switch high-volume tasks like gardening to early morning to reduce evaporation.');
  }
  if (totalWeek > user.dailyGoal * 7) {
    recommendations.push('Review shower duration and laundry frequency to save up to 15% water weekly.');
  }
  if (!recommendations.length) {
    recommendations.push('Keep logging usage daily to maintain consistent insights.');
  }

  return {
    user: sanitizeUser(user),
    totals: {
      today: Math.round(totalToday),
      week: Math.round(totalWeek),
      month: Math.round(totalMonth),
      goal: user.dailyGoal,
    },
    progress: {
      percentage: Math.round(progressPercentage),
      remaining: Math.max(user.dailyGoal - totalToday, 0),
    },
    weeklyTrend,
    monthlyTrend,
    categoryBreakdown,
    recentEntries,
    alerts,
    recommendations,
  };
}

router.get('/summary', async (req, res, next) => {
  try {
    const { userId } = req.query || {};

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const entries = await WaterUsage.find({ userId });
    const summary = summarizeUsage(entries, user);

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

router.get('/alerts', async (req, res, next) => {
  try {
    const { userId } = req.query || {};

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const entries = await WaterUsage.find({ userId });
    const summary = summarizeUsage(entries, user);

    res.json({ alerts: summary.alerts });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
