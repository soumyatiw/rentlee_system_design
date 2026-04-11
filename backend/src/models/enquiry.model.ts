import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  propertyId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  { timestamps: true }
);

// Indexing for faster queries
EnquirySchema.index({ receiverId: 1, status: 1 });
EnquirySchema.index({ senderId: 1 });

const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
export default Enquiry;
