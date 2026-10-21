import mongoose, { Schema, Document } from 'mongoose';
import { StockMovementType, StockMovementTypes } from '@haven/shared';

export interface IStockMovementDocument extends Document {
  branchId: mongoose.Types.ObjectId;
  ingredientId: mongoose.Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  costPerUnit?: number;
  recordedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const StockMovementSchema = new Schema<IStockMovementDocument>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(StockMovementTypes),
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, required: true },
    costPerUnit: { type: Number },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const StockMovement = mongoose.model<IStockMovementDocument>(
  'StockMovement',
  StockMovementSchema
);
