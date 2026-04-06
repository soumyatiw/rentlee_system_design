import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  } else {
    message = err.message || 'Internal Server Error';
  }

  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(stack && { stack }),
  });
};
