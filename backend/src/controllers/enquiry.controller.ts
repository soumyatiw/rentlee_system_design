import { Request, Response, NextFunction } from 'express';
import enquiryRepository from '../repositories/enquiry.repository';
import propertyRepository from '../repositories/listing.repository';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

export const createEnquiry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { propertyId, message } = req.body;
    const senderId = (req as any).user?.id;

    const property = await propertyRepository.findById(propertyId);
    if (!property) return next(new AppError('Property not found', 404));

    const receiverId = property.owner._id;

    const enquiry = await enquiryRepository.create({
      propertyId,
      senderId,
      receiverId,
      message,
    });

    sendSuccess(res, enquiry, 'Enquiry sent successfully', 201);
  }
);

export const getMyEnquiries = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    let enquiries;
    if (role === 'lister') {
      enquiries = await enquiryRepository.findByReceiver(userId);
    } else {
      enquiries = await enquiryRepository.findBySender(userId);
    }

    sendSuccess(res, enquiries, 'Enquiries fetched successfully');
  }
);

export const markEnquiryAsRead = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const enquiry = await enquiryRepository.markAsRead(id);
    sendSuccess(res, enquiry, 'Enquiry marked as read');
  }
);
