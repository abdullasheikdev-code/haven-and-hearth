import { z } from 'zod';
import { StockMovementTypes } from '../constants/statuses';

export const stockMovementSchema = z.object({
  ingredientId: z.string().min(1, 'Ingredient ID required'),
  type: z.nativeEnum(StockMovementTypes),
  quantity: z.number().positive('Quantity must be greater than zero'),
  reason: z.string().min(2, 'Reason is required'),
  costPerUnit: z.number().optional(),
});

export type StockMovementInput = z.infer<typeof stockMovementSchema>;

export const createIngredientSchema = z.object({
  name: z.string().min(2, 'Ingredient name required'),
  sku: z.string().min(2, 'SKU required'),
  unit: z.string().min(1, 'Unit of measurement required (kg, g, l, ml, pcs)'),
  currentStock: z.number().nonnegative().default(0),
  minimumThreshold: z.number().nonnegative().default(5),
  costPerUnit: z.number().positive('Cost must be positive'),
  branchId: z.string().min(1, 'Branch ID required'),
});

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
