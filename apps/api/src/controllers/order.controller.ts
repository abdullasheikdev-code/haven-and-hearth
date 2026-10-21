import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { MenuItem } from '../models/MenuItem';
import { Restaurant } from '../models/Restaurant';
import { Table } from '../models/Table';
import { Booking } from '../models/Booking';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { emitEvent } from '../sockets/socket';
import { OrderStatuses, OrderTypes, PaymentStatuses, TableStatuses } from '@haven/shared';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      restaurantId,
      branchId: reqBranchId,
      orderType,
      customerName,
      customerPhone,
      customerEmail,
      tableNumber,
      roomNumber,
      items,
      notes,
      paymentMethod,
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return sendError(res, 'Restaurant not found', 404);
    }

    const branchId = reqBranchId || restaurant.branchId;
    const organizationId = restaurant.organizationId;

    // Authoritative server-side price calculation
    const itemIds = items.map((i: any) => i.menuItemId);
    const dbMenuItems = await MenuItem.find({ _id: { $in: itemIds } });
    const menuItemMap = new Map(dbMenuItems.map((item) => [item._id.toString(), item]));

    let calculatedSubtotal = 0;
    const processedItems = items.map((item: any) => {
      const dbItem = menuItemMap.get(item.menuItemId.toString());
      if (!dbItem) {
        throw new Error(`Menu item with ID ${item.menuItemId} is not available.`);
      }

      let unitPrice = dbItem.price;
      let modifiersTotal = 0;

      if (item.selectedModifiers && Array.isArray(item.selectedModifiers)) {
        for (const mod of item.selectedModifiers) {
          modifiersTotal += mod.price || 0;
        }
      }

      const itemTotal = (unitPrice + modifiersTotal) * item.quantity;
      calculatedSubtotal += itemTotal;

      return {
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: unitPrice + modifiersTotal,
        quantity: item.quantity,
        notes: item.notes,
        selectedModifiers: item.selectedModifiers,
        itemTotal,
      };
    });

    const tax = Math.round(calculatedSubtotal * 0.085 * 100) / 100;
    const serviceCharge = orderType === OrderTypes.DINE_IN || orderType === OrderTypes.ROOM_SERVICE
      ? Math.round(calculatedSubtotal * 0.05 * 100) / 100
      : 0;
    const total = Math.round((calculatedSubtotal + tax + serviceCharge) * 100) / 100;

    // Generate unique human-readable order number: e.g. ORD-8492
    const orderNumber = `ORD-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    let hotelBookingId: any;
    if (orderType === OrderTypes.ROOM_SERVICE && roomNumber) {
      // Find active hotel booking for this room
      const activeBooking = await Booking.findOne({
        roomNumber,
        status: { $in: ['CONFIRMED', 'CHECKED_IN'] },
      });
      if (activeBooking) {
        hotelBookingId = activeBooking._id;
        // Append room charge to folio if billed to room
        if (paymentMethod === 'ROOM_CHARGE') {
          activeBooking.folioCharges.push({
            description: `In-Room Dining: ${orderNumber}`,
            amount: total,
            date: new Date(),
            type: 'ROOM_SERVICE',
            referenceId: orderNumber,
          });
          activeBooking.totalAmount += total;
          await activeBooking.save();
        }
      }
    }

    const order = await Order.create({
      orderNumber,
      organizationId,
      branchId,
      restaurantId: restaurant._id,
      customerId: req.user?.id,
      customerName: customerName || req.user?.name || 'Guest',
      customerPhone,
      customerEmail,
      orderType,
      tableNumber,
      roomNumber,
      hotelBookingId,
      items: processedItems,
      subtotal: calculatedSubtotal,
      tax,
      serviceCharge,
      total,
      status: OrderStatuses.PENDING,
      paymentStatus: paymentMethod === 'CASH' || paymentMethod === 'ROOM_CHARGE'
        ? PaymentStatuses.COMPLETED
        : PaymentStatuses.PENDING,
      paymentMethod,
      notes,
    });

    // Update table status if dine-in
    if (orderType === OrderTypes.DINE_IN && tableNumber) {
      await Table.findOneAndUpdate(
        { branchId, tableNumber },
        { status: TableStatuses.OCCUPIED, currentOrderId: order._id }
      );
    }

    // Broadcast real-time Socket.IO events to kitchen and branch staff
    emitEvent(`kitchen_${branchId.toString()}`, 'new_ticket', order);
    emitEvent(`branch_${branchId.toString()}`, 'order_created', order);

    return sendSuccess(res, order, 'Order created successfully', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to place order', 400);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('restaurantId', 'name coverImage');
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }
    return sendSuccess(res, order);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getBranchOrders = async (req: Request, res: Response) => {
  try {
    const { branchId, status, orderType } = req.query;
    const filter: any = {};
    if (branchId) filter.branchId = branchId;
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, orders);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const orders = await Order.find({ customerId: req.user.id })
      .populate('restaurantId', 'name coverImage')
      .sort({ createdAt: -1 });

    return sendSuccess(res, orders);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === OrderStatuses.ACCEPTED) updateData.acceptedAt = new Date();
      if (status === OrderStatuses.PREPARING) updateData.preparingAt = new Date();
      if (status === OrderStatuses.READY) updateData.readyAt = new Date();
      if (status === OrderStatuses.COMPLETED) updateData.completedAt = new Date();
      if (status === OrderStatuses.CANCELLED) updateData.cancelledAt = new Date();
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    // Release table if order was completed or cancelled
    if (
      order.orderType === OrderTypes.DINE_IN &&
      order.tableNumber &&
      (order.status === OrderStatuses.COMPLETED || order.status === OrderStatuses.CANCELLED)
    ) {
      await Table.findOneAndUpdate(
        { branchId: order.branchId, tableNumber: order.tableNumber },
        { status: TableStatuses.AVAILABLE, currentOrderId: null }
      );
    }

    // Emit live status update to both the kitchen and customer
    emitEvent(`kitchen_${order.branchId.toString()}`, 'order_updated', order);
    emitEvent(`branch_${order.branchId.toString()}`, 'order_updated', order);

    return sendSuccess(res, order, `Order status updated to ${status}`);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};
