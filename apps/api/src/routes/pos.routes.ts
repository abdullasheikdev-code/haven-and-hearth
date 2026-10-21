import { Router } from 'express';
import { getPosMenuAndTables, processPosCheckout } from '../controllers/pos.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRoles } from '@haven/shared';

const router = Router();

router.use(authenticate, requireRole(
  UserRoles.CASHIER,
  UserRoles.WAITER,
  UserRoles.BRANCH_MANAGER,
  UserRoles.RESTAURANT_OWNER
));

router.get('/context', getPosMenuAndTables);
router.post('/checkout', processPosCheckout);

export default router;
