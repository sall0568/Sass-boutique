import { Router } from 'express';
import * as saleController from '../controllers/sale.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', saleController.createSale);
router.get('/', saleController.getSales);
router.get('/:id', saleController.getSaleById);

export default router;
