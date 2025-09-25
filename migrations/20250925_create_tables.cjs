/**
 * Create tables: users, payments, audit_logs
 */
exports.up = async function(knex) {
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (t) => {
      t.string('id').primary();
      t.string('username').unique().notNullable();
      t.string('password_hash').notNullable();
      t.string('role').notNullable();
      t.timestamps(true, true);
    });
  }

  const hasPayments = await knex.schema.hasTable('payments');
  if (!hasPayments) {
    await knex.schema.createTable('payments', (t) => {
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

  const hasAudit = await knex.schema.hasTable('audit_logs');
  if (!hasAudit) {
    await knex.schema.createTable('audit_logs', (t) => {
      t.string('id').primary();
      t.string('payment_id').notNullable();
      t.string('action').notNullable();
      t.string('by_user');
      t.string('by_role');
      t.text('comment');
      t.timestamp('created_at');
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('users');
};
