import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.nativeEnum(Role).optional(),
  storeId: z.string().optional(),
  storeName: z.string().min(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
