import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Booking } from '../models/Booking';
import { TableReservation } from '../models/TableReservation';
import { Ingredient } from '../models/Ingredient';
import { Room } from '../models/Room';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { OrderStatuses, PaymentStatuses, RoomStatuses } from '@haven/shared';

export const getOperationalReports = async (req: Request, res: Response) => {
  try {
    const { branchId, hotelId } = req.query;

    const orderFilter: any = {
      status: { $ne: OrderStatuses.CANCELLED },
      paymentStatus: PaymentStatuses.COMPLETED,
    };
    if (branchId) orderFilter.branchId = branchId;

    // 1. Overall revenue & count
    const orders = await Order.find(orderFilter);
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = orders.length > 0 ? Math.round((totalSales / orders.length) * 100) / 100 : 0;

    // 2. Sales by Channel
    const channelSales: Record<string, { count: number; total: number }> = {};
    for (const order of orders) {
      if (!channelSales[order.orderType]) {
        channelSales[order.orderType] = { count: 0, total: 0 };
      }
      channelSales[order.orderType].count += 1;
      channelSales[order.orderType].total += order.total;
    }

    // 3. Top selling items
    const itemSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const order of orders) {
      for (const item of order.items) {
        const id = item.name;
        if (!itemSales[id]) {
          itemSales[id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        itemSales[id].quantity += item.quantity;
        itemSales[id].revenue += item.itemTotal;
      }
    }
    const topDishes = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 4. Hotel Occupancy & Revenue
    const bookingFilter: any = { status: { $in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] } };
    if (hotelId) bookingFilter.hotelId = hotelId;

    const bookings = await Booking.find(bookingFilter);
    const hotelRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const roomFilter: any = {};
    if (hotelId) roomFilter.hotelId = hotelId;
    const totalRooms = await Room.countDocuments(roomFilter);
    const occupiedRooms = await Room.countDocuments({ ...roomFilter, status: RoomStatuses.OCCUPIED });
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // 5. Reservations
    const reservationFilter: any = {};
    if (branchId) reservationFilter.branchId = branchId;
    const totalReservations = await TableReservation.countDocuments(reservationFilter);

    // 6. Inventory Valuation
    const ingredientFilter: any = {};
    if (branchId) ingredientFilter.branchId = branchId;
    const ingredients = await Ingredient.find(ingredientFilter);
    const inventoryValuation = Math.round(
      ingredients.reduce((sum, ing) => sum + ing.currentStock * ing.costPerUnit, 0) * 100
    ) / 100;
    const lowStockAlerts = ingredients.filter((ing) => ing.currentStock <= ing.minimumThreshold).length;

    return sendSuccess(res, {
      sales: {
        totalSales: Math.round(totalSales * 100) / 100,
        orderCount: orders.length,
        averageOrderValue,
      },
      channelSales,
      topDishes,
      hotel: {
        totalRevenue: Math.round(hotelRevenue * 100) / 100,
        bookingCount: bookings.length,
        totalRooms,
        occupiedRooms,
        occupancyRate,
      },
      reservations: {
        totalReservations,
      },
      inventory: {
        totalIngredients: ingredients.length,
        inventoryValuation,
        lowStockAlerts,
      },
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
