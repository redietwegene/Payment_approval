const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('audit_logs').del();
  await knex('payments').del();
  await knex('users').del();

  const adminPass = await bcrypt.hash('adminpass', 10);
  const superPass = await bcrypt.hash('superpass', 10);
  const userPass = await bcrypt.hash('userpass', 10);

  await knex('users').insert([
    { id: 'u-admin', username: 'admin', password_hash: adminPass, role: 'admin' },
    { id: 'u-super', username: 'super', password_hash: superPass, role: 'super_admin' },
    { id: 'u-user', username: 'user', password_hash: userPass, role: 'user' }
  ]);

  const p1 = uuidv4();
  await knex('payments').insert({ id: p1, amount: 123.45, user_id: 'u-user', status: 'pending', created_at: new Date().toISOString(), requested_by: 'u-user' });
  await knex('audit_logs').insert({ id: uuidv4(), payment_id: p1, action: 'created', by_user: 'u-user', by_role: 'user', comment: null, created_at: new Date().toISOString() });
};
