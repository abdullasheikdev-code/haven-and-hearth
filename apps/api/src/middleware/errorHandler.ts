import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/apiResponse';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[Unhandled Error]', err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `A record with this ${field} already exists.`, 409, null, 'DUPLICATE_KEY');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return sendError(res, 'Database validation error', 422, messages, 'DB_VALIDATION_ERROR');
  }

  // Fallback 500 error
  const message = env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message;
  return sendError(res, message, 500, env.NODE_ENV === 'development' ? err.stack : undefined, 'INTERNAL_SERVER_ERROR');
};
