import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  costPrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  storeId: z.string().uuid(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});
