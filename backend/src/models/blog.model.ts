import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  published: boolean;
  readingTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
    readingTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

BlogSchema.index({ tags: 1 });
BlogSchema.index({ published: 1 });

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
