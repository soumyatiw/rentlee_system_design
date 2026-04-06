import { Request, Response, NextFunction } from 'express';
import propertyService from '../services/listing.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const getAllProperties = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const {
      city,
      locality,
      category,
      minRent,
      maxRent,
      bedrooms,
      furnishing,
      page = '1',
      limit = '12',
    } = req.query as Record<string, string>;

    const filters = {
      city,
      locality,
      category,
      minRent: minRent ? parseInt(minRent) : undefined,
      maxRent: maxRent ? parseInt(maxRent) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      furnishing,
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await propertyService.getAllProperties(filters, pagination);
    sendSuccess(res, result, 'Properties fetched successfully');
  }
);

export const getPropertyById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const property = await propertyService.getPropertyById(req.params.id);
    sendSuccess(res, property, 'Property fetched successfully');
  }
);

export const createProperty = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const property = await propertyService.createProperty({ ...req.body, owner: userId });
    sendSuccess(res, property, 'Property created successfully', 201);
  }
);

export const updateProperty = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const property = await propertyService.updateProperty(req.params.id, req.body, userId);
    sendSuccess(res, property, 'Property updated successfully');
  }
);

export const deleteProperty = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    await propertyService.deleteProperty(req.params.id, userId);
    sendSuccess(res, null, 'Property deleted successfully');
  }
);

export const getMyProperties = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const properties = await propertyService.getPropertiesByOwner(userId);
    sendSuccess(res, properties, 'Your properties fetched successfully');
  }
);
