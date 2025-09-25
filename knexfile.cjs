// Knex config (CommonJS) - reads DATABASE_URL for Postgres or falls back to SQLite
require('dotenv').config();
const path = require('path');

const usePostgres = !!process.env.DATABASE_URL;

module.exports = {
  client: usePostgres ? 'pg' : 'sqlite3',
  connection: usePostgres ? process.env.DATABASE_URL : { filename: process.env.DB_FILE || path.join(__dirname, 'data', 'dev.sqlite3') },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    extension: 'cjs'
  },
  seeds: {
    directory: path.join(__dirname, 'seeds', 'knex'),
    extension: 'cjs'
  }
};
