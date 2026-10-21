import { UserRole } from '../constants/roles';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  ReservationStatus,
  BookingStatus,
  RoomStatus,
  HousekeepingStatus,
  TableStatus,
} from '../constants/statuses';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  branchId?: string;
  hotelId?: string;
}

export interface MenuItemModifier {
  name: string;
  options: {
    name: string;
    price: number;
  }[];
}

export interface IMenuItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  restaurantId: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable: boolean;
  calories?: number;
  preparationTimeMinutes?: number;
  modifiers?: MenuItemModifier[];
  allergens?: string[];
}

export interface IOrderItemModifierChoice {
  modifierName: string;
  optionName: string;
  price: number;
}

export interface IOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  selectedModifiers?: IOrderItemModifierChoice[];
  itemTotal: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  organizationId: string;
  branchId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string;
  roomNumber?: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  placedAt: string;
  updatedAt: string;
}

export interface ITable {
  _id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  branchId: string;
  floorZone?: string;
  currentOrderId?: string;
  assignedWaiterId?: string;
}

export interface ITableReservation {
  _id: string;
  reservationNumber: string;
  organizationId: string;
  branchId: string;
  restaurantName?: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: number;
  reservationDate: string;
  timeSlot: string;
  tableNumber?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface IRoomType {
  _id: string;
  name: string;
  slug: string;
  hotelId: string;
  description: string;
  basePricePerNight: number;
  maxGuests: number;
  bedConfig: string;
  sizeSqFt: number;
  amenities: string[];
  images: string[];
}

export interface IRoom {
  _id: string;
  roomNumber: string;
  roomTypeId: string;
  hotelId: string;
  floor: number;
  status: RoomStatus;
  housekeepingStatus: HousekeepingStatus;
  currentBookingId?: string;
}

export interface IHotelBooking {
  _id: string;
  bookingNumber: string;
  hotelId: string;
  roomTypeId: string;
  roomId?: string;
  roomNumber?: string;
  customerId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  nightlyRate: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  folioCharges?: {
    description: string;
    amount: number;
    date: string;
    type: 'ROOM' | 'ROOM_SERVICE' | 'AMENITY' | 'TAX';
  }[];
  createdAt: string;
}

export interface IIngredient {
  _id: string;
  name: string;
  sku: string;
  organizationId: string;
  branchId: string;
  unit: string;
  currentStock: number;
  minimumThreshold: number;
  costPerUnit: number;
  supplierId?: string;
  lastRestockedAt?: string;
}
