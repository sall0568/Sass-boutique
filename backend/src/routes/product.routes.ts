import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', authorize([Role.ADMIN, Role.MANAGER]), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.patch('/:id', authorize([Role.ADMIN, Role.MANAGER]), productController.updateProduct);
router.delete('/:id', authorize([Role.ADMIN, Role.MANAGER]), productController.deleteProduct);

export default router;
