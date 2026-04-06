import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import userRepository from '../repositories/user.repository';
import { ListerStatusStateMachine, ListerStatus } from '../utils/ListerStatusStateMachine';
import NotificationService from '../services/notification.service';

const getPagination = (req: Request) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  return { page, limit };
};

export const getPendingListers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { page, limit } = getPagination(req);
  const result = await userRepository.findListersByStatus('pending', page, limit);
  sendSuccess(res, result, 'Fetched pending listers', 200);
});

export const getAllListers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { page, limit } = getPagination(req);
  const status = req.query.status as string;
  const result = await userRepository.findAllListers(status, page, limit);
  sendSuccess(res, result, 'Fetched all listers', 200);
});

const handleListerStatusChange = async (id: string, newStatus: ListerStatus, actionLog: string) => {
  const lister = await userRepository.findById(id);
  if (!lister) throw new AppError('User not found', 404);
  if (lister.role !== 'lister') throw new AppError('Cannot change status of a non-lister account', 400);

  // Use State Pattern to validate transition securely Let state machine dictate validity
  const validState = ListerStatusStateMachine.transition(lister.listerStatus as ListerStatus, newStatus);
  
  lister.listerStatus = validState;
  await lister.save();

  return lister;
};

export const approveLister = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const lister = await handleListerStatusChange(req.params.id, 'approved', 'approval');
  
  // Observer Pattern — dispatch email independently
  NotificationService.notifyApproval(lister.email, lister.username);

  sendSuccess(res, lister, 'Lister approved successfully');
});

export const rejectLister = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const reason = req.body.reason || 'No specific reason provided.';
  const lister = await handleListerStatusChange(req.params.id, 'rejected', 'rejection');
  
  // Observer Pattern — dispatch rejection email
  NotificationService.notifyRejection(lister.email, lister.username, reason);

  sendSuccess(res, lister, 'Lister rejected successfully');
});

export const suspendLister = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const lister = await handleListerStatusChange(req.params.id, 'suspended', 'suspension');
  sendSuccess(res, lister, 'Lister suspended successfully');
});
