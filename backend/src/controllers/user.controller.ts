import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

// The native authentication flows have been moved to auth.controller.ts

export const getMe = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const user = await userService.getUserById(userId);
    sendSuccess(res, user, 'User profile fetched');
  }
);

export const updateMe = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const user = await userService.updateUser(userId, req.body, userId);
    sendSuccess(res, user, 'Profile updated successfully');
  }
);

export const saveProperty = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { propertyId } = req.params;
    const user = await userService.saveProperty(userId, propertyId);
    sendSuccess(res, user, 'Property saved');
  }
);

export const unsaveProperty = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { propertyId } = req.params;
    const user = await userService.unsaveProperty(userId, propertyId);
    sendSuccess(res, user, 'Property removed from saved');
  }
);

export const getSavedProperties = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const saved = await userService.getSavedProperties(userId);
    sendSuccess(res, saved, 'Saved properties fetched');
  }
);
