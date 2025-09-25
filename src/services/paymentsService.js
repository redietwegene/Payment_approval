import db from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';

export const create = async ({ amount, user_id, requested_by }) => {
  const id = uuidv4();
  const now = new Date().toISOString();
  await db('payments').insert({ id, amount, user_id, status: 'pending', created_at: now, requested_by });
  await db('audit_logs').insert({ id: uuidv4(), payment_id: id, action: 'created', by_user: requested_by, by_role: null, comment: null, created_at: now });
  return db('payments').where({ id }).first();
};

export const list = async () => {
  return db('payments').select('*').orderBy('created_at', 'desc');
};

export const adminAction = async ({ paymentId, action, by }) => {
  const payment = await db('payments').where({ id: paymentId }).first();
  if (!payment) throw Object.assign(new Error('Payment not found'), { status: 404 });

  if (payment.status !== 'pending') {
    // Only allow admin action if pending
    throw Object.assign(new Error('Payment not in pending state'), { status: 400 });
  }

  const now = new Date().toISOString();
  const adminDecision = action === 'approve' ? 'admin_approved' : 'admin_rejected';

  await db.transaction(async (trx) => {
    await trx('payments').where({ id: paymentId }).update({ status: adminDecision, admin_by: by.id, admin_at: now });
    await trx('audit_logs').insert({ id: uuidv4(), payment_id: paymentId, action: adminDecision, by_user: by.id, by_role: by.role, comment: null, created_at: now });
  });

  return db('payments').where({ id: paymentId }).first();
};

export const superAction = async ({ paymentId, action, by }) => {
  const payment = await db('payments').where({ id: paymentId }).first();
  if (!payment) throw Object.assign(new Error('Payment not found'), { status: 404 });

  // Super admin can only act after admin approved
  if (!['admin_approved','admin_rejected'].includes(payment.status)) {
    throw Object.assign(new Error('Payment not ready for super admin action'), { status: 400 });
  }

  const now = new Date().toISOString();
  let finalStatus;
  if (action === 'confirm' && payment.status === 'admin_approved') finalStatus = 'approved';
  if (action === 'reject') finalStatus = 'rejected';

  if (!finalStatus) throw Object.assign(new Error('Invalid super admin action for current payment state'), { status: 400 });

  await db.transaction(async (trx) => {
    await trx('payments').where({ id: paymentId }).update({ status: finalStatus, super_admin_by: by.id, super_admin_at: now });
    await trx('audit_logs').insert({ id: uuidv4(), payment_id: paymentId, action: `super_${action}`, by_user: by.id, by_role: by.role, comment: null, created_at: now });
  });

  return db('payments').where({ id: paymentId }).first();
};
