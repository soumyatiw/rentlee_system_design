import Enquiry, { IEnquiry } from '../models/enquiry.model';

class EnquiryRepository {
  async create(data: Partial<IEnquiry>) {
    return Enquiry.create(data);
  }

  async findByReceiver(receiverId: string) {
    return Enquiry.find({ receiverId })
      .populate('senderId', 'username email avatar')
      .populate('propertyId', 'title city')
      .sort({ createdAt: -1 });
  }

  async findBySender(senderId: string) {
    return Enquiry.find({ senderId })
      .populate('receiverId', 'username email avatar')
      .populate('propertyId', 'title city')
      .sort({ createdAt: -1 });
  }

  async markAsRead(id: string) {
    return Enquiry.findByIdAndUpdate(id, { status: 'read' }, { new: true });
  }

  async countUnread(receiverId: string) {
    return Enquiry.countDocuments({ receiverId, status: 'unread' });
  }
}

export default new EnquiryRepository();
