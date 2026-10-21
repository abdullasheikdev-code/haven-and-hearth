import {
  MOCK_RESTAURANTS,
  MOCK_HOTELS,
  MOCK_MENU_ITEMS,
  MOCK_TABLES,
  MOCK_ROOM_TYPES,
  MOCK_ORDERS,
  MOCK_INGREDIENTS,
  MOCK_BOOKINGS,
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

  if (ep.startsWith('/restaurants')) {
    if (ep.includes('/letoile-brasserie') || ep.includes('/aura-hearthfire') || ep.split('/').length > 2) {
      return {
        restaurant: MOCK_RESTAURANTS[0],
        menuItems: MOCK_MENU_ITEMS,
        tables: MOCK_TABLES,
      };
    }
    return MOCK_RESTAURANTS;
  }

  if (ep.startsWith('/hotels')) {
    if (ep.includes('/availability')) {
      return MOCK_ROOM_TYPES.map((rt) => ({
        roomType: rt,
        availableCount: 3,
        pricePerNight: rt.basePricePerNight,
        totalPrice: rt.basePricePerNight * 3,
      }));
    }
    if (ep.includes('/sovereign-estate') || ep.split('/').length > 2) {
      return {
        hotel: MOCK_HOTELS[0],
        roomTypes: MOCK_ROOM_TYPES,
      };
    }
    return MOCK_HOTELS;
  }

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

  if (ep.startsWith('/orders')) {
    if (method === 'POST') {
      return {
        _id: 'ord-' + Date.now(),
        orderNumber: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        status: 'PENDING',
        total: body?.total || 98.5,
        items: body?.items || [],
        createdAt: new Date().toISOString(),
      };
    }
    return MOCK_ORDERS;
  }

  if (ep.startsWith('/reservations/availability')) {
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

  if (ep.startsWith('/reservations')) {
    return {
      _id: 'res-' + Date.now(),
      reservationNumber: 'RES-' + Math.floor(1000 + Math.random() * 9000),
      status: 'CONFIRMED',
      reservationDate: body?.reservationDate || '2026-10-23',
      timeSlot: body?.timeSlot || '19:00',
      partySize: body?.partySize || 2,
    };
  }

  if (ep.startsWith('/inventory')) {
    return MOCK_INGREDIENTS;
  }

  if (ep.startsWith('/hotel/bookings')) {
    return MOCK_BOOKINGS;
  }

  if (ep.startsWith('/hotel/housekeeping')) {
    return [
      { _id: 'rm1', roomNumber: '201', floor: 2, status: 'CLEAN', roomTypeId: { name: 'Sovereign Terrace Suite' } },
      { _id: 'rm2', roomNumber: '202', floor: 2, status: 'DIRTY', roomTypeId: { name: 'Sovereign Terrace Suite' } },
      { _id: 'rm3', roomNumber: '301', floor: 3, status: 'IN_PROGRESS', roomTypeId: { name: 'The Mercer Grand Penthouse' } },
      { _id: 'rm4', roomNumber: '302', floor: 3, status: 'INSPECTED', roomTypeId: { name: 'The Mercer Grand Penthouse' } },
    ];
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

    // If server responds with valid JSON
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return data.data !== undefined ? data.data : data;
    }

    // If static host returns 404 or method not allowed, attempt fallback data
    const fallback = getFallbackData(endpoint, options.method, options.body ? JSON.parse(options.body as string) : undefined);
    if (fallback !== null) {
      return fallback as T;
    }

    const data = await response.json().catch(() => ({}));
    const errorMsg = data.error?.message || data.message || `Request failed (${response.status})`;
    throw new ApiClientError(errorMsg, response.status, data.error?.code, data.error?.details);
  } catch (err: any) {
    // If network error (offline, CORS, static host file not found)
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
