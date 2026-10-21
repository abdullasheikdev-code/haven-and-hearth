import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const statusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return sendSuccess(res, {
    status: 'healthy',
    platform: 'Haven & Hearth Hospitality Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: statusMap[dbState] || 'unknown',
      name: mongoose.connection.name,
    },
  });
});

export default router;
