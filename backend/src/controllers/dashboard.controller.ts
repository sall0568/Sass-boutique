import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const stats = await dashboardService.getDashboardStats(storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};
