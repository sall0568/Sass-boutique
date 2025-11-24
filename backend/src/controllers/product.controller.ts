import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const data = createProductSchema.parse({ ...req.body, storeId });
    const product = await productService.createProduct(data);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const products = await productService.getProducts(storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    const product = await productService.getProductById(id, storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    const data = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(id, storeId, data);
    res.status(StatusCodes.OK).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    await productService.deleteProduct(id, storeId);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
