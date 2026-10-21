import mongoose, { Schema, Document } from 'mongoose';

export interface IHotelDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  starRating: number;
  coverImage: string;
  galleryImages: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  policies: {
    cancellation: string;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotelDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    starRating: { type: Number, default: 5 },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    amenities: [{ type: String }],
    checkInTime: { type: String, default: '15:00' },
    checkOutTime: { type: String, default: '11:00' },
    policies: {
      cancellation: { type: String, default: 'Free cancellation up to 48 hours prior to check-in.' },
      petsAllowed: { type: Boolean, default: false },
      smokingAllowed: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model<IHotelDocument>('Hotel', HotelSchema);
