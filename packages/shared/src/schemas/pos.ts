import { z } from 'zod';
import { PaymentMethods } from '../constants/statuses';
import { createOrderItemSchema } from './restaurant';

export const posCheckoutSchema = z.object({
  tableNumber: z.string().optional(),
  branchId: z.string().min(1, 'Branch ID required'),
  customerName: z.string().default('Walk-in Guest'),
  items: z.array(createOrderItemSchema).min(1, 'At least one item required'),
  discountPercent: z.number().min(0).max(100).default(0),
  paymentMethod: z.nativeEnum(PaymentMethods),
  amountTendered: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export type PosCheckoutInput = z.infer<typeof posCheckoutSchema>;
