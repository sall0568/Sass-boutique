import { z } from 'zod';
import { MovementType } from '@prisma/client';

export const createStockMovementSchema = z.object({
  productId: z.string().uuid(),
  type: z.nativeEnum(MovementType),
  quantity: z.number().int().positive(),
  reason: z.string().optional(),
});
