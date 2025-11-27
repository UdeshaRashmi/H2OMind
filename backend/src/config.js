const path = require('path');

require('dotenv').config();

const ROOT_DIR = path.join(__dirname, '..');

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/h2omind',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),
};

