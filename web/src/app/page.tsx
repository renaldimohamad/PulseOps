'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import { MetricCard } from '@/components/dashboard/metric-card';
import { SecurityOverview } from '@/components/dashboard/security-overview';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Card } from '@/components/ui/card';
import { Activity, CheckCircle2, XCircle, Clock, ShieldCheck, Zap, Server } from 'lucide-react';
import { Service, ServiceStats } from '@/types/service';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ActivityEvent {
  id: string;
  serviceName: string;
  type: 'UP' | 'DOWN' | 'PENDING' | 'PROTECTED' | 'UNKNOWN';
  timestamp: Date;
  message: string;
}

import { useI18n } from '@/lib/i18n';

export default function Dashboard() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: events = [] } = useQuery<ActivityEvent[]>({
    queryKey: ['events'],
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll(),
  });

  const stats: ServiceStats = useMemo(() => ({
    total: services?.length || 0,
    up: services?.filter((s) => s.status === 'UP').length || 0,
    down: services?.filter((s) => s.status === 'DOWN').length || 0,
    pending: services?.filter((s) => s.status === 'PENDING').length || 0,
    unknown: services?.filter((s) => s.status === 'UNKNOWN').length || 0,
    protected: services?.filter((s) => s.status === 'PROTECTED').length || 0,
    degraded: services?.filter((s) => s.status === 'DEGRADED').length || 0,
  }), [services]);

  // Avg Latency Calculation: Only include UP and PROTECTED services with valid latency > 0
  const averageLatency = useMemo(() => {
    if (!services || services.length === 0) return 0;

    const activeServices = services.filter((s) =>
      (s.status === 'UP' || s.status === 'PROTECTED') &&
      s.latency !== null &&
      s.latency !== undefined &&
      Number(s.latency) > 0
    );

    if (activeServices.length === 0) return 0;

    const sum = activeServices.reduce((acc, s) => acc + Number(s.latency || 0), 0);
    const avg = Math.round(sum / activeServices.length);

    // Debug log for verification
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Latency Debug] Total Active: ${activeServices.length}, Sum: ${sum}, Avg: ${avg}ms`);
      console.table(activeServices.map(s => ({ name: s.name, status: s.status, latency: s.latency })));
    }

    return avg;
  }, [services]);

  if (isLoading) {
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

  const healthyCount = stats.up + stats.protected;
  const healthScore = stats.total > 0 ? Math.round((healthyCount / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-full overflow-x-hidden">
      {/* Live Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-border pb-6 md:pb-8">
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-foreground leading-tight">
              {t('dashboard.title')}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <span className="pulse-dot">
                  <span className="pulse-dot-inner"></span>
                  <span className="pulse-dot-main bg-success/80"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-success/70">{t('dashboard.activity.live')}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
                <div className="h-1 w-1 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500/70">Socket v2.4</span>
              </div>
            </div>
          </div>
          <p className="text-[12px] md:text-16 font-medium text-foreground/50 leading-relaxed max-w-xl">
            {t('dashboard.subtitle')}
            <span className="hidden sm:inline"> {t('dashboard.tracking', { count: stats.total })}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 bg-muted/20 backdrop-blur-md p-1.5 md:p-2 rounded-2xl border border-border/40 w-full lg:w-auto overflow-x-auto scrollbar-hide">
          <div className="flex-1 lg:flex-none px-4 py-2.5 border-r border-border/40 min-w-[140px]">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5">{t('dashboard.system_health')}</div>
            <div className="flex items-center gap-2.5">
              <div className="font-mono text-xl md:text-2xl font-semibold text-foreground/90">{healthScore}%</div>
              <div className="h-1.5 w-12 rounded-full overflow-hidden bg-muted/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  className={cn(
                    "h-full rounded-full",
                    healthScore > 90 ? "bg-success/80" : healthScore > 70 ? "bg-warning/80" : "bg-danger/80"
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 lg:flex-none px-4 py-2.5 min-w-[140px]">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5">{t('dashboard.active_clusters')}</div>
            <div className="font-mono text-xl md:text-2xl font-semibold text-brand-600/80 flex items-center gap-2.5">
              <Server size={18} className="opacity-60" /> 04
            </div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('dashboard.metrics.total_endpoints')}
          value={stats.total}
          icon={Activity}
          color="text-brand-600"
          trend={t('common.active')}
          description={stats.total > 0 ? t('dashboard.metrics.total_endpoints_desc') : t('dashboard.metrics.no_endpoints')}
          statusIndicator="info"
        />
        <MetricCard
          title={t('dashboard.metrics.operational')}
          value={stats.up}
          icon={CheckCircle2}
          color="text-success"
          trend={t('common.stable')}
          description={t('dashboard.metrics.operational_desc', { count: stats.up })}
          statusIndicator="success"
        />
        <MetricCard
          title={t('dashboard.metrics.critical_alerts')}
          value={stats.down}
          icon={XCircle}
          color="text-danger"
          trend={stats.down > 0 ? t('dashboard.metrics.critical_alerts') : t('common.none')}
          description={stats.down > 0 ? t('dashboard.metrics.critical_desc', { count: stats.down }) : t('dashboard.metrics.no_disruption')}
          statusIndicator={stats.down > 0 ? "danger" : "success"}
        />
        <MetricCard
          title={t('dashboard.metrics.avg_latency')}
          value={averageLatency}
          suffix="ms"
          icon={Zap}
          color="text-warning"
          trend={averageLatency === 0 ? t('common.no_data') : averageLatency < 200 ? t('common.excellent') : averageLatency < 500 ? t('common.healthy') : averageLatency < 800 ? t('common.degraded') : t('common.critical')}
          description={t('dashboard.metrics.latency_desc')}
          statusIndicator={averageLatency === 0 ? 'info' : averageLatency < 500 ? 'success' : averageLatency < 800 ? 'warning' : 'danger'}
        />
      </div>

      {/* Operational Context Bar */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3 rounded-2xl border border-border/40 bg-muted/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{t('dashboard.operational_context.monitoring_active')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{t('dashboard.operational_context.socket_connected')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-muted-foreground/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{t('dashboard.operational_context.sync_now')}</span>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 italic">{t('dashboard.operational_context.version')}</span>
        </div>
      </div>
      {/* Main Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SecurityOverview />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed events={events} />
        </div>
      </div>
    </div>
  );
}

