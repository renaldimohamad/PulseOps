'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi, analyticsApi, incidentsApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import { MetricCard } from '@/components/dashboard/metric-card';
import { SecurityOverview } from '@/components/dashboard/security-overview';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Card } from '@/components/ui/card';
import { Activity, CheckCircle2, XCircle, Clock, ShieldCheck, Zap, Server, Globe, AlertCircle } from 'lucide-react';
import { Service, ServiceStats, AnalyticsOverview, LatencyTrendPoint, Incident, DashboardSnapshot } from '@/types/service';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/relative-time';
import { useI18n } from '@/lib/i18n';
import { LatencyTrendChart } from '@/components/dashboard/charts/latency-trend-chart';
import { ObservabilityOverview } from '@/components/dashboard/observability-overview';
import { ServiceNodeCard } from '@/components/dashboard/service-node-card';
import { useRef } from 'react';

export default function Dashboard() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const latestVersion = useRef<number>(0);

  // 1. UNIFIED SNAPSHOT FETCHING (SINGLE SOURCE OF TRUTH)
  const {
    data: snapshot,
    isLoading,
    dataUpdatedAt: lastUpdatedAt,
    isFetching
  } = useQuery<DashboardSnapshot>({
    queryKey: ['analytics', 'snapshot'],
    queryFn: () => analyticsApi.getSnapshot(),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  // 2. REALTIME INTEGRATION (UNIFIED REFRESH)
  useEffect(() => {
    const handleRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'snapshot'] });
    };

    socket.on('service.updated', handleRefresh);
    socket.on('analytics.updated', (data) => {
      // VERSION GUARD: Only accept newer snapshots
      if (data.version > latestVersion.current) {
        latestVersion.current = data.version;
        queryClient.setQueryData(['analytics', 'snapshot'], data);
      }
    });
    socket.on('incident.created', handleRefresh);
    socket.on('incident.resolved', handleRefresh);

    return () => {
      socket.off('service.updated');
      socket.off('analytics.updated');
      socket.off('incident.created');
      socket.off('incident.resolved');
    };
  }, [queryClient]);

  if (isLoading || !snapshot) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl w-full" />
      </div>
    );
  }

  // 3. SNAPSHOT-BASED DERIVED DATA (NO CALCULATIONS)
  const { fleet, performance, telemetry, intelligence, services, trend, performanceSummary, activeIncidents } = snapshot;

  const stats: ServiceStats = {
    total: fleet.totalServices,
    up: fleet.healthyServices,
    down: fleet.criticalServices,
    degraded: fleet.degradedServices,
    protected: 0,
    pending: 0,
    unknown: 0,
  };

  const trendValues = trend.map(p => p.latency || 0);
  const reachableCount = services.filter(s => s.status !== 'DOWN' && s.status !== 'UNKNOWN').length;

  const activityEvents = activeIncidents.map(inc => ({
    id: inc.id,
    serviceName: inc.service?.name || t('common.unknown_service'),
    type: inc.status as any,
    timestamp: new Date(inc.startedAt),
    message: inc.message,
  }));

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-x-hidden">

      {/* 1. COMPREHENSIVE OBSERVABILITY OVERVIEW */}
      <ObservabilityOverview
        data={snapshot}
        isLoading={isLoading}
        lastUpdated={lastUpdatedAt}
        isFetching={isFetching}
      />

      {/* 2. CORE INTELLIGENCE ENGINE (ANALYTICS & ACTIVITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* <div className="lg:col-span-4 sticky top-40"> */}
        <div className="lg:col-span-12">

          <ActivityFeed events={activityEvents} />

        </div>
        <div className="lg:col-span-12">
          <SecurityOverview
            stats={stats}
            reachableCount={reachableCount}
            averageLatency={performance.averageLatency}
            globalTrend={trendValues}
            perfSummary={performanceSummary}
          />
        </div>
      </div>


      {/* 3. SERVICE BREAKDOWN (GRANULAR TELEMETRY) */}
      {/* <div className="pt-10 border-t border-border/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">{t('dashboard.breakdown.title')}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-40">{t('dashboard.breakdown.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-muted/20 border border-border/40 backdrop-blur-md">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                {t('dashboard.breakdown.live_monitoring', { count: services.length })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceNodeCard key={service.id} service={service} index={i} />
          ))}

          {services.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border/20 rounded-[3rem] opacity-40">
              <div className="flex flex-col items-center gap-3">
                <Activity className="h-10 w-10 text-muted-foreground animate-pulse" />
                <p className="text-sm font-bold uppercase tracking-widest">{t('dashboard.breakdown.no_services')}</p>
              </div>
            </div>
          )}
        </div>
      </div> */}
    </div >
  );
}

