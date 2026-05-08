import { ServiceStatus } from '@prisma/client';

export class ServiceEventPayload {
  id: string;
  name: string;
  status: ServiceStatus;
  latency: number | null;
  lastChecked: Date | null;
}

export enum ServiceEvents {
  CREATED = 'service.created',
  UPDATED = 'service.updated',
  DELETED = 'service.deleted',
  STATUS_CHANGED = 'service.statusChanged',
}
