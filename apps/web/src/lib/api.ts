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

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // sends cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error?.message || data.message || 'An unexpected error occurred';
    throw new ApiClientError(errorMsg, response.status, data.error?.code, data.error?.details);
  }

  return data.data;
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
