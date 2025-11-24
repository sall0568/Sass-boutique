import { Request, Response, NextFunction } from 'express';
import * as saleService from '../services/sale.service';
import { createSaleSchema } from '../schemas/sale.schema';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const createSale = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const storeId = req.user?.storeId;
    if (!userId || !storeId) throw new AppError('User not authenticated or not in store', StatusCodes.UNAUTHORIZED);

    const data = createSaleSchema.parse(req.body);
    const sale = await saleService.createSale(userId, storeId, data.items);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: sale });
  } catch (error) {
    next(error);
  }
};

export const getSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const sales = await saleService.getSales(storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: sales });
  } catch (error) {
    next(error);
  }
};

export const getSaleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    const sale = await saleService.getSaleById(id, storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: sale });
  } catch (error) {
    next(error);
  }
};
