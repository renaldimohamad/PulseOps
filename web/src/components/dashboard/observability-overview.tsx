'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Server,
  ArrowUpRight,
  Clock,
  RefreshCw,
  XCircle,
  ActivityIcon
} from 'lucide-react';
import { AnalyticsOverview } from '@/types/service';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { RelativeTime } from '@/components/ui/relative-time';
import { Counter } from './metric-card';
import { AvailabilityGauge } from './charts/availability-gauge';

interface ObservabilityOverviewProps {
  data?: AnalyticsOverview;
  isLoading?: boolean;
  lastUpdated?: number;
  isFetching?: boolean;
}

export const ObservabilityOverview = ({ data, isLoading, lastUpdated, isFetching }: ObservabilityOverviewProps) => {
  const { t } = useI18n();
  const [isStale, setIsStale] = useState(false);
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const diff = Date.now() - lastUpdated;
        setIsStale(diff > 15000);
        setIsInactive(diff > 30000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (isLoading || !data) return null;

  const { fleet, performance, telemetry, intelligence } = data;

  const statusTheme = {
    OPERATIONAL: {
      border: 'border-success/20',
      bg: 'bg-success/5',
      text: 'text-success',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.1)]',
      pulse: 'bg-success',
      pulseHex: '#10b981'
    },
    DEGRADED: {
      border: 'border-warning/20',
      bg: 'bg-warning/5',
      text: 'text-warning',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
      pulse: 'bg-warning',
      pulseHex: '#f59e0b'
    },
    CRITICAL: {
      border: 'border-danger/20',
      bg: 'bg-danger/5',
      text: 'text-danger',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
      pulse: 'bg-danger',
      pulseHex: '#ef4444'
    }
  }[fleet.status];

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-1000 overflow-hidden">

      {/* 1. FAILS SAFE LAYER (NOTIFICATIONS) */}
      {isInactive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-warning/10 border border-warning/20 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-warning backdrop-blur-xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg animate-pulse">
              <AlertTriangle size={18} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-black uppercase tracking-tight">{t('dashboard.observability.data_stream_inactive')}</p>
              <p className="text-[10px] opacity-70 font-bold">{t('dashboard.observability.data_stream_inactive_desc')}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full md:w-auto px-4 py-2 bg-warning/20 hover:bg-warning/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-warning/20 active:scale-95"
          >
            {t('dashboard.observability.force_refresh')}
          </button>
        </motion.div>
      )}

      {/* 2. PRIMARY STATUS & INTELLIGENCE HEADER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

        {/* Main Status Hub */}
        <div className={cn(
          "xl:col-span-8 p-5 md:p-6 rounded-xl border backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between shadow-premium transition-all duration-500",
          statusTheme.border,
          statusTheme.bg,
          statusTheme.glow
        )}>
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] scale-125 -rotate-12 pointer-events-none">
            <ShieldCheck size={160} strokeWidth={0.5} />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between relative z-10 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                  <ShieldCheck size={22} className={statusTheme.text} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 block">{t('dashboard.observability.fleet_status')}</span>
                  <div className="flex items-center gap-2">
                    <h1 className={cn("text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none", statusTheme.text)}>
                      {fleet.status}
                    </h1>
                    <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_12px_currentcolor]", statusTheme.pulse)} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 block">{t('dashboard.observability.fleet_availability')}</span>
                  <div className="flex items-baseline gap-1.5">
                    <Counter value={fleet.availability} className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums text-foreground/90" />
                    <span className="text-lg font-bold opacity-20">%</span>
                  </div>
                </div>
                <div className="w-[140px] md:w-[180px] shrink-0">
                  <AvailabilityGauge value={fleet.availability} color={(statusTheme as any).pulseHex} />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 self-end md:self-auto">
              {isFetching ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  <RefreshCw size={8} className="animate-spin text-brand-500" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-brand-500">{t('common.syncing')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 border border-foreground/10">
                  <div className={cn("h-1 w-1 rounded-full", isStale ? "bg-warning" : "bg-success")} />
                  <span className="text-[7px] font-black uppercase tracking-widest opacity-40">{t('dashboard.activity.live')}</span>
                </div>
              )}
              <div className="text-right">
                <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-0.5">{t('services.table.last_checked')}</p>
                <RelativeTime
                  date={lastUpdated ? new Date(lastUpdated) : new Date(telemetry.lastSync)}
                  className="text-[10px] font-mono font-bold tabular-nums opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Card - Contextual Analysis */}
        <div className="xl:col-span-4 p-5 md:p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-2xl flex flex-col justify-between shadow-premium group min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 ring-1 ring-brand-500/20 shadow-inner">
                  <ActivityIcon size={18} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">{t('dashboard.observability.operational_insight')}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-foreground/[0.03] border border-foreground/5">
                <span className="text-[7px] font-black uppercase tracking-[0.1em] opacity-30">v1.1.2</span>
              </div>
            </div>
            <p className="text-xs md:text-sm font-bold leading-relaxed text-foreground/80 tracking-tight">
              {intelligence.insight}
            </p>
          </div>

          <div className="pt-6 border-t border-border/10 flex items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.observability.risk_level')}</span>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  intelligence.riskLevel === 'HIGH' ? 'text-danger' : intelligence.riskLevel === 'MEDIUM' ? 'text-warning' : 'text-success'
                )}>{intelligence.riskLevel}</span>
                <div className={cn("h-1 w-1 rounded-full", intelligence.riskLevel === 'HIGH' ? 'bg-danger' : intelligence.riskLevel === 'MEDIUM' ? 'bg-warning' : 'bg-success')} />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.observability.stability_index')}</span>
              <span className="text-[12px] font-mono font-black text-foreground/80 tabular-nums">{intelligence.stabilityIndex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE & TELEMETRY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.observability.total_services'), value: fleet.totalServices, icon: Server, color: 'text-brand-500', bg: 'bg-brand-500/5' },
          { label: t('dashboard.observability.healthy'), value: fleet.healthyServices, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5' },
          { label: t('dashboard.observability.critical'), value: fleet.criticalServices, icon: XCircle, color: 'text-danger', bg: 'bg-danger/5' },
          { label: t('dashboard.observability.degraded'), value: fleet.degradedServices, icon: Clock, color: 'text-warning', bg: 'bg-warning/5' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={cn(
              "p-4 md:p-5 rounded-xl border border-border/20 bg-card/20 backdrop-blur-xl group hover:border-current transition-all duration-500 flex flex-col justify-between shadow-sm",
              stat.color
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10", stat.color)}>
                <stat.icon size={16} strokeWidth={2} />
              </div>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase tracking-[0.1em] opacity-40 block">{stat.label}</span>
              <Counter value={stat.value} className="text-2xl md:text-3xl font-black tracking-tighter tabular-nums text-foreground/90" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. RESPONSE DYNAMICS & META STRIP */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="flex-1 grid grid-cols-3 gap-4">
          {[
            { label: t('dashboard.observability.avg_latency'), value: performance.averageLatency, suffix: 'ms', type: 'avg' },
            { label: t('dashboard.observability.fastest_response'), value: performance.fastestResponse, suffix: 'ms', type: 'fast' },
            { label: t('dashboard.observability.slowest_response'), value: performance.slowestResponse, suffix: 'ms', type: 'slow' },
          ].map((p, i) => (
            <div key={i} className="px-4 py-3 rounded-xl border border-border/40 bg-card/10 backdrop-blur-md flex items-center justify-between shadow-sm border-l-2 border-l-current transition-all hover:bg-card/20 min-w-0">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 block truncate">{p.label}</span>
                <div className="flex items-baseline gap-1">
                  <Counter value={p.value} className="text-lg font-black tracking-tighter tabular-nums text-foreground/80" />
                  <span className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest">{p.suffix}</span>
                </div>
              </div>
              <div className={cn(
                "h-7 w-7 flex items-center justify-center rounded-lg flex-shrink-0",
                p.type === 'fast' ? "text-success bg-success/5" :
                  p.type === 'slow' ? "text-danger bg-danger/5" :
                    "text-warning bg-warning/5"
              )}>
                <Zap size={14} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-auto flex items-center gap-4 px-5 py-3 rounded-xl border border-border/10 bg-brand-500/5 text-brand-500/60 transition-opacity">
          <RefreshCw size={14} className="animate-spin flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-500">{t('dashboard.observability.telemetry_stream_active')}</span>
            <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">Probe v2.4 • Non-Blocking</p>
          </div>
        </div>
      </div>
    </div>
  );
};
