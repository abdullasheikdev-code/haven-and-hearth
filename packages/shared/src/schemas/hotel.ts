import { z } from 'zod';

export const createBookingSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  roomTypeId: z.string().min(1, 'Room type ID is required'),
  guestName: z.string().min(2, 'Guest name is required'),
  guestEmail: z.string().email('Valid email is required'),
  guestPhone: z.string().min(6, 'Valid phone is required'),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in must be YYYY-MM-DD'),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out must be YYYY-MM-DD'),
  numberOfGuests: z.number().int().min(1).max(10),
  specialRequests: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const checkAvailabilitySchema = z.object({
  hotelId: z.string().min(1),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.coerce.number().int().min(1).default(1),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
