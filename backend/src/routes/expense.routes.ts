import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', authorize([Role.ADMIN, Role.MANAGER]), expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.delete('/:id', authorize([Role.ADMIN, Role.MANAGER]), expenseController.deleteExpense);

export default router;
