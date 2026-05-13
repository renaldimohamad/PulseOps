import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSnapshot() {
    const [services, totalLogs, totalIncidentsCount, activeIncidents, trend] = await Promise.all([
      this.prisma.service.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.latencyLog.count(),
      this.prisma.incident.count(),
      this.prisma.incident.findMany({
        where: { resolvedAt: null },
        include: { service: true },
        orderBy: { startedAt: 'desc' }
      }),
      this.getLatencyTrend(),
    ]);

    const overview = await this.calculateOverview(services, totalLogs, totalIncidentsCount, activeIncidents);
    const performanceSummary = await this.getPerformanceSummary();

    return {
      ...overview,
      services,
      trend,
      performanceSummary,
      activeIncidents,
      generatedAt: new Date().toISOString(),
      version: Date.now(),
    };
  }

  private async calculateOverview(services: any[], totalLogs: number, totalIncidentsCount: number, activeIncidents: any[]) {
    const totalServices = services.length;
    const criticalServices = services.filter(s => s.status === 'DOWN').length;
    const degradedServices = services.filter(s => s.status === 'DEGRADED').length;
    const healthyServices = services.filter(s => s.status === 'UP' || s.status === 'PROTECTED').length;

    const availability = totalServices > 0 ? (healthyServices / totalServices) * 100 : 100;
    
    const latencies = services.filter(s => s.latency !== null).map(s => s.latency!);
    const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
    const fastest = latencies.length > 0 ? Math.min(...latencies) : 0;
    const slowest = latencies.length > 0 ? Math.max(...latencies) : 0;

    const reliabilityScore = Math.max(0, availability - (activeIncidents.length * 5));
    
    let insight = 'Fleet is operating within normal parameters.';
    if (criticalServices > 0) {
      insight = `${criticalServices} endpoint${criticalServices > 1 ? 's' : ''} experiencing critical outage.`;
    } else if (degradedServices > 0) {
      insight = `${degradedServices} endpoint${degradedServices > 1 ? 's' : ''} showing signs of instability.`;
    } else if (avgLatency > 500) {
      insight = 'High average latency detected across the fleet.';
    }

    return {
      fleet: {
        totalServices,
        healthyServices,
        criticalServices,
        degradedServices,
        availability: Math.round(availability),
        status: criticalServices > 0 ? 'CRITICAL' : degradedServices > 0 ? 'DEGRADED' : 'OPERATIONAL'
      },
      performance: {
        averageLatency: avgLatency,
        fastestResponse: fastest,
        slowestResponse: slowest,
        responsiveness: avgLatency < 200 ? 'EXCELLENT' : avgLatency < 500 ? 'STABLE' : 'POOR'
      },
      incidents: {
        totalIncidents: totalIncidentsCount,
        activeIncidents: activeIncidents.length,
        severity: activeIncidents.length > 2 ? 'CRITICAL' : activeIncidents.length > 0 ? 'MEDIUM' : 'NONE'
      },
      telemetry: {
        latencyLogs: totalLogs,
        monitoringInterval: '10s',
        lastSync: new Date().toISOString()
      },
      intelligence: {
        reliabilityScore: Math.round(reliabilityScore),
        stabilityIndex: reliabilityScore > 90 ? 'HEALTHY' : reliabilityScore > 70 ? 'STABLE' : 'UNSTABLE',
        riskLevel: criticalServices > 0 ? 'HIGH' : degradedServices > 0 ? 'MEDIUM' : 'LOW',
        insight
      }
    };
  }

  async getPerformanceSummary() {
    const services = await this.prisma.service.findMany();
    const overview = await this.getOverview();
    const totalCount = services.length;
    const insufficientData = totalCount <= 1;

    const risks = services
      .filter(s => s.status === 'DOWN' || s.status === 'DEGRADED' || (s.latency && s.latency >= 1000))
      .sort((a, b) => {
        if (a.status === 'DOWN' && b.status !== 'DOWN') return -1;
        if (b.status === 'DOWN' && a.status !== 'DOWN') return 1;
        return (b.latency || 0) - (a.latency || 0);
      })
      .slice(0, 5)
      .map(s => ({
        ...s,
        insight: s.status === 'DOWN' ? 'Critical outage - Recovery required' :
                 (s.latency && s.latency >= 1500) ? 'Consecutive timeout failures' :
                 (s.latency && s.latency >= 1000) ? 'Latency threshold exceeded' :
                 'Degraded stability index'
      }));

    const riskIds = new Set(risks.map(s => s.id));
    const bestPerformers = services
      .filter(s => !riskIds.has(s.id) && (s.status === 'UP' || s.status === 'PROTECTED') && s.latency !== null && s.latency < 500)
      .sort((a, b) => (a.latency || 0) - (b.latency || 0))
      .slice(0, 5)
      .map(s => ({
        ...s,
        insight: s.latency! < 200 ? 'Excellent response profile' : 'Consistent performance'
      }));

    return {
      risks: insufficientData ? null : risks,
      bestPerformers: insufficientData ? null : bestPerformers,
      insufficientData,
      intelligence: {
        ...overview.intelligence,
        fleetStability: overview.intelligence.stabilityIndex
      }
    };
  }

  async getOverview() {
    const [services, totalLogs, totalIncidentsCount, activeIncidents] = await Promise.all([
      this.prisma.service.findMany(),
      this.prisma.latencyLog.count(),
      this.prisma.incident.count(),
      this.prisma.incident.findMany({
        where: { resolvedAt: null },
        include: { service: true }
      }),
    ]);
    return this.calculateOverview(services, totalLogs, totalIncidentsCount, activeIncidents);
  }

  async getHistory(timeframe: '1h' | '6h' | '24h' | '7d' = '24h') {
    const now = new Date();
    let startTime: Date;

    switch (timeframe) {
      case '1h': startTime = new Date(now.getTime() - 60 * 60 * 1000); break;
      case '6h': startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000); break;
      case '24h': startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
      case '7d': startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
    }

    const logs = await this.prisma.latencyLog.findMany({
      where: { timestamp: { gte: startTime } },
      orderBy: { timestamp: 'asc' },
    });

    const bucketCount = timeframe === '7d' ? 168 : timeframe === '24h' ? 24 : 60;
    const bucketSize = (now.getTime() - startTime.getTime()) / bucketCount;

    return Array.from({ length: bucketCount }, (_, i) => {
      const bucketStart = startTime.getTime() + i * bucketSize;
      const bucketEnd = bucketStart + bucketSize;
      const bucketLogs = logs.filter(l => l.timestamp.getTime() >= bucketStart && l.timestamp.getTime() < bucketEnd);
      
      return {
        timestamp: new Date(bucketStart).toISOString(),
        latency: bucketLogs.length > 0 
          ? Math.round(bucketLogs.reduce((a, b) => a + b.latency, 0) / bucketLogs.length) 
          : null
      };
    });
  }

  async getLatencyTrend() {
    return this.getHistory('24h');
  }

  async getIncidentsSummary() {
    return this.prisma.incident.findMany({
      take: 20,
      orderBy: { startedAt: 'desc' },
      include: { service: true },
    });
  }
}
