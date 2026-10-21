import mongoose, { Schema, Document } from 'mongoose';
import {
  HousekeepingStatus,
  HousekeepingStatuses,
  RoomStatus,
  RoomStatuses,
} from '@haven/shared';

export interface IRoomDocument extends Document {
  hotelId: mongoose.Types.ObjectId;
  roomTypeId: mongoose.Types.ObjectId;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  housekeepingStatus: HousekeepingStatus;
  currentBookingId?: mongoose.Types.ObjectId;
  housekeepingNotes?: string;
  lastCleanedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoomDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true, index: true },
    roomNumber: { type: String, required: true },
    floor: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(RoomStatuses),
      default: RoomStatuses.AVAILABLE,
      index: true,
    },
    housekeepingStatus: {
      type: String,
      enum: Object.values(HousekeepingStatuses),
      default: HousekeepingStatuses.CLEAN,
      index: true,
    },
    currentBookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    housekeepingNotes: { type: String },
    lastCleanedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

RoomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

export const Room = mongoose.model<IRoomDocument>('Room', RoomSchema);
