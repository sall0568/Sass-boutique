import { Router } from 'express';
import * as stockController from '../controllers/stock.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', authorize([Role.ADMIN, Role.MANAGER]), stockController.createStockMovement);
router.get('/', stockController.getStockMovements);

export default router;
