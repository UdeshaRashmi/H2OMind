const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { DATA_FILE } = require('./config');

const DEFAULT_DB = {
  users: [],
  waterUsage: [],
};

async function ensureStore() {
  const dir = path.dirname(DATA_FILE);
  await fsp.mkdir(dir, { recursive: true });

  if (!fs.existsSync(DATA_FILE)) {
    await fsp.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
  }
}

async function readDb() {
  await ensureStore();
  const raw = await fsp.readFile(DATA_FILE, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return {
      users: Array.isArray(data.users) ? data.users : [],
      waterUsage: Array.isArray(data.waterUsage) ? data.waterUsage : [],
    };
  } catch (error) {
    console.error('Failed to parse DB file. Recreating...', error);
    await writeDb(DEFAULT_DB);
    return DEFAULT_DB;
  }
}

async function writeDb(data) {
  await ensureStore();
  await fsp.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function createId() {
  return randomUUID();
}

module.exports = {
  readDb,
  writeDb,
  sanitizeUser,
  createId,
  ensureStore,
};

