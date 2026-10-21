import { Router } from 'express';
import {
  checkTableAvailability,
  createReservation,
  getBranchReservations,
  getCustomerReservations,
  updateReservationStatus,
} from '../controllers/reservation.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateRequest } from '../middleware/validate';
import { createReservationSchema, UserRoles } from '@haven/shared';

const router = Router();

router.get('/availability', checkTableAvailability);
router.post('/', optionalAuth, validateRequest(createReservationSchema), createReservation);
router.get('/customer', authenticate, getCustomerReservations);
router.get(
  '/branch',
  authenticate,
  requireRole(UserRoles.RESTAURANT_OWNER, UserRoles.BRANCH_MANAGER, UserRoles.WAITER, UserRoles.CASHIER),
  getBranchReservations
);
router.patch(
  '/:id/status',
  authenticate,
  requireRole(UserRoles.RESTAURANT_OWNER, UserRoles.BRANCH_MANAGER, UserRoles.WAITER, UserRoles.CASHIER),
  updateReservationStatus
);

export default router;
