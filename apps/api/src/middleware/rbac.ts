import { Request, Response, NextFunction } from 'express';
import { UserRole, UserRoles } from '@haven/shared';
import { sendError } from '../utils/apiResponse';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401, null, 'UNAUTHENTICATED');
    }

    if (req.user.role === UserRoles.PLATFORM_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        'Access denied: You do not have permission to perform this action.',
        403,
        null,
        'FORBIDDEN'
      );
    }

    next();
  };
};

export const requireBranchAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  if (req.user.role === UserRoles.PLATFORM_ADMIN || req.user.role === UserRoles.RESTAURANT_OWNER) {
    return next();
  }

  const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;

  if (requestedBranchId && req.user.branchId && req.user.branchId !== requestedBranchId) {
    return sendError(
      res,
      'Access restricted: You cannot access data outside your assigned branch.',
      403,
      null,
      'BRANCH_ACCESS_DENIED'
    );
  }

  next();
};
