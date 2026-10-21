import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getBranchOrders,
  getCustomerOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRoles } from '@haven/shared';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/customer', authenticate, getCustomerOrders);
router.get('/branch', authenticate, requireRole(
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER,
  UserRoles.CASHIER,
  UserRoles.WAITER,
  UserRoles.KITCHEN_STAFF
), getBranchOrders);
router.get('/:id', optionalAuth, getOrderById);
router.patch(
  '/:id/status',
  authenticate,
  requireRole(
    UserRoles.RESTAURANT_OWNER,
    UserRoles.BRANCH_MANAGER,
    UserRoles.CASHIER,
    UserRoles.WAITER,
    UserRoles.KITCHEN_STAFF
  ),
  updateOrderStatus
);

export default router;
