import { Request, Response } from 'express';
import { Ingredient } from '../models/Ingredient';
import { StockMovement } from '../models/StockMovement';
import { Supplier } from '../models/Supplier';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { StockMovementTypes } from '@haven/shared';

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const { branchId, lowStockOnly } = req.query;
    const filter: any = {};
    if (branchId) filter.branchId = branchId;

    let ingredients = await Ingredient.find(filter).populate('supplierId', 'name category').sort({ name: 1 });

    if (lowStockOnly === 'true') {
      ingredients = ingredients.filter((i) => i.currentStock <= i.minimumThreshold);
    }

    return sendSuccess(res, ingredients);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    return sendSuccess(res, ingredient, 'Ingredient created', 201);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const recordStockMovement = async (req: Request, res: Response) => {
  try {
    const { ingredientId, type, quantity, reason, costPerUnit } = req.body;

    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      return sendError(res, 'Ingredient not found', 404);
    }

    const previousStock = ingredient.currentStock;
    let newStock = previousStock;

    if (type === StockMovementTypes.PURCHASE || (type === StockMovementTypes.ADJUSTMENT && quantity > 0)) {
      newStock = previousStock + Math.abs(quantity);
    } else {
      // USAGE, WASTAGE, or negative ADJUSTMENT
      newStock = Math.max(0, previousStock - Math.abs(quantity));
    }

    ingredient.currentStock = newStock;
    if (type === StockMovementTypes.PURCHASE) {
      ingredient.lastRestockedAt = new Date();
    }
    await ingredient.save();

    const movement = await StockMovement.create({
      branchId: ingredient.branchId,
      ingredientId: ingredient._id,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      costPerUnit: costPerUnit || ingredient.costPerUnit,
      recordedBy: req.user?.id,
    });

    return sendSuccess(res, { ingredient, movement }, 'Stock movement recorded successfully');
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.query;
    const filter: any = { isActive: true };
    if (branchId) filter.branchId = branchId;

    const suppliers = await Supplier.find(filter).sort({ name: 1 });
    return sendSuccess(res, suppliers);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const { branchId, status } = req.query;
    const filter: any = {};
    if (branchId) filter.branchId = branchId;
    if (status) filter.status = status;

    const orders = await PurchaseOrder.find(filter).populate('supplierId', 'name contactPerson phone').sort({ createdAt: -1 });
    return sendSuccess(res, orders);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { branchId, supplierId, items, notes } = req.body;

    const subtotal = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const totalAmount = subtotal + tax;
    const poNumber = `PO-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const po = await PurchaseOrder.create({
      poNumber,
      branchId,
      supplierId,
      items,
      subtotal,
      tax,
      totalAmount,
      status: 'ORDERED',
      notes,
    });

    return sendSuccess(res, po, 'Purchase order placed', 201);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const receivePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const po = await PurchaseOrder.findById(id);
    if (!po) return sendError(res, 'Purchase order not found', 404);
    if (po.status === 'RECEIVED') {
      return sendError(res, 'This purchase order has already been received.', 400);
    }

    po.status = 'RECEIVED';
    po.receivedDate = new Date();
    await po.save();

    // Increment inventory for each received item and create stock movements
    for (const item of po.items) {
      const ingredient = await Ingredient.findById(item.ingredientId);
      if (ingredient) {
        const prev = ingredient.currentStock;
        ingredient.currentStock += item.quantity;
        ingredient.lastRestockedAt = new Date();
        await ingredient.save();

        await StockMovement.create({
          branchId: po.branchId,
          ingredientId: ingredient._id,
          type: StockMovementTypes.PURCHASE,
          quantity: item.quantity,
          previousStock: prev,
          newStock: ingredient.currentStock,
          reason: `Received from PO #${po.poNumber}`,
          costPerUnit: item.unitPrice,
          recordedBy: req.user?.id,
        });
      }
    }

    return sendSuccess(res, po, `Purchase order #${po.poNumber} marked received. Inventory updated.`);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};
