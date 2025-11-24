import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', authorize([Role.ADMIN, Role.MANAGER]), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.patch('/:id', authorize([Role.ADMIN, Role.MANAGER]), categoryController.updateCategory);
router.delete('/:id', authorize([Role.ADMIN, Role.MANAGER]), categoryController.deleteCategory);

export default router;
