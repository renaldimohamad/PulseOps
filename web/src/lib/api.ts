import { Service } from '../types/service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BASE_URL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

if (!BASE_URL && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: NEXT_PUBLIC_API_URL is not defined in production environment.');
}



/**
 * Enhanced fetch wrapper with basic retry logic and error handling
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error: any) {
    if (retries > 0 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      // Small delay before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export const serviceApi = {
  getAll: async (params?: { category?: string; status?: string }) => {
    const url = new URL(`${BASE_URL}/services`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetchWithRetry(url.toString(), { cache: 'no-store' });
    return res.json() as Promise<Service[]>;
  },

  getOne: async (id: string) => {
    const res = await fetchWithRetry(`${BASE_URL}/services/${id}`, { cache: 'no-store' });
    return res.json() as Promise<Service>;
  },

  create: async (data: Partial<Service>) => {
    const res = await fetchWithRetry(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<Service>;
  },

  update: async (id: string, data: Partial<Service>) => {
    const res = await fetchWithRetry(`${BASE_URL}/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<Service>;
  },

  delete: async (id: string) => {
    const res = await fetchWithRetry(`${BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};

