import mongoose, { Schema, Document } from 'mongoose';
import {
  OrderStatus,
  OrderStatuses,
  OrderType,
  OrderTypes,
  PaymentMethod,
  PaymentMethods,
  PaymentStatus,
  PaymentStatuses,
} from '@haven/shared';

export interface IOrderItemSubdoc {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  selectedModifiers?: {
    modifierName: string;
    optionName: string;
    price: number;
  }[];
  itemTotal: number;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  organizationId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string;
  roomNumber?: string;
  hotelBookingId?: mongoose.Types.ObjectId;
  items: IOrderItemSubdoc[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentTransactionId?: string;
  notes?: string;
  placedAt: Date;
  acceptedAt?: Date;
  preparingAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemSubdoc>(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String },
    selectedModifiers: [
      {
        modifierName: { type: String, required: true },
        optionName: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    itemTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    customerEmail: { type: String },
    orderType: {
      type: String,
      enum: Object.values(OrderTypes),
      required: true,
      index: true,
    },
    tableNumber: { type: String },
    roomNumber: { type: String },
    hotelBookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    serviceCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatuses),
      default: OrderStatuses.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatuses),
      default: PaymentStatuses.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethods),
    },
    paymentTransactionId: { type: String },
    notes: { type: String },
    placedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    preparingAt: { type: Date },
    readyAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);
