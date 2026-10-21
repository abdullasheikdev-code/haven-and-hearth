import { z } from 'zod';
import { OrderTypes } from '../constants/statuses';

export const createReservationSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant is required'),
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(6, 'Phone is required'),
  partySize: z.number().int().min(1, 'At least 1 guest required').max(20, 'Max 20 guests per online booking'),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Time slot must be HH:MM format'),
  specialRequests: z.string().max(500).optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const orderItemModifierSchema = z.object({
  modifierName: z.string(),
  optionName: z.string(),
  price: z.number().nonnegative(),
});

export const createOrderItemSchema = z.object({
  menuItemId: z.string().min(1, 'Item ID required'),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
  notes: z.string().max(200).optional(),
  selectedModifiers: z.array(orderItemModifierSchema).optional(),
});

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID required'),
  branchId: z.string().optional(),
  orderType: z.nativeEnum(OrderTypes),
  customerName: z.string().min(2, 'Customer name required'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  tableNumber: z.string().optional(),
  roomNumber: z.string().optional(),
  items: z.array(createOrderItemSchema).min(1, 'Order must contain at least one item'),
  notes: z.string().max(500).optional(),
  paymentMethod: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
