import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  recipientId?: mongoose.Types.ObjectId;
  role?: string;
  branchId?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'ORDER' | 'RESERVATION' | 'ROOM_BOOKING' | 'KITCHEN' | 'INVENTORY' | 'SYSTEM';
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    role: { type: String, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['ORDER', 'RESERVATION', 'ROOM_BOOKING', 'KITCHEN', 'INVENTORY', 'SYSTEM'],
      default: 'SYSTEM',
    },
    isRead: { type: Boolean, default: false },
    linkUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  NotificationSchema
);
