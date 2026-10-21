import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplierDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  address?: string;
  paymentTerms: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplierDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    category: { type: String, required: true }, // 'Organic Farm Produce', 'Wines & Spirits', 'Meat & Seafood', 'Dairy'
    address: { type: String },
    paymentTerms: { type: String, default: 'Net 30' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplierDocument>('Supplier', SupplierSchema);
