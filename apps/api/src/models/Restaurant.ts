import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurantDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cuisine: string[];
  priceRange: '$$' | '$$$' | '$$$$';
  rating: number;
  reviewCount: number;
  coverImage: string;
  galleryImages: string[];
  openingHours: {
    lunch: string;
    dinner: string;
  };
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    cuisine: [{ type: String }],
    priceRange: { type: String, enum: ['$$', '$$$', '$$$$'], default: '$$$' },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    openingHours: {
      lunch: { type: String, default: '12:00 PM – 3:30 PM' },
      dinner: { type: String, default: '6:00 PM – 11:00 PM' },
    },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model<IRestaurantDocument>('Restaurant', RestaurantSchema);
