import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganizationDocument extends Document {
  name: string;
  slug: string;
  legalName?: string;
  currency: string;
  taxRate: number;
  serviceChargeRate: number;
  logoUrl?: string;
  timezone: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganizationDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    legalName: { type: String, trim: true },
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 8.5 }, // 8.5%
    serviceChargeRate: { type: Number, default: 5.0 }, // 5.0%
    logoUrl: { type: String },
    timezone: { type: String, default: 'America/New_York' },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganizationDocument>('Organization', OrganizationSchema);
