import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';

class UserService {
// Firebase auth sync method replaced by native UserFactory -> userRepository logic in auth.controller.ts

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateUser(id: string, data: Partial<IUser>, requesterId: string) {
    if (id !== requesterId) throw new AppError('Not authorized', 403);
    const user = await userRepository.update(id, data);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async saveProperty(userId: string, propertyId: string) {
    return userRepository.addSavedProperty(userId, propertyId);
  }

  async unsaveProperty(userId: string, propertyId: string) {
    return userRepository.removeSavedProperty(userId, propertyId);
  }

  async getSavedProperties(userId: string) {
    return userRepository.getSavedProperties(userId);
  }
}

export default new UserService();
