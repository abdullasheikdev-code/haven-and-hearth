import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomTypeDocument extends Document {
  hotelId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  basePricePerNight: number;
  maxGuests: number;
  bedConfig: string;
  sizeSqFt: number;
  amenities: string[];
  images: string[];
  totalRooms: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomTypeSchema = new Schema<IRoomTypeDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    basePricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    bedConfig: { type: String, required: true },
    sizeSqFt: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    totalRooms: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

RoomTypeSchema.index({ hotelId: 1, slug: 1 }, { unique: true });

export const RoomType = mongoose.model<IRoomTypeDocument>('RoomType', RoomTypeSchema);
