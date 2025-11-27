const path = require('path');

require('dotenv').config();

const ROOT_DIR = path.join(__dirname, '..');

module.exports = {
  PORT: process.env.PORT || 4000,
  DATA_FILE: process.env.DATA_FILE || path.join(ROOT_DIR, 'data', 'db.json'),
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),
};

