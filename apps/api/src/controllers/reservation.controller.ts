import { Request, Response } from 'express';
import { TableReservation } from '../models/TableReservation';
import { Restaurant } from '../models/Restaurant';
import { Table } from '../models/Table';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { ReservationStatuses, TableStatuses } from '@haven/shared';

export const checkTableAvailability = async (req: Request, res: Response) => {
  try {
    const { restaurantId, date, partySize } = req.query;
    if (!restaurantId || !date) {
      return sendError(res, 'Restaurant ID and date (YYYY-MM-DD) are required', 400);
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return sendError(res, 'Restaurant not found', 404);
    }

    // Default slots
    const availableSlots = [
      '12:00', '12:30', '13:00', '13:30', '14:00',
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
    ];

    // Find booked reservations on this date
    const existingReservations = await TableReservation.find({
      restaurantId,
      reservationDate: date,
      status: { $in: [ReservationStatuses.CONFIRMED, ReservationStatuses.SEATED] },
    });

    const bookedSlotsCount = existingReservations.reduce((acc: Record<string, number>, r) => {
      acc[r.timeSlot] = (acc[r.timeSlot] || 0) + 1;
      return acc;
    }, {});

    // Tables in this branch
    const totalTables = await Table.countDocuments({ branchId: restaurant.branchId });
    const capacityPerSlot = Math.max(totalTables || 8, 8);

    const slotAvailability = availableSlots.map((slot) => {
      const booked = bookedSlotsCount[slot] || 0;
      return {
        timeSlot: slot,
        available: booked < capacityPerSlot,
        remainingTables: Math.max(0, capacityPerSlot - booked),
      };
    });

    return sendSuccess(res, {
      date,
      slots: slotAvailability,
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerEmail,
      partySize,
      reservationDate,
      timeSlot,
      specialRequests,
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return sendError(res, 'Restaurant not found', 404);
    }

    // Check if table slot is available
    const existingCount = await TableReservation.countDocuments({
      restaurantId,
      reservationDate,
      timeSlot,
      status: { $in: [ReservationStatuses.CONFIRMED, ReservationStatuses.SEATED] },
    });

    const totalTables = await Table.countDocuments({ branchId: restaurant.branchId });
    if (existingCount >= (totalTables || 8)) {
      return sendError(res, 'The selected time slot is fully booked. Please choose an alternative time.', 409);
    }

    // Find candidate available table
    const table = await Table.findOne({
      branchId: restaurant.branchId,
      capacity: { $gte: partySize },
      status: TableStatuses.AVAILABLE,
    });

    const reservationNumber = `RES-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const reservation = await TableReservation.create({
      reservationNumber,
      organizationId: restaurant.organizationId,
      branchId: restaurant.branchId,
      restaurantId: restaurant._id,
      customerId: req.user?.id,
      customerName,
      customerPhone,
      customerEmail,
      partySize,
      reservationDate,
      timeSlot,
      tableNumber: table?.tableNumber,
      specialRequests,
      status: ReservationStatuses.CONFIRMED,
    });

    return sendSuccess(res, reservation, 'Table reservation confirmed!', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to make table reservation', 400);
  }
};

export const getBranchReservations = async (req: Request, res: Response) => {
  try {
    const { branchId, date, status } = req.query;
    const filter: any = {};
    if (branchId) filter.branchId = branchId;
    if (date) filter.reservationDate = date;
    if (status) filter.status = status;

    const reservations = await TableReservation.find(filter)
      .populate('restaurantId', 'name')
      .sort({ reservationDate: -1, timeSlot: 1 });

    return sendSuccess(res, reservations);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getCustomerReservations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const reservations = await TableReservation.find({ customerId: req.user.id })
      .populate('restaurantId', 'name coverImage')
      .sort({ reservationDate: -1 });

    return sendSuccess(res, reservations);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, tableNumber } = req.body;

    const updateData: any = { status };
    if (tableNumber) updateData.tableNumber = tableNumber;
    if (status === ReservationStatuses.SEATED) updateData.seatedAt = new Date();
    if (status === ReservationStatuses.COMPLETED) updateData.completedAt = new Date();
    if (status === ReservationStatuses.CANCELLED) updateData.cancelledAt = new Date();

    const reservation = await TableReservation.findByIdAndUpdate(id, updateData, { new: true });
    if (!reservation) {
      return sendError(res, 'Reservation not found', 404);
    }

    if (status === ReservationStatuses.SEATED && reservation.tableNumber) {
      await Table.findOneAndUpdate(
        { branchId: reservation.branchId, tableNumber: reservation.tableNumber },
        { status: TableStatuses.OCCUPIED }
      );
    }

    return sendSuccess(res, reservation, `Reservation status changed to ${status}`);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};
