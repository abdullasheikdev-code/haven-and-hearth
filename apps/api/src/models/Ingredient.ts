import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredientDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  unit: string;
  currentStock: number;
  minimumThreshold: number;
  costPerUnit: number;
  supplierId?: mongoose.Types.ObjectId;
  lastRestockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IIngredientDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    unit: { type: String, required: true }, // kg, g, L, ml, pcs
    currentStock: { type: Number, default: 0, min: 0 },
    minimumThreshold: { type: Number, default: 5, min: 0 },
    costPerUnit: { type: Number, required: true, min: 0 },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    lastRestockedAt: { type: Date },
  },
  { timestamps: true }
);

IngredientSchema.index({ branchId: 1, sku: 1 }, { unique: true });

export const Ingredient = mongoose.model<IIngredientDocument>('Ingredient', IngredientSchema);
