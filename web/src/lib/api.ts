import { Service } from '../types/service';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const serviceApi = {
  getAll: async (params?: { category?: string; status?: string }) => {
    const url = new URL(`${BASE_URL}/services`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json() as Promise<Service[]>;
  },

  getOne: async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch service');
    return res.json() as Promise<Service>;
  },

  create: async (data: Partial<Service>) => {
    const res = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json() as Promise<Service>;
  },

  update: async (id: string, data: Partial<Service>) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json() as Promise<Service>;
  },

  delete: async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },
};
