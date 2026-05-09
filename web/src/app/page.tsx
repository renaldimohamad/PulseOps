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

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Live Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-border pb-6 md:pb-8">
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              {t('dashboard.title')}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success glow-green"></span>
              </span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-success">{t('dashboard.activity.live')}</span>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl leading-relaxed">
            {t('dashboard.subtitle')}
            <span className="hidden sm:inline"> {t('dashboard.tracking', { count: stats.total })}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 bg-card/50 backdrop-blur-sm p-1.5 md:p-2 rounded-2xl border border-border w-full lg:w-auto overflow-hidden">
          <div className="flex-1 lg:flex-none px-3 md:px-4 py-2 border-r border-border">
            <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t('dashboard.system_health')}</div>
            <div className="flex items-center gap-2">
              <div className="text-xl md:text-2xl font-black tracking-tighter text-foreground">{healthScore}%</div>
              <div className="h-1.5 w-10 md:h-2 md:w-12 rounded-full overflow-hidden bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  className={cn(
                    "h-full rounded-full",
                    healthScore > 90 ? "bg-success" : healthScore > 70 ? "bg-warning" : "bg-danger"
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 lg:flex-none px-3 md:px-4 py-2">
            <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t('dashboard.active_clusters')}</div>
            <div className="text-xl md:text-2xl font-black tracking-tighter text-brand-600 flex items-center gap-2">
              <Server size={18} className="md:w-5 md:h-5" /> 04
            </div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          value={124}
          icon={Zap}
          color="text-warning"
          trend="-12ms"
        />
      </div>

      {/* Main Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-premium bg-card/70 backdrop-blur-xl h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center group">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-500/10 blur-3xl scale-150 rounded-full group-hover:bg-brand-500/20 transition-colors" />
              <div className="relative h-24 w-24 bg-card rounded-[2rem] shadow-premium border border-border flex items-center justify-center text-brand-600 group-hover:rotate-12 transition-transform duration-500">
                <ShieldCheck size={48} strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-foreground mb-3 uppercase">{t('dashboard.security.title')}</h3>
            <p className="text-muted-foreground font-medium max-w-sm mb-8">
              {t('dashboard.security.subtitle')}
              <br />
              {t('dashboard.security.telemetry_hint')}
            </p>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1.5 w-8 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    animate={{ x: [-32, 32] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="h-full w-4 bg-brand-500/20"
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

