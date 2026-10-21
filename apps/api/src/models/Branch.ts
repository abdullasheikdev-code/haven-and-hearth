import mongoose, { Schema, Document } from 'mongoose';

export interface IBranchDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email?: string;
  businessHours: {
    open: string;
    close: string;
  };
  hasRestaurant: boolean;
  hasHotel: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranchDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'USA' },
    },
    phone: { type: String, required: true },
    email: { type: String },
    businessHours: {
      open: { type: String, default: '07:00' },
      close: { type: String, default: '23:00' },
    },
    hasRestaurant: { type: Boolean, default: true },
    hasHotel: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BranchSchema.index({ organizationId: 1, slug: 1 }, { unique: true });

export const Branch = mongoose.model<IBranchDocument>('Branch', BranchSchema);
