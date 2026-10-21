import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app';
import { env } from '../src/config/env';

const app = createApp();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('API Health Checks', () => {
  it('GET /api/v1/health should return 200 with platform status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.platform).toContain('Haven & Hearth');
    expect(res.body.data.database.status).toBe('connected');
  });
});

describe('Authentication & Authorization', () => {
  it('POST /api/v1/auth/login should authenticate valid demo user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@havenandhearth.com',
        password: 'HavenDemo2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('RESTAURANT_OWNER');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/v1/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@havenandhearth.com',
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/pos/context should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/pos/context');
    expect(res.status).toBe(401);
  });
});

describe('Restaurant & Menu Endpoints', () => {
  it('GET /api/v1/restaurants should return active restaurants list', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/restaurants/letoile-brasserie should return restaurant details with menu', async () => {
    const res = await request(app).get('/api/v1/restaurants/letoile-brasserie');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.restaurant.name).toBe("L'Étoile Brasserie");
    expect(Array.isArray(res.body.data.menuItems)).toBe(true);
  });
});

describe('Table Reservation Availability', () => {
  it('GET /api/v1/reservations/availability should return slot status', async () => {
    const restaurantRes = await request(app).get('/api/v1/restaurants/letoile-brasserie');
    const restaurantId = restaurantRes.body.data.restaurant._id;

    const res = await request(app).get(`/api/v1/reservations/availability?restaurantId=${restaurantId}&date=2026-10-25`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slots).toBeDefined();
    expect(res.body.data.slots.length).toBeGreaterThan(0);
  });
});

describe('Hotel & Stays Endpoints', () => {
  it('GET /api/v1/hotels should return boutique hotel properties', async () => {
    const res = await request(app).get('/api/v1/hotels');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].starRating).toBe(5);
  });
});
