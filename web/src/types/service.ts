export type ServiceStatus = 'UP' | 'DOWN' | 'PENDING' | 'UNKNOWN';

export interface Service {
  id: string;
  name: string;
  url: string;
  category: string;
  status: ServiceStatus;
  latency: number | null;
  rawStatus: number | null;
  lastError: string | null;
  lastChecked: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceStats {
  total: number;
  up: number;
  down: number;
  pending: number;
  unknown: number;
}
