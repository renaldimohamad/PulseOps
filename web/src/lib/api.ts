import { Service } from '../types/service';
import { CONFIG } from './config';

/**
 * Global fetch lock to prevent duplicate simultaneous requests.
 */
const pendingRequests = new Map<string, Promise<Response>>();

/**
 * Standardized API client with detailed production debugging and request deduplication.
 */
async function fetchWithRetry(path: string, options: RequestInit = {}, retries = 2): Promise<Response> {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${CONFIG.API_URL}${cleanPath}`;
  const method = options.method || 'GET';
  const requestKey = `${method}:${url}`;

  // GUARD: Centralized deduplication for GET requests to prevent infinite fetch loops
  if (method === 'GET' && pendingRequests.has(requestKey)) {
    if (!CONFIG.IS_PROD) console.log(`🛡️ [PulseOps API] Deduplicating active request: ${requestKey}`);
    return pendingRequests.get(requestKey)!;
  }

  const requestId = Math.random().toString(36).substring(7);
  
  // LOG: Only log in development
  if (!CONFIG.IS_PROD) console.log(`[PulseOps API] [${requestId}] ${method} ${url}`);

  const requestPromise = (async () => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      if (!CONFIG.IS_PROD) console.log(`[PulseOps API] [${requestId}] Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // LOG: Log error details
        const errorText = await response.text().catch(() => 'No error body');
        console.error(`❌ [PulseOps API] [${requestId}] Error ${response.status}:`, errorText);
        
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {}
        
        throw new Error(errorMessage);
      }

      return response;
    } catch (error: any) {
      console.error(`⚠️ [PulseOps API] [${requestId}] Exception:`, error.message);
      
      // Retry logic only for network errors
      if (retries > 0 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        if (!CONFIG.IS_PROD) console.warn(`🔄 [PulseOps API] [${requestId}] Retrying in 1.5s... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return fetchWithRetry(path, options, retries - 1);
      }
      throw error;
    } finally {
      // Release the lock
      if (method === 'GET') {
        pendingRequests.delete(requestKey);
      }
    }
  })();

  if (method === 'GET') {
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
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
