import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2),
  storeId: z.string().uuid(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
});
