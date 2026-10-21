import mongoose, { Schema, Document } from 'mongoose';
import { ReservationStatus, ReservationStatuses } from '@haven/shared';

export interface ITableReservationDocument extends Document {
  reservationNumber: string;
  organizationId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: number;
  reservationDate: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  tableNumber?: string;
  status: ReservationStatus;
  specialRequests?: string;
  seatedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TableReservationSchema = new Schema<ITableReservationDocument>(
  {
    reservationNumber: { type: String, required: true, unique: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    partySize: { type: Number, required: true, min: 1, max: 20 },
    reservationDate: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    tableNumber: { type: String },
    status: {
      type: String,
      enum: Object.values(ReservationStatuses),
      default: ReservationStatuses.CONFIRMED,
      index: true,
    },
    specialRequests: { type: String },
    seatedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const TableReservation = mongoose.model<ITableReservationDocument>(
  'TableReservation',
  TableReservationSchema
);
