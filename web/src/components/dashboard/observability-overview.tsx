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
      pulse: 'bg-success'
    },
    DEGRADED: {
      border: 'border-warning/20',
      bg: 'bg-warning/5',
      text: 'text-warning',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
      pulse: 'bg-warning'
    },
    CRITICAL: {
      border: 'border-danger/20',
      bg: 'bg-danger/5',
      text: 'text-danger',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
      pulse: 'bg-danger'
    }
  }[fleet.status];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* 1. FAILS SAFE LAYER (NOTIFICATIONS) */}
      <div className="space-y-4">
        {isInactive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-warning/10 border border-warning/20 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-warning backdrop-blur-xl shadow-lg ring-1 ring-warning/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/20 rounded-2xl animate-pulse">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black uppercase tracking-tight">{t('dashboard.observability.data_stream_inactive')}</p>
                <p className="text-[11px] opacity-70 font-bold">{t('dashboard.observability.data_stream_inactive_desc')}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full md:w-auto px-6 py-2.5 bg-warning/20 hover:bg-warning/30 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-warning/20 active:scale-95"
            >
              {t('dashboard.observability.force_refresh')}
            </button>
          </motion.div>
        )}
      </div>

      {/* 2. PRIMARY STATUS & INTELLIGENCE (60% ROLE) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">

        {/* Main Status Hub - Balanced, not over-dominant */}
        <div className={cn(
          "xl:col-span-7 p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between shadow-premium min-w-0 transition-all duration-500",
          statusTheme.border,
          statusTheme.bg,
          statusTheme.glow
        )}>
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 -rotate-12">
            <ShieldCheck size={200} strokeWidth={0.5} />
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between relative z-10 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                  <ShieldCheck size={28} className={statusTheme.text} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block">{t('dashboard.observability.fleet_status')}</span>
                  <div className="flex items-center gap-3">
                    <h1 className={cn("text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none", statusTheme.text)}>
                      {fleet.status}
                    </h1>
                    <div className={cn("h-3 w-3 rounded-full animate-pulse shadow-[0_0_15px_currentcolor]", statusTheme.pulse)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block">{t('dashboard.observability.fleet_availability')}</span>
                <div className="flex items-baseline gap-2">
                  <Counter value={fleet.availability} className="text-5xl md:text-6xl font-black tracking-tighter tabular-nums text-foreground/90" />
                  <span className="text-xl font-bold opacity-20">%</span>
                </div>
                <div className="w-full max-w-[280px] h-2 bg-foreground/5 rounded-full overflow-hidden p-0.5 border border-foreground/[0.03]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fleet.availability}%` }}
                    className={cn("h-full rounded-full", statusTheme.pulse)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 self-end md:self-auto">
              {isFetching ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
                  <RefreshCw size={10} className="animate-spin text-brand-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-500">{t('common.syncing')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10">
                  <div className={cn("h-1.5 w-1.5 rounded-full", isStale ? "bg-warning" : "bg-success")} />
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{t('dashboard.activity.live')}</span>
                </div>
              )}
              <div className="text-right">
                <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-1">{t('services.table.last_checked')}</p>
                <RelativeTime
                  date={lastUpdated ? new Date(lastUpdated) : new Date(telemetry.lastSync)}
                  className="text-[11px] font-mono font-bold tabular-nums opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Card - Contextual Analysis (30% ROLE) */}
        <div className="xl:col-span-5 p-8 md:p-10 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-2xl flex flex-col justify-between shadow-premium group min-w-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 ring-1 ring-brand-500/20 shadow-inner">
                  <ActivityIcon size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">{t('dashboard.observability.operational_insight')}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-foreground/[0.03] border border-foreground/5">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">v1.1.2</span>
              </div>
            </div>
            <p className="text-sm md:text-base font-bold leading-relaxed text-foreground/80 tracking-tight">
              {intelligence.insight}
            </p>
          </div>

          <div className="pt-8 border-t border-border/10 flex items-center justify-between gap-10">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.observability.risk_level')}</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[12px] font-black uppercase tracking-widest",
                  intelligence.riskLevel === 'HIGH' ? 'text-danger' : intelligence.riskLevel === 'MEDIUM' ? 'text-warning' : 'text-success'
                )}>{intelligence.riskLevel}</span>
                <div className={cn("h-1.5 w-1.5 rounded-full", intelligence.riskLevel === 'HIGH' ? 'bg-danger' : intelligence.riskLevel === 'MEDIUM' ? 'bg-warning' : 'bg-success')} />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.observability.stability_index')}</span>
              <span className="text-[14px] font-mono font-black text-foreground/80 tabular-nums">{intelligence.stabilityIndex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE & TELEMETRY (30% ROLE) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: t('dashboard.observability.total_services'), value: fleet.totalServices, icon: Server, color: 'text-brand-500', bg: 'bg-brand-500/5' },
          { label: t('dashboard.observability.healthy'), value: fleet.healthyServices, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5' },
          { label: t('dashboard.observability.critical'), value: fleet.criticalServices, icon: XCircle, color: 'text-danger', bg: 'bg-danger/5' },
          { label: t('dashboard.observability.degraded'), value: fleet.degradedServices, icon: Clock, color: 'text-warning', bg: 'bg-warning/5' },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-6 md:p-8 rounded-[2rem] border border-border/20 bg-card/20 backdrop-blur-xl group hover:border-current transition-all duration-500 flex flex-col justify-between shadow-sm",
              stat.color
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10", stat.color)}>
                <stat.icon size={20} strokeWidth={2} />
              </div>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block">{stat.label}</span>
              <Counter value={stat.value} className="text-3xl md:text-4xl font-black tracking-tighter tabular-nums text-foreground/90" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. RESPONSE DYNAMICS (SECONDARY PERFORMANCE - 10% ROLE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
        {[
          { label: t('dashboard.observability.avg_latency'), value: performance.averageLatency, suffix: 'ms', type: 'avg' },
          { label: t('dashboard.observability.fastest_response'), value: performance.fastestResponse, suffix: 'ms', type: 'fast' },
          { label: t('dashboard.observability.slowest_response'), value: performance.slowestResponse, suffix: 'ms', type: 'slow' },
        ].map((p, i) => (
          <div key={i} className="px-6 py-5 rounded-[1.75rem] border border-border/40 bg-card/10 backdrop-blur-md flex items-center justify-between shadow-sm border-l-4 border-l-current transition-all hover:bg-card/20">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 block">{p.label}</span>
              <div className="flex items-baseline gap-1.5">
                <Counter value={p.value} className="text-2xl font-black tracking-tighter tabular-nums text-foreground/80" />
                <span className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">{p.suffix}</span>
              </div>
            </div>
            <div className={cn(
              "h-10 w-10 flex items-center justify-center rounded-xl",
              p.type === 'fast' ? "text-success bg-success/5" :
                p.type === 'slow' ? "text-danger bg-danger/5" :
                  "text-warning bg-warning/5"
            )}>
              <Zap size={18} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      {/* 5. TELEMETRY AUDIT LAYER (META-INFO) */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-10 border-t border-border/10 gap-10 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-2xl bg-brand-500/5 text-brand-500 border border-brand-500/10 shadow-inner">
            <RefreshCw size={18} className="animate-spin" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">{t('dashboard.observability.telemetry_stream_active')}</span>
            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Latency Probe v2.4 • Non-Blocking</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(14,145,233,0.5)]" />
            <span>{t('dashboard.observability.logs_ingested', { count: telemetry.latencyLogs.toLocaleString() })}</span>
          </div>
          <div className="h-4 w-[1px] bg-border/20 hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span>{t('dashboard.observability.pacing', { interval: telemetry.monitoringInterval })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
