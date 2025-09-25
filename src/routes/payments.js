import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import * as paymentsController from '../controllers/paymentsController.js';

const router = express.Router();

router.post(
  '/',
  auth,
  body('amount').isFloat({ gt: 0 }),
  body('user_id').isString().notEmpty(),
  paymentsController.createPayment
);

router.get('/', auth, paymentsController.listPayments);

router.post('/:id/admin-approve', auth, requireRole('admin'), paymentsController.adminApprove);
router.post('/:id/super-approve', auth, requireRole('super_admin'), paymentsController.superApprove);

export default router;
