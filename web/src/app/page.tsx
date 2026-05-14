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
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-full overflow-x-hidden">

      {/* 1. TOP TIER: FLEET STATUS & PRIMARY TELEMETRY */}
      <ObservabilityOverview
        data={snapshot}
        isLoading={isLoading}
        lastUpdated={lastUpdatedAt}
        isFetching={isFetching}
      />

      {/* 2. SECOND TIER: INTELLIGENCE & ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Analytics Hub */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 min-w-0">
          <SecurityOverview
            stats={stats}
            reachableCount={reachableCount}
            averageLatency={performance.averageLatency}
            globalTrend={trendValues}
            perfSummary={performanceSummary}
          />

          {/* 3. SERVICE BREAKDOWN - INTEGRATED & COMPACT */}
          {services.length > 0 && (
            <div className="pt-8 border-t border-border/10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                  Infrastructure Node Breakdown
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.slice(0, 9).map((service, i) => (
                  <ServiceNodeCard key={service.id} service={service} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Activity Feed */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 w-full">
          <ActivityFeed events={activityEvents} />
        </div>
      </div>

    </div>
  );
}


