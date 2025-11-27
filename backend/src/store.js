const { randomUUID } = require('crypto');
const User = require('./models/User');
const WaterUsage = require('./models/WaterUsage');

function sanitizeUser(user) {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  const { passwordHash, ...safeUser } = userObj;
  return safeUser;
}

function createId() {
  return randomUUID();
}

module.exports = {
  sanitizeUser,
  createId,
  User,
  WaterUsage,
};
