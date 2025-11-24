import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { Role } from '@prisma/client';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      storeId: decoded.storeId,
    };
    next();
  } catch (error) {
    next(new AppError('Invalid token', StatusCodes.UNAUTHORIZED));
  }
};

export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Not authorized', StatusCodes.FORBIDDEN)
      );
    }

    next();
  };
};
