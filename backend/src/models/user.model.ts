import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firebaseUid?: string;
  role: 'user' | 'lister' | 'admin';
  listerStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  avatar?: string;
  phone?: string;
  savedProperties: mongoose.Types.ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    firebaseUid: { type: String, sparse: true, unique: true },
    role: {
      type: String,
      enum: ['user', 'lister', 'admin'],
      default: 'user',
    },
    listerStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
    },
    avatar: { type: String, default: '' },
    phone: { type: String },
    savedProperties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving (for non-Firebase auth flows)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
