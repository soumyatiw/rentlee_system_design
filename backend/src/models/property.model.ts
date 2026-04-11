import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  rent: number;
  city: string;
  locality: string;
  state: string;
  category: 'Apartment' | 'House' | 'Condo' | 'Studio' | 'Villa';
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  available_from: string;
  image_url: string;
  contact: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  owner: mongoose.Types.ObjectId;
  isActive: boolean;
  status: 'Available' | 'Rented' | 'Hidden';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}


const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    rent: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true },
    locality: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Apartment', 'House', 'Condo', 'Studio', 'Villa'],
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area_sqft: { type: Number, required: true, min: 0 },
    furnishing: {
      type: String,
      required: true,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    },
    available_from: { type: String, required: true },
    image_url: { type: String, default: '' },
    contact: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    amenities: { type: [String], default: [] },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['Available', 'Rented', 'Hidden'],
      default: 'Available',
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);


// Index for geospatial and search queries
PropertySchema.index({ city: 1 });
PropertySchema.index({ category: 1 });
PropertySchema.index({ rent: 1 });
PropertySchema.index({ bedrooms: 1 });

const Property = mongoose.model<IProperty>('Property', PropertySchema);
export default Property;
