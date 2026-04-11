import propertyRepository, {
  PropertyFilters,
  PaginationOptions,
} from '../repositories/listing.repository';
import { IProperty } from '../models/property.model';
import { AppError } from '../utils/AppError';

class PropertyService {
  async getAllProperties(filters: PropertyFilters, pagination: PaginationOptions) {
    return propertyRepository.findAll(filters, pagination);
  }

  async getPropertyById(id: string) {
    const property = await propertyRepository.findById(id);
    if (!property) {
      throw new AppError('Property not found', 404);
    }
    return property;
  }

  async createProperty(data: Partial<IProperty>) {
    return propertyRepository.create(data);
  }

  async updateProperty(id: string, data: Partial<IProperty>, requesterId: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new AppError('Property not found', 404);

    if (property.owner.toString() !== requesterId) {
      throw new AppError('Not authorized to update this property', 403);
    }

    return propertyRepository.update(id, data);
  }

  async deleteProperty(id: string, requesterId: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new AppError('Property not found', 404);

    if (property.owner.toString() !== requesterId) {
      throw new AppError('Not authorized to delete this property', 403);
    }

    return propertyRepository.delete(id);
  }

  async getPropertiesByOwner(ownerId: string) {
    return propertyRepository.findByOwner(ownerId);
  }

  async getRawAll() {
    return propertyRepository.findRawAll();
  }
}


export default new PropertyService();
