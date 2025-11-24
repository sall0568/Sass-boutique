import { Request, Response, NextFunction } from 'express';
import * as stockService from '../services/stock.service';
import { createStockMovementSchema } from '../schemas/stock.schema';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const createStockMovement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const data = createStockMovementSchema.parse(req.body);
    const movement = await stockService.createStockMovement({ ...data, storeId });
    res.status(StatusCodes.CREATED).json({ status: 'success', data: movement });
  } catch (error) {
    next(error);
  }
};

export const getStockMovements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const movements = await stockService.getStockMovements(storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: movements });
  } catch (error) {
    next(error);
  }
};
