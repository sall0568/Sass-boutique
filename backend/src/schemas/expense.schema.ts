import { z } from 'zod';

export const createExpenseSchema = z.object({
  description: z.string().min(2),
  amount: z.number().positive(),
  date: z.string().datetime().optional(), // ISO string
});
