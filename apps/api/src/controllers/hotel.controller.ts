import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel';
import { RoomType } from '../models/RoomType';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { BookingStatuses, HousekeepingStatuses, RoomStatuses } from '@haven/shared';

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ isActive: true }).sort({ starRating: -1 });
    return sendSuccess(res, hotels);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getHotelBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const hotel = await Hotel.findOne({ slug, isActive: true }).populate('branchId');
    if (!hotel) {
      return sendError(res, 'Hotel property not found', 404);
    }

    const roomTypes = await RoomType.find({ hotelId: hotel._id, isActive: true });
    return sendSuccess(res, { hotel, roomTypes });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const checkRoomAvailability = async (req: Request, res: Response) => {
  try {
    const { hotelId, checkInDate, checkOutDate } = req.query;
    if (!hotelId || !checkInDate || !checkOutDate) {
      return sendError(res, 'Hotel ID, check-in date, and check-out date are required.', 400);
    }

    const roomTypes = await RoomType.find({ hotelId, isActive: true });

    // Check overlapping bookings: booking.checkInDate < checkOutDate && booking.checkOutDate > checkInDate
    const overlappingBookings = await Booking.find({
      hotelId,
      status: { $in: [BookingStatuses.CONFIRMED, BookingStatuses.CHECKED_IN] },
      checkInDate: { $lt: checkOutDate as string },
      checkOutDate: { $gt: checkInDate as string },
    });

    const bookedCounts: Record<string, number> = {};
    for (const booking of overlappingBookings) {
      const typeId = booking.roomTypeId.toString();
      bookedCounts[typeId] = (bookedCounts[typeId] || 0) + 1;
    }

    const inDate = new Date(checkInDate as string);
    const outDate = new Date(checkOutDate as string);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

    const availability = roomTypes.map((rt) => {
      const booked = bookedCounts[rt._id.toString()] || 0;
      const total = rt.totalRooms || 5;
      const availableRooms = Math.max(0, total - booked);
      return {
        roomType: rt,
        isAvailable: availableRooms > 0,
        availableCount: availableRooms,
        nights,
        totalCost: rt.basePricePerNight * nights,
      };
    });

    return sendSuccess(res, availability);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      hotelId,
      roomTypeId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
    } = req.body;

    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return sendError(res, 'Room type not found', 404);
    }

    // Server-side concurrency check
    const overlapping = await Booking.countDocuments({
      hotelId,
      roomTypeId,
      status: { $in: [BookingStatuses.CONFIRMED, BookingStatuses.CHECKED_IN] },
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
    });

    if (overlapping >= (roomType.totalRooms || 5)) {
      return sendError(res, 'All rooms of this type are booked for the selected dates. Please choose another date range or room type.', 409);
    }

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const numberOfNights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
    const nightlyRate = roomType.basePricePerNight;
    const roomSubtotal = nightlyRate * numberOfNights;
    const tax = Math.round(roomSubtotal * 0.12 * 100) / 100;
    const totalAmount = roomSubtotal + tax;

    // Pick an available room number
    const occupiedRoomIds = await Booking.find({
      hotelId,
      roomTypeId,
      status: { $in: [BookingStatuses.CONFIRMED, BookingStatuses.CHECKED_IN] },
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
    }).distinct('roomId');

    const availableRoom = await Room.findOne({
      hotelId,
      roomTypeId,
      _id: { $nin: occupiedRoomIds },
    });

    const bookingNumber = `BKG-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;

    const booking = await Booking.create({
      bookingNumber,
      hotelId,
      roomTypeId,
      roomId: availableRoom?._id,
      roomNumber: availableRoom?.roomNumber || 'Assigned on arrival',
      customerId: req.user?.id,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfNights,
      nightlyRate,
      totalAmount,
      status: BookingStatuses.CONFIRMED,
      specialRequests,
      folioCharges: [
        {
          description: `${roomType.name} (${numberOfNights} night${numberOfNights > 1 ? 's' : ''})`,
          amount: roomSubtotal,
          date: new Date(),
          type: 'ROOM',
        },
        {
          description: 'Hospitality Tax (12%)',
          amount: tax,
          date: new Date(),
          type: 'TAX',
        },
      ],
    });

    return sendSuccess(res, booking, 'Hotel reservation confirmed!', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to make booking', 400);
  }
};

export const getHotelBookings = async (req: Request, res: Response) => {
  try {
    const { hotelId, status, date } = req.query;
    const filter: any = {};
    if (hotelId) filter.hotelId = hotelId;
    if (status) filter.status = status;
    if (date) {
      filter.checkInDate = { $lte: date };
      filter.checkOutDate = { $gte: date };
    }

    const bookings = await Booking.find(filter)
      .populate('roomTypeId', 'name')
      .sort({ checkInDate: 1 });

    return sendSuccess(res, bookings);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getCustomerBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('hotelId', 'name coverImage')
      .populate('roomTypeId', 'name images')
      .sort({ checkInDate: -1 });

    return sendSuccess(res, bookings);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const checkInGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return sendError(res, 'Booking not found', 404);

    booking.status = BookingStatuses.CHECKED_IN;
    booking.actualCheckIn = new Date();
    await booking.save();

    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, {
        status: RoomStatuses.OCCUPIED,
        currentBookingId: booking._id,
      });
    }

    return sendSuccess(res, booking, `Guest ${booking.guestName} successfully checked into room ${booking.roomNumber}.`);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const checkOutGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return sendError(res, 'Booking not found', 404);

    booking.status = BookingStatuses.CHECKED_OUT;
    booking.actualCheckOut = new Date();
    await booking.save();

    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, {
        status: RoomStatuses.AVAILABLE,
        housekeepingStatus: HousekeepingStatuses.DIRTY,
        currentBookingId: null,
      });
    }

    return sendSuccess(res, booking, `Guest ${booking.guestName} checked out. Room ${booking.roomNumber} marked dirty for housekeeping.`);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { hotelId, housekeepingStatus, status } = req.query;
    const filter: any = {};
    if (hotelId) filter.hotelId = hotelId;
    if (housekeepingStatus) filter.housekeepingStatus = housekeepingStatus;
    if (status) filter.status = status;

    const rooms = await Room.find(filter)
      .populate('roomTypeId', 'name')
      .populate('currentBookingId', 'guestName checkOutDate')
      .sort({ roomNumber: 1 });

    return sendSuccess(res, rooms);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const updateHousekeeping = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { housekeepingStatus, housekeepingNotes } = req.body;

    const updateData: any = { housekeepingStatus };
    if (housekeepingNotes !== undefined) updateData.housekeepingNotes = housekeepingNotes;
    if (housekeepingStatus === HousekeepingStatuses.CLEAN || housekeepingStatus === HousekeepingStatuses.INSPECTED) {
      updateData.lastCleanedAt = new Date();
    }

    const room = await Room.findByIdAndUpdate(id, updateData, { new: true });
    if (!room) return sendError(res, 'Room not found', 404);

    return sendSuccess(res, room, `Room ${room.roomNumber} housekeeping updated to ${housekeepingStatus}`);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};
