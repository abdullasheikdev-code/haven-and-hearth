import { Router } from 'express';
import {
  getIngredients,
  createIngredient,
  recordStockMovement,
  getSuppliers,
  getPurchaseOrders,
  createPurchaseOrder,
  receivePurchaseOrder,
} from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRoles } from '@haven/shared';

const router = Router();

router.use(authenticate, requireRole(
  UserRoles.INVENTORY_MANAGER,
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER,
  UserRoles.KITCHEN_STAFF
));

router.get('/ingredients', getIngredients);
router.post('/ingredients', createIngredient);
router.post('/movements', recordStockMovement);
router.get('/suppliers', getSuppliers);
router.get('/purchases', getPurchaseOrders);
router.post('/purchases', createPurchaseOrder);
router.patch('/purchases/:id/receive', receivePurchaseOrder);

export default router;
