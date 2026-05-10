'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import { MetricCard } from '@/components/dashboard/metric-card';
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
    initialData: [],
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll(),
  });

  const stats: ServiceStats = {
    total: services?.length || 0,
    up: services?.filter((s) => s.status === 'UP').length || 0,
    down: services?.filter((s) => s.status === 'DOWN').length || 0,
    pending: services?.filter((s) => s.status === 'PENDING').length || 0,
    unknown: services?.filter((s) => s.status === 'UNKNOWN').length || 0,
  };

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

  const healthScore = stats.total > 0 ? Math.round((stats.up / stats.total) * 100) : 0;
  const servicesWithLatency = services?.filter((s) => s.latency !== undefined && s.latency !== null) || [];
  const averageLatency = servicesWithLatency.length > 0
    ? Math.round(servicesWithLatency.reduce((acc, s) => acc + (s.latency || 0), 0) / servicesWithLatency.length)
    : 0;

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-full overflow-x-hidden">
      {/* Live Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-border pb-6 md:pb-8">
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-foreground leading-tight">
              {t('dashboard.title')}
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <span className="pulse-dot">
                <span className="pulse-dot-inner"></span>
                <span className="pulse-dot-main bg-success/80"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-success/70">{t('dashboard.activity.live')}</span>
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
          trend="+2 this week"
        />
        <MetricCard
          title={t('dashboard.metrics.operational')}
          value={stats.up}
          icon={CheckCircle2}
          color="text-success"
          trend="Stable"
        />
        <MetricCard
          title={t('dashboard.metrics.critical_alerts')}
          value={stats.down}
          icon={XCircle}
          color="text-danger"
          trend={stats.down > 0 ? "Immediate Action" : "None"}
        />
        <MetricCard
          title={t('dashboard.metrics.avg_latency')}
          value={averageLatency}
          icon={Zap}
          color="text-warning"
          trend={averageLatency < 300 ? "Excellent" : averageLatency < 800 ? "Normal" : "High Latency"}
        />
      </div>

      {/* Main Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/40 shadow-sm bg-card/40 backdrop-blur-xl h-full min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center p-8 md:p-12 text-center group overflow-hidden">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-500/5 blur-[80px] scale-150 rounded-full group-hover:bg-brand-500/10 transition-colors" />
              <div className="relative h-20 w-20 md:h-24 md:w-24 bg-card/50 rounded-[2rem] shadow-sm border border-border/60 flex items-center justify-center text-brand-600 group-hover:rotate-6 transition-transform duration-500">
                <ShieldCheck size={40} className="md:w-12 md:h-12" strokeWidth={1.2} />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground/90 mb-3 uppercase tracking-tight">{t('dashboard.security.title')}</h3>
            <p className="text-[14px] font-medium text-foreground/40 max-w-sm mb-10 text-center mx-auto leading-relaxed">
              {t('dashboard.security.subtitle')}
              <br />
              <span className="text-[12px] opacity-60 mt-2 block italic">{t('dashboard.security.telemetry_hint')}</span>
            </p>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1.5 w-8 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    animate={{ x: [-32, 32] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="h-full w-4 bg-brand-500/30"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed events={events} />
        </div>
      </div>
    </div>

  );
}

