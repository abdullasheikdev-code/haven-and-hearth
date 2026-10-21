import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantBySlug,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
} from '../controllers/restaurant.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRoles } from '@haven/shared';

const router = Router();

router.get('/', getRestaurants);
router.get('/menu-items', getMenuItems);
router.get('/:slug', getRestaurantBySlug);

// Staff/owner management routes
router.post(
  '/menu-items',
  authenticate,
  requireRole(UserRoles.RESTAURANT_OWNER, UserRoles.BRANCH_MANAGER),
  createMenuItem
);

router.patch(
  '/menu-items/:id',
  authenticate,
  requireRole(UserRoles.RESTAURANT_OWNER, UserRoles.BRANCH_MANAGER, UserRoles.KITCHEN_STAFF),
  updateMenuItem
);

export default router;
