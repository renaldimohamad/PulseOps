import { Service } from '../types/service';
import { CONFIG } from './config';

/**
 * Standardized API client with detailed production debugging.
 */
async function fetchWithRetry(path: string, options: RequestInit = {}, retries = 2) {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${CONFIG.API_URL}${cleanPath}`;
  const requestId = Math.random().toString(36).substring(7);

  // LOG: Log every fetch call in production for debugging loops
  console.log(`[PulseOps API] [${requestId}] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    });


    if (!response.ok) {
      // LOG: Log error details
      const errorText = await response.text().catch(() => 'No error body');
      console.error(`[PulseOps API] [${requestId}] Error ${response.status}:`, errorText);
      
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {}
      
      throw new Error(errorMessage);
    }

    return response;
  } catch (error: any) {
    console.error(`[PulseOps API] [${requestId}] Exception:`, error.message);
    
    // Retry logic only for network errors
    if (retries > 0 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      console.warn(`[PulseOps API] [${requestId}] Retrying in 1s... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(path, options, retries - 1);
    }
    throw error;
  }
}

export const serviceApi = {
  getAll: async (params?: { category?: string; status?: string }) => {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      const q = searchParams.toString();
      if (q) query = `?${q}`;
    }

    const res = await fetchWithRetry('/services' + query, { cache: 'no-store' });
    return res.json() as Promise<Service[]>;
  },

  getOne: async (id: string) => {
    const res = await fetchWithRetry(`/services/${id}`, { cache: 'no-store' });
    return res.json() as Promise<Service>;
  },

  create: async (data: Partial<Service>) => {
    const res = await fetchWithRetry('/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<Service>;
  },

  update: async (id: string, data: Partial<Service>) => {
    const res = await fetchWithRetry(`/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<Service>;
  },

  delete: async (id: string) => {
    const res = await fetchWithRetry(`/services/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
