import mongoose, { Schema, Document } from 'mongoose';
import {
  BookingStatus,
  BookingStatuses,
  PaymentStatus,
  PaymentStatuses,
} from '@haven/shared';

export interface IFolioCharge {
  description: string;
  amount: number;
  date: Date;
  type: 'ROOM' | 'ROOM_SERVICE' | 'AMENITY' | 'TAX';
  referenceId?: string;
}

export interface IBookingDocument extends Document {
  bookingNumber: string;
  hotelId: mongoose.Types.ObjectId;
  roomTypeId: mongoose.Types.ObjectId;
  roomId?: mongoose.Types.ObjectId;
  roomNumber?: string;
  customerId?: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  numberOfGuests: number;
  numberOfNights: number;
  nightlyRate: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  folioCharges: IFolioCharge[];
  actualCheckIn?: Date;
  actualCheckOut?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FolioChargeSchema = new Schema<IFolioCharge>(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['ROOM', 'ROOM_SERVICE', 'AMENITY', 'TAX'],
      default: 'ROOM',
    },
    referenceId: { type: String },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBookingDocument>(
  {
    bookingNumber: { type: String, required: true, unique: true, index: true },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true, index: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    roomNumber: { type: String },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, trim: true, lowercase: true },
    guestPhone: { type: String, required: true, trim: true },
    checkInDate: { type: String, required: true, index: true },
    checkOutDate: { type: String, required: true, index: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    numberOfNights: { type: Number, required: true, min: 1 },
    nightlyRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatuses),
      default: BookingStatuses.CONFIRMED,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatuses),
      default: PaymentStatuses.PENDING,
      index: true,
    },
    specialRequests: { type: String },
    folioCharges: [FolioChargeSchema],
    actualCheckIn: { type: Date },
    actualCheckOut: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBookingDocument>('Booking', BookingSchema);
