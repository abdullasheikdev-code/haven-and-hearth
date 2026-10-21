import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { sendError } from './utils/apiResponse';

// Route imports
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';
import orderRoutes from './routes/order.routes';
import reservationRoutes from './routes/reservation.routes';
import hotelRoutes from './routes/hotel.routes';
import posRoutes from './routes/pos.routes';
import inventoryRoutes from './routes/inventory.routes';
import reportsRoutes from './routes/reports.routes';

export const createApp = (): Express => {
  const app = express();

  // Security headers & CORS
  app.use(helmet());
  app.use(
    cors({
      origin: [env.CLIENT_URL, env.CORS_ORIGIN, 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate limiter for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { success: false, error: { message: 'Too many login attempts. Please try again in 15 minutes.' } },
  });
  app.use('/api/v1/auth/login', authLimiter);

  // Mount API modules under /api/v1
  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/restaurants', restaurantRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/reservations', reservationRoutes);
  app.use('/api/v1/hotels', hotelRoutes);
  app.use('/api/v1/pos', posRoutes);
  app.use('/api/v1/inventory', inventoryRoutes);
  app.use('/api/v1/reports', reportsRoutes);

  // 404 Catch-all
  app.use((_req, res) => {
    return sendError(res, 'The requested API route was not found.', 404, null, 'NOT_FOUND');
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
