export type ServiceStatus = 'UP' | 'DOWN' | 'PENDING' | 'UNKNOWN' | 'PROTECTED' | 'DEGRADED';

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
  protected: number;
  degraded: number;
}

export interface Incident {
  id: string;
  serviceId: string;
  status: ServiceStatus;
  message: string;
  snapshot: any;
  startedAt: string;
  resolvedAt: string | null;
  service?: Service;
}

export interface DashboardSnapshot extends AnalyticsOverview {
  services: Service[];
  trend: LatencyTrendPoint[];
  performanceSummary: any;
  activeIncidents: Incident[];
  generatedAt: string;
  version: number;
}

export interface AnalyticsOverview {
  fleet: {
    totalServices: number;
    healthyServices: number;
    criticalServices: number;
    degradedServices: number;
    availability: number;
    status: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL';
  };
  performance: {
    averageLatency: number;
    fastestResponse: number;
    slowestResponse: number;
    responsiveness: 'EXCELLENT' | 'STABLE' | 'POOR';
  };
  incidents: {
    totalIncidents: number;
    activeIncidents: number;
    severity: 'NONE' | 'MEDIUM' | 'CRITICAL';
  };
  telemetry: {
    latencyLogs: number;
    monitoringInterval: string;
    lastSync: string;
  };
  intelligence: {
    reliabilityScore: number;
    stabilityIndex: 'HEALTHY' | 'STABLE' | 'UNSTABLE';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    insight: string;
  };
}

export interface LatencyTrendPoint {
  timestamp: string;
  latency: number | null;
}
