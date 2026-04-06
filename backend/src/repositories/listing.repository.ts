import Property, { IProperty } from '../models/property.model';
import { FilterQuery } from 'mongoose';

export interface PropertyFilters {
  city?: string;
  locality?: string;
  category?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  furnishing?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

class PropertyRepository {
  async findAll(filters: PropertyFilters, pagination: PaginationOptions) {
    const query: FilterQuery<IProperty> = { isActive: true };

    if (filters.city) query.city = { $regex: filters.city, $options: 'i' };
    if (filters.locality) query.locality = { $regex: filters.locality, $options: 'i' };
    if (filters.category) query.category = filters.category;
    if (filters.bedrooms) query.bedrooms = { $gte: filters.bedrooms };
    if (filters.furnishing) query.furnishing = filters.furnishing;
    if (filters.minRent || filters.maxRent) {
      query.rent = {};
      if (filters.minRent) query.rent.$gte = filters.minRent;
      if (filters.maxRent) query.rent.$lte = filters.maxRent;
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'username email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return Property.findById(id).populate('owner', 'username email avatar phone');
  }

  async create(data: Partial<IProperty>) {
    return Property.create(data);
  }

  async update(id: string, data: Partial<IProperty>) {
    return Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return Property.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async findByOwner(ownerId: string) {
    return Property.find({ owner: ownerId, isActive: true }).sort({ createdAt: -1 });
  }
  async countListings() {
    return Property.countDocuments({ isActive: true });
  }

  async adminForceDelete(id: string) {
    return Property.findByIdAndDelete(id);
  }
}

export default new PropertyRepository();
