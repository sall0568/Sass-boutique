import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { StatusCodes } from 'http-status-codes';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.status(StatusCodes.OK).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};
