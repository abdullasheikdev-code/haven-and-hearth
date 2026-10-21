import mongoose, { Schema, Document } from 'mongoose';
import { TableStatus, TableStatuses } from '@haven/shared';

export interface ITableDocument extends Document {
  branchId: mongoose.Types.ObjectId;
  tableNumber: string;
  capacity: number;
  floorZone: string;
  status: TableStatus;
  currentOrderId?: mongoose.Types.ObjectId;
  assignedWaiterId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITableDocument>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    tableNumber: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    floorZone: { type: String, default: 'Main Dining Room' },
    status: {
      type: String,
      enum: Object.values(TableStatuses),
      default: TableStatuses.AVAILABLE,
      index: true,
    },
    currentOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    assignedWaiterId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

TableSchema.index({ branchId: 1, tableNumber: 1 }, { unique: true });

export const Table = mongoose.model<ITableDocument>('Table', TableSchema);
