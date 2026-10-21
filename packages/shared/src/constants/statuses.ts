export const OrderTypes = {
  DINE_IN: 'DINE_IN',
  TAKEAWAY: 'TAKEAWAY',
  DELIVERY: 'DELIVERY',
  ROOM_SERVICE: 'ROOM_SERVICE',
} as const;

export type OrderType = (typeof OrderTypes)[keyof typeof OrderTypes];

export const OrderStatuses = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  SERVED: 'SERVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatuses)[keyof typeof OrderStatuses];

export const TableStatuses = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  RESERVED: 'RESERVED',
  DIRTY: 'DIRTY',
} as const;

export type TableStatus = (typeof TableStatuses)[keyof typeof TableStatuses];

export const ReservationStatuses = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SEATED: 'SEATED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type ReservationStatus = (typeof ReservationStatuses)[keyof typeof ReservationStatuses];

export const RoomStatuses = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED',
} as const;

export type RoomStatus = (typeof RoomStatuses)[keyof typeof RoomStatuses];

export const HousekeepingStatuses = {
  CLEAN: 'CLEAN',
  DIRTY: 'DIRTY',
  IN_PROGRESS: 'IN_PROGRESS',
  INSPECTED: 'INSPECTED',
} as const;

export type HousekeepingStatus = (typeof HousekeepingStatuses)[keyof typeof HousekeepingStatuses];

export const BookingStatuses = {
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = (typeof BookingStatuses)[keyof typeof BookingStatuses];

export const PaymentMethods = {
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
  ONLINE_SANDBOX: 'ONLINE_SANDBOX',
  ROOM_CHARGE: 'ROOM_CHARGE',
} as const;

export type PaymentMethod = (typeof PaymentMethods)[keyof typeof PaymentMethods];

export const PaymentStatuses = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PaymentStatuses)[keyof typeof PaymentStatuses];

export const StockMovementTypes = {
  PURCHASE: 'PURCHASE',
  USAGE: 'USAGE',
  WASTAGE: 'WASTAGE',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export type StockMovementType = (typeof StockMovementTypes)[keyof typeof StockMovementTypes];
