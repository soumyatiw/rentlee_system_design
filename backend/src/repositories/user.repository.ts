import User, { IUser } from '../models/user.model';

class UserRepository {
  async findById(id: string) {
    return User.findById(id).select('-password');
  }

  async findByEmail(email: string) {
    return User.findOne({ email }).select('+password');
  }

  async findByFirebaseUid(uid: string) {
    return User.findOne({ firebaseUid: uid });
  }

  async create(data: Partial<IUser>) {
    return User.create(data);
  }

  async update(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
  }

  async addSavedProperty(userId: string, propertyId: string) {
    return User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedProperties: propertyId } },
      { new: true }
    ).select('-password');
  }

  async removeSavedProperty(userId: string, propertyId: string) {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { savedProperties: propertyId } },
      { new: true }
    ).select('-password');
  }

  async getSavedProperties(userId: string) {
    return User.findById(userId)
      .populate('savedProperties')
      .select('savedProperties');
  }

  async findListersByStatus(status: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const query = { role: 'lister', listerStatus: status };
    const listers = await User.find(query).skip(skip).limit(limit).select('-password');
    const total = await User.countDocuments(query);
    return { listers, total, page, limit };
  }

  async findAllListers(statusFilter?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const query: any = { role: 'lister' };
    if (statusFilter) query.listerStatus = statusFilter;
    
    const listers = await User.find(query).skip(skip).limit(limit).select('-password');
    const total = await User.countDocuments(query);
    return { listers, total, page, limit };
  }
}

export default new UserRepository();
