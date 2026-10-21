import { Router } from 'express';
import { getOperationalReports } from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRoles } from '@haven/shared';

const router = Router();

router.use(authenticate, requireRole(
  UserRoles.RESTAURANT_OWNER,
  UserRoles.BRANCH_MANAGER,
  UserRoles.PLATFORM_ADMIN
));

router.get('/overview', getOperationalReports);

export default router;
