import { Router } from 'express';
import {
  getHotels,
  getHotelBySlug,
  checkRoomAvailability,
  createBooking,
  getHotelBookings,
  getCustomerBookings,
  checkInGuest,
  checkOutGuest,
  getRooms,
  updateHousekeeping,
} from '../controllers/hotel.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateRequest } from '../middleware/validate';
import { createBookingSchema, UserRoles } from '@haven/shared';

const router = Router();

router.get('/', getHotels);
router.get('/availability', checkRoomAvailability);
router.get('/customer/bookings', authenticate, getCustomerBookings);
router.get('/rooms', authenticate, requireRole(
  UserRoles.HOTEL_RECEPTIONIST,
  UserRoles.HOUSEKEEPING_STAFF,
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER
), getRooms);
router.get('/bookings', authenticate, requireRole(
  UserRoles.HOTEL_RECEPTIONIST,
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER
), getHotelBookings);
router.patch('/bookings/:id/checkin', authenticate, requireRole(
  UserRoles.HOTEL_RECEPTIONIST,
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER
), checkInGuest);
router.patch('/bookings/:id/checkout', authenticate, requireRole(
  UserRoles.HOTEL_RECEPTIONIST,
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER
), checkOutGuest);
router.patch('/rooms/:id/housekeeping', authenticate, requireRole(
  UserRoles.HOUSEKEEPING_STAFF,
  UserRoles.HOTEL_RECEPTIONIST,
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER
), updateHousekeeping);
router.get('/:slug', getHotelBySlug);
router.post('/bookings', optionalAuth, validateRequest(createBookingSchema), createBooking);

export default router;
