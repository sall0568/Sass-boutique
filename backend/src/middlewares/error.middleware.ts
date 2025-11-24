import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error('Unexpected Error:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
