import { Request, Response } from 'express';
import { MenuItem } from '../models/MenuItem';
import { Restaurant } from '../models/Restaurant';
import { Table } from '../models/Table';
import { Order } from '../models/Order';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { emitEvent } from '../sockets/socket';
import { OrderStatuses, OrderTypes, PaymentStatuses, TableStatuses } from '@haven/shared';

export const getPosMenuAndTables = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.query;
    if (!branchId) return sendError(res, 'Branch ID is required', 400);

    const restaurant = await Restaurant.findOne({ branchId });
    if (!restaurant) return sendError(res, 'No restaurant found for this branch', 404);

    const menuItems = await MenuItem.find({ restaurantId: restaurant._id, isAvailable: true }).sort({ category: 1, name: 1 });
    const tables = await Table.find({ branchId }).populate('currentOrderId').sort({ tableNumber: 1 });

    const categories = Array.from(new Set(menuItems.map((m) => m.category)));

    return sendSuccess(res, {
      restaurant,
      categories,
      menuItems,
      tables,
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const processPosCheckout = async (req: Request, res: Response) => {
  try {
    const {
      branchId,
      tableNumber,
      customerName,
      items,
      discountPercent = 0,
      paymentMethod,
      amountTendered,
      notes,
    } = req.body;

    const restaurant = await Restaurant.findOne({ branchId });
    if (!restaurant) return sendError(res, 'Restaurant not found', 404);

    // Fetch verified prices
    const itemIds = items.map((i: any) => i.menuItemId);
    const dbItems = await MenuItem.find({ _id: { $in: itemIds } });
    const itemMap = new Map(dbItems.map((i) => [i._id.toString(), i]));

    let subtotal = 0;
    const processedItems = items.map((i: any) => {
      const dbItem = itemMap.get(i.menuItemId.toString());
      if (!dbItem) throw new Error(`Item ${i.name} not found`);

      let unitPrice = dbItem.price;
      if (i.selectedModifiers) {
        for (const m of i.selectedModifiers) unitPrice += m.price || 0;
      }
      const itemTotal = unitPrice * i.quantity;
      subtotal += itemTotal;

      return {
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: unitPrice,
        quantity: i.quantity,
        notes: i.notes,
        selectedModifiers: i.selectedModifiers,
        itemTotal,
      };
    });

    const discount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableSubtotal * 0.085 * 100) / 100;
    const serviceCharge = tableNumber ? Math.round(taxableSubtotal * 0.05 * 100) / 100 : 0;
    const total = Math.round((taxableSubtotal + tax + serviceCharge) * 100) / 100;

    const changeDue = amountTendered && amountTendered > total ? Math.round((amountTendered - total) * 100) / 100 : 0;

    const orderNumber = `POS-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const order = await Order.create({
      orderNumber,
      organizationId: restaurant.organizationId,
      branchId,
      restaurantId: restaurant._id,
      customerName: customerName || 'Walk-in Guest',
      orderType: tableNumber ? OrderTypes.DINE_IN : OrderTypes.TAKEAWAY,
      tableNumber,
      items: processedItems,
      subtotal,
      discount,
      tax,
      serviceCharge,
      total,
      status: OrderStatuses.COMPLETED,
      paymentStatus: PaymentStatuses.COMPLETED,
      paymentMethod,
      notes,
      completedAt: new Date(),
    });

    // Reset table if dine-in
    if (tableNumber) {
      await Table.findOneAndUpdate(
        { branchId, tableNumber },
        { status: TableStatuses.AVAILABLE, currentOrderId: null }
      );
    }

    emitEvent(`branch_${branchId.toString()}`, 'pos_sale', order);

    return sendSuccess(
      res,
      {
        order,
        receipt: {
          orderNumber,
          date: new Date().toLocaleString(),
          cashier: req.user?.name || 'Staff',
          tableNumber: tableNumber || 'Counter',
          items: processedItems,
          subtotal,
          discount,
          tax,
          serviceCharge,
          total,
          paymentMethod,
          amountTendered: amountTendered || total,
          changeDue,
        },
      },
      'POS Transaction completed successfully',
      201
    );
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};
