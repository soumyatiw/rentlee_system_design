import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication token missing. Please log in.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET ?? '';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;
    if (!roles.includes(userRole)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
