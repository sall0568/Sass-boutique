import { Request, Response, NextFunction } from 'express';
import * as expenseService from '../services/expense.service';
import { createExpenseSchema } from '../schemas/expense.schema';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const storeId = req.user?.storeId;
    if (!userId || !storeId) throw new AppError('User not authenticated or not in store', StatusCodes.UNAUTHORIZED);

    const data = createExpenseSchema.parse(req.body);
    const expense = await expenseService.createExpense(userId, storeId, data);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: expense });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);

    const expenses = await expenseService.getExpenses(storeId);
    res.status(StatusCodes.OK).json({ status: 'success', data: expenses });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user?.storeId;
    if (!storeId) throw new AppError('User not attached to a store', StatusCodes.BAD_REQUEST);
    const { id } = req.params;

    await expenseService.deleteExpense(id, storeId);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
