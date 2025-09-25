import { validationResult } from 'express-validator';
import * as paymentsService from '../services/paymentsService.js';

export const createPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, user_id } = req.body;
    const payment = await paymentsService.create({ amount, user_id, requested_by: req.user.id });
    res.status(201).json(payment);
  } catch (err) { next(err); }
};

export const listPayments = async (req, res, next) => {
  try {
    const payments = await paymentsService.list();
    res.json(payments);
  } catch (err) { next(err); }
};

export const adminApprove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // action: approve|reject
    if (!['approve','reject'].includes(action)) return res.status(400).json({ error: 'invalid action' });

    const result = await paymentsService.adminAction({ paymentId: id, action, by: req.user });
    res.json(result);
  } catch (err) { next(err); }
};

export const superApprove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // action: confirm|reject
    if (!['confirm','reject'].includes(action)) return res.status(400).json({ error: 'invalid action' });

    const result = await paymentsService.superAction({ paymentId: id, action, by: req.user });
    res.json(result);
  } catch (err) { next(err); }
};
