import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const data = createCategorySchema.parse({ ...req.body, storeId });
    const category = await categoryService.createCategory(data);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const categories = await categoryService.getCategories(storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    const data = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(id, storeId, data);
    res.status(StatusCodes.OK).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    await categoryService.deleteCategory(id, storeId);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
