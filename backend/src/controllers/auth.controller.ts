import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { UserFactory } from '../services/user.factory';
import userRepository from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) return next(new AppError('Email already in use', 400));

  const userData = UserFactory.create('user', { username, email, password });
  const user = await userRepository.create(userData);

  const token = generateToken({ id: user.id, role: user.role, username: user.username });

  sendSuccess(res, { user: { id: user.id, username, email, role: user.role }, token }, 'User registered successfully', 201);
});

export const registerLister = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) return next(new AppError('Email already in use', 400));

  const userData = UserFactory.create('lister', { username, email, password });
  const user = await userRepository.create(userData);

  sendSuccess(res, { user: { id: user.id, username, email, role: user.role, listerStatus: user.listerStatus } }, 'Your application is under review.', 201);
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user || !user.password) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  if (user.role === 'lister') {
    if (user.listerStatus === 'pending') return next(new AppError('Your account is awaiting admin approval', 403));
    if (user.listerStatus === 'rejected') return next(new AppError('Your application was rejected', 403));
    if (user.listerStatus === 'suspended') return next(new AppError('Your account has been suspended', 403));
  }

  const token = generateToken({ id: user.id, role: user.role, username: user.username });

  sendSuccess(res, { user: { id: user.id, username: user.username, email: user.email, role: user.role, listerStatus: user.listerStatus }, token }, 'Login successful', 200);
});
