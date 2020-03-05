const config = require('../src/config');

module.exports = {
  ...config,
  env: {
    AUTH_CLOSED: process.env.AUTH_CLOSED ? JSON.parse(process.env.AUTH_CLOSED) : true,
    AUTH_ADMIN: process.env.AUTH_ADMIN ? process.env.AUTH_ADMIN.split(',') : [],
    DATABASE_URL: process.env.DATABASE_URL || process.argv[2],
    DATABASE_LOG: process.env.DATABASE_LOG || process.argv[3],
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    VOTE_AVAILABLE: parseInt(process.env.VOTE_AVAILABLE) || 0,
    VOTE_CLOSED: process.env.VOTE_CLOSED ? JSON.parse(process.env.VOTE_CLOSED) : true,
    VOTE_EXPIRE: parseInt(process.env.VOTE_EXPIRE) || 0,
    VOTE_ROUNDS: parseInt(process.env.VOTE_ROUNDS) || 0,
  }
};