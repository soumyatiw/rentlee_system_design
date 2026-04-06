import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import User, { IUser } from '../models/user.model';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route, no token', 401));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists.', 401));
    }
    
    // Attach to request
    (req as any).user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route, invalid token', 401));
  }
});

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!roles.includes(userRole)) {
      return next(new AppError(`User role ${userRole} is not authorized to access this route`, 403));
    }
    next();
  };
};

export const requireApprovedLister = (req: Request, _res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user.role === 'lister' && user.listerStatus !== 'approved') {
    return next(new AppError(`Access denied. Your account is ${user.listerStatus}. Awaiting admin approval.`, 403));
  }
  next();
};
