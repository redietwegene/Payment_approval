import knex from 'knex';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DB_FILE || path.join(__dirname, '../../data/dev.sqlite3');

let db;
if (process.env.DATABASE_URL) {
  // Postgres
  db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
  });
} else {
  db = knex({
    client: 'sqlite3',
    connection: { filename: dbFile },
    useNullAsDefault: true,
  });
}

export const initDb = async () => {
  // create tables if not exist (simple migrations)
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (t) => {
      t.string('id').primary();
      t.string('username').unique().notNullable();
      t.string('password_hash').notNullable();
      t.string('role').notNullable();
      t.timestamps(true, true);
    });
  }

  const hasPayments = await db.schema.hasTable('payments');
  if (!hasPayments) {
    await db.schema.createTable('payments', (t) => {
      t.string('id').primary();
      t.float('amount').notNullable();
      t.string('user_id').notNullable();
      t.string('status').notNullable();
      t.string('requested_by');
      t.string('admin_by');
      t.string('super_admin_by');
      t.timestamp('created_at');
      t.timestamp('admin_at');
      t.timestamp('super_admin_at');
    });
  }

  const hasAudit = await db.schema.hasTable('audit_logs');
  if (!hasAudit) {
    await db.schema.createTable('audit_logs', (t) => {
      t.string('id').primary();
      t.string('payment_id').notNullable();
      t.string('action').notNullable();
      t.string('by_user');
      t.string('by_role');
      t.text('comment');
      t.timestamp('created_at');
    });
  }

  return db;
};

export default db;
