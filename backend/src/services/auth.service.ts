import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { env } from '../utils/env';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email already in use', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    let storeId = data.storeId;

    if (data.storeName) {
      const store = await tx.store.create({
        data: { name: data.storeName },
      });
      storeId = store.id;
    }

    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        storeId: storeId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        storeId: true,
      },
    });

    return user;
  });

  return result;

};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, storeId: user.storeId },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      storeId: user.storeId,
    },
    token,
  };
};
