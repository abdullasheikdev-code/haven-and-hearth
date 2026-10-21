import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUser } from '@haven/shared';

export const signToken = (payload: AuthUser): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): AuthUser => {
  return jwt.verify(token, env.JWT_SECRET) as AuthUser;
};
