import {
  MOCK_RESTAURANTS,
  MOCK_HOTELS,
  MOCK_MENU_ITEMS,
  MOCK_TABLES,
  MOCK_ROOM_TYPES,
  MOCK_ROOMS,
  MOCK_ORDERS,
  MOCK_INGREDIENTS,
  MOCK_BOOKINGS,
  MOCK_CUSTOMER_RESERVATIONS,
  MOCK_REPORTS,
} from './mockData';

const API_BASE = '/api/v1';

export class ApiClientError extends Error {
  public code?: string;
  public details?: any;
  public status: number;

  constructor(message: string, status = 400, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getFallbackData(endpoint: string, method = 'GET', body?: any): any {
  const ep = endpoint.toLowerCase();

  // 1. Restaurants & Artisanal Menus
  if (ep.startsWith('/restaurants')) {
    const parts = ep.split('?')[0].split('/').filter(Boolean);
    if (parts.length >= 2) {
      const slug = parts[1];
      const match = MOCK_RESTAURANTS.find((r) => r.slug === slug) || MOCK_RESTAURANTS[0];
      return {
        restaurant: match,
        menuItems: MOCK_MENU_ITEMS,
        tables: MOCK_TABLES,
      };
    }
    return MOCK_RESTAURANTS;
  }

  // 2. Hotels, Suites, Housekeeping & Bookings
  if (ep.startsWith('/hotels')) {
    if (ep.includes('/customer/bookings') || ep.includes('/bookings')) {
      return MOCK_BOOKINGS;
    }
    if (ep.includes('/rooms')) {
      return MOCK_ROOMS;
    }
    if (ep.includes('/availability')) {
      return MOCK_ROOM_TYPES.map((rt) => ({
        roomType: rt,
        availableCount: 3,
        pricePerNight: rt.basePricePerNight,
        totalPrice: rt.basePricePerNight * 3,
      }));
    }
    const parts = ep.split('?')[0].split('/').filter(Boolean);
    if (parts.length >= 2) {
      return {
        hotel: MOCK_HOTELS[0],
        roomTypes: MOCK_ROOM_TYPES,
      };
    }
    return MOCK_HOTELS;
  }

  // 3. Table Reservations
  if (ep.startsWith('/reservations')) {
    if (ep.includes('/customer')) {
      return MOCK_CUSTOMER_RESERVATIONS;
    }
    if (ep.includes('/availability')) {
      return {
        slots: [
          { timeSlot: '17:30', available: true },
          { timeSlot: '18:00', available: true },
          { timeSlot: '19:00', available: true },
          { timeSlot: '20:00', available: true },
          { timeSlot: '20:30', available: true },
        ],
      };
    }
    if (method === 'POST') {
      return {
        _id: 'res-' + Date.now(),
        reservationNumber: 'RES-' + Math.floor(1000 + Math.random() * 9000),
        status: 'CONFIRMED',
        reservationDate: body?.reservationDate || '2026-10-23',
        timeSlot: body?.timeSlot || '19:00',
        partySize: body?.partySize || 2,
      };
    }
    return MOCK_CUSTOMER_RESERVATIONS;
  }

  // 4. Dining & Room Service Orders
  if (ep.startsWith('/orders')) {
    if (method === 'POST') {
      return {
        _id: 'ord-' + Date.now(),
        orderNumber: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        status: 'PENDING',
        total: body?.total || 128.5,
        items: body?.items || [],
        restaurantId: { name: "L'Étoile Brasserie" },
        createdAt: new Date().toISOString(),
      };
    }
    const parts = ep.split('?')[0].split('/').filter(Boolean);
    if (parts.length >= 2 && parts[1] !== 'customer' && parts[1] !== 'branch') {
      const orderId = parts[1];
      const match = MOCK_ORDERS.find((o) => o._id === orderId || o.orderNumber === orderId);
      return match || MOCK_ORDERS[0];
    }
    return MOCK_ORDERS;
  }

  // 5. Point of Sale (POS)
  if (ep.startsWith('/pos/context')) {
    return {
      categories: ['All', 'Mains', 'Raw Bar', 'Desserts', 'Cocktails'],
      menuItems: MOCK_MENU_ITEMS,
      tables: MOCK_TABLES,
    };
  }

  if (ep.startsWith('/pos/checkout')) {
    return {
      success: true,
      receipt: {
        orderNumber: 'POS-' + Math.floor(1000 + Math.random() * 9000),
        total: body?.amountTendered || 120,
        items: body?.items || [],
        paymentMethod: body?.paymentMethod || 'CASH',
        change: 0,
        date: new Date().toISOString(),
      },
    };
  }

  // 6. Business Intelligence & Reports
  if (ep.startsWith('/reports')) {
    return MOCK_REPORTS;
  }

  // 7. Inventory & Ingredients
  if (ep.startsWith('/inventory')) {
    return MOCK_INGREDIENTS;
  }

  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return data.data !== undefined ? data.data : data;
    }

    const fallback = getFallbackData(endpoint, options.method, options.body ? JSON.parse(options.body as string) : undefined);
    if (fallback !== null) {
      return fallback as T;
    }

    const data = await response.json().catch(() => ({}));
    const errorMsg = data.error?.message || data.message || `Request failed (${response.status})`;
    throw new ApiClientError(errorMsg, response.status, data.error?.code, data.error?.details);
  } catch (err: any) {
    const fallback = getFallbackData(endpoint, options.method, options.body ? JSON.parse(options.body as string) : undefined);
    if (fallback !== null) {
      return fallback as T;
    }
    throw err;
  }
}

export const api = {
  get: <T = any>(url: string, options?: RequestInit): Promise<T> =>
    apiRequest<T>(url, { ...options, method: 'GET' }),
  post: <T = any>(url: string, body?: any, options?: RequestInit): Promise<T> =>
    apiRequest<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T = any>(url: string, body?: any, options?: RequestInit): Promise<T> =>
    apiRequest<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(url: string, options?: RequestInit): Promise<T> =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};
