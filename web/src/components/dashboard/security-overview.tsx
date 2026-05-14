'use client';

import { Zap, ArrowUpRight, ArrowDownRight, ShieldCheck, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { Service, ServiceStats } from '@/types/service';
import { LatencyTrendChart } from './charts/latency-trend-chart';
import { ServiceHealthDonut } from './charts/service-health-donut';
import { PerformanceLeaderboard } from './performance-leaderboard';
import { Counter } from './metric-card';

interface InfrastructureIntelligenceProps {
  stats: ServiceStats;
  reachableCount: number;
  averageLatency: number;
  services?: Service[];
  globalTrend?: number[];
  perfSummary?: {
    risks: (Service & { insight: string })[] | null;
    bestPerformers: (Service & { insight: string })[] | null;
    insufficientData: boolean;
    intelligence: {
      minLatency: number;
      maxLatency: number;
      avgLatency: number;
      varianceSpread: number;
      reliabilityScore: number;
      fleetStability: string;
      responsivenessScore: number;
    };
  };
}

export const SecurityOverview = ({
  stats,
  averageLatency,
  globalTrend = [],
  perfSummary
}: InfrastructureIntelligenceProps) => {
  const { t } = useI18n();

  const insufficientData = perfSummary?.insufficientData ?? stats.total < 2;
  const intelligence = perfSummary?.intelligence;

  // Calculated Metrics
  const uptimeRate = stats.total > 0 ? ((stats.up / stats.total) * 100).toFixed(2) : "0.00";
  const stabilityScore = intelligence?.reliabilityScore ?? (stats.total > 0
    ? Math.round(((stats.up * 1 + stats.degraded * 0.5) / stats.total) * 100)
    : 0);

  const minLat = intelligence?.minLatency || 0;
  const maxLat = intelligence?.maxLatency || 0;

  // Real-time Insight Generation
  const getDynamicInsight = () => {
    if (stats.down > 0) return t('dashboard.insights.critical_outage', { count: stats.down });
    if (stats.degraded > 0) return t('dashboard.insights.degraded_warning', { count: stats.degraded });
    if (averageLatency > 500) return t('dashboard.insights.high_latency');
    if (averageLatency > 0) return t('dashboard.insights.optimal_health');
    return t('dashboard.insights.collecting_data');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. INTELLIGENCE LAYER (ANALYTICS HUB) */}
      <Card className="relative overflow-hidden border border-border/40 bg-card/30 backdrop-blur-2xl group shadow-premium rounded-2xl">
        <div className="p-6 md:p-8 flex flex-col h-full gap-8">

          {/* Header & Contextual Insights */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 ring-1 ring-brand-500/20 shadow-inner">
                <Zap size={20} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight uppercase">
                  {t('dashboard.security.intelligence')}
                </h3>
                <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">
                  {t('dashboard.security.fleet_engine')}
                </p>
              </div>
            </div>

            <div className="max-w-xl w-full lg:w-auto">
              <div className="px-4 py-2 rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center gap-3">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
                </div>
                <p className="text-[10px] font-black text-brand-500/70 uppercase tracking-widest truncate">
                  {getDynamicInsight()}
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Visualization Grid - Professional 70/30 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* LATENCY TREND (70% OF INNER CONTENT) */}
            <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground/40 border border-border/10"><BarChart3 size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{t('dashboard.analytics.performance_score')}</span>
                    <span className="text-[7px] font-black text-muted-foreground/30 uppercase tracking-[0.1em]">{t('dashboard.security.telemetry_hint')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <Counter value={averageLatency} className="font-mono text-xl font-black text-warning tracking-tighter" />
                    <span className="text-[9px] font-black text-warning/20 uppercase">{t('dashboard.analytics.ms')}</span>
                  </div>
                </div>
              </div>
              <div className="h-[280px] w-full relative overflow-hidden rounded-xl bg-muted/[0.02] border border-border/5">
                <LatencyTrendChart data={globalTrend} height="100%" />
              </div>
            </div>

            {/* HEALTH DONUT (30% OF INNER CONTENT) */}
            <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
              <div className="flex items-center gap-3 px-1">
                <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground/40 border border-border/10"><PieChart size={16} /></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{t('dashboard.analytics.fleet_health')}</span>
              </div>
              <div className="h-[280px] flex items-center justify-center rounded-xl bg-muted/[0.03] border border-border/10 p-4 relative group/donut shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent opacity-0 group-hover/donut:opacity-100 transition-opacity duration-1000" />
                <div className="w-full max-w-[200px] aspect-square flex items-center justify-center">
                  <ServiceHealthDonut stats={stats} />
                </div>
              </div>
            </div>
          </div>

          {/* Tertiary Metrics Strip - Compact Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/10">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.1em] block">{t('dashboard.analytics.availability_rate')}</span>
              <div className="flex items-baseline gap-1">
                <Counter value={uptimeRate} className="text-xl font-black text-success tracking-tighter" />
                <span className="text-[10px] font-black text-success/30">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.1em] block">{t('dashboard.analytics.stability_index')}</span>
              <span className={cn(
                "text-lg font-black uppercase tracking-tighter leading-none block",
                stabilityScore > 90 ? "text-brand-500" : stabilityScore > 70 ? "text-warning" : "text-danger"
              )}>
                {intelligence?.fleetStability || (stabilityScore > 90 ? t('common.stable') : t('common.degraded'))}
              </span>
              <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest">IDX: {stabilityScore}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.1em] block">{t('dashboard.security.responsiveness')}</span>
              <div className="flex items-baseline gap-1">
                <Counter value={intelligence?.responsivenessScore || 0} className="text-xl font-black text-warning tracking-tighter" />
                <span className="text-[8px] font-black text-warning/20 uppercase tracking-widest">SCORE</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.1em] block">{t('dashboard.security.latency_spread')}</span>
              <span className="text-lg font-mono font-black text-foreground/60 tracking-tighter leading-none block">{minLat}{t('dashboard.analytics.ms')}—{maxLat}{t('dashboard.analytics.ms')}</span>
              <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest">Δ {maxLat - minLat}{t('dashboard.analytics.ms')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. PERFORMANCE OUTLIERS - COMPACT SIDE-BY-SIDE */}
      {!insufficientData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Risks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-danger/10 text-danger border border-danger/20 shadow-sm"><ArrowDownRight size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground/70 leading-none mb-0.5">{t('dashboard.security.risks_title')}</span>
                  <span className="text-[7px] font-black text-danger/30 uppercase tracking-widest">{t('dashboard.security.risks_action')}</span>
                </div>
              </div>
              <div className="h-1 w-1 rounded-full bg-danger animate-pulse" />
            </div>
            <div className="p-1 rounded-2xl bg-card/10 border border-border/40 backdrop-blur-xl shadow-sm">
              <PerformanceLeaderboard
                data={(perfSummary?.risks || []).map(s => ({
                  name: s.name,
                  latency: s.latency || 0,
                  insight: s.insight,
                  status: s.status
                }))}
                type="slowest"
              />
            </div>
          </div>

          {/* Best Performers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 text-success border border-success/20 shadow-sm"><ArrowUpRight size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground/70 leading-none mb-0.5">{t('dashboard.security.best_performers_title')}</span>
                  <span className="text-[7px] font-black text-success/30 uppercase tracking-widest">{t('dashboard.security.best_performers_optimized')}</span>
                </div>
              </div>
              <div className="h-1 w-1 rounded-full bg-success" />
            </div>
            <div className="p-1 rounded-2xl bg-card/10 border border-border/40 backdrop-blur-xl shadow-sm">
              <PerformanceLeaderboard
                data={(perfSummary?.bestPerformers || []).map(s => ({
                  name: s.name,
                  latency: s.latency || 0,
                  insight: s.insight,
                  status: s.status
                }))}
                type="fastest"
              />
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Data State - Compacted */}
      {insufficientData && (
        <Card className="p-10 rounded-2xl border border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center text-center gap-4 group/empty hover:border-brand-500/20 transition-all duration-1000">
          <div className="p-4 rounded-xl bg-muted/10 text-muted-foreground/10 group-hover/empty:scale-110 group-hover/empty:text-brand-500/20 transition-all duration-1000">
            <Activity size={32} strokeWidth={1} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-foreground/60 uppercase tracking-[0.2em]">{t('dashboard.security.insufficient_data_title')}</p>
            <p className="text-[9px] text-muted-foreground/30 max-w-sm mx-auto leading-relaxed font-black">{t('dashboard.security.insufficient_data_desc')}</p>
          </div>
        </Card>
      )}

      {/* 3. FOOTER TELEMETRY STRIP - HIGHLY COMPACT */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-6 border-t border-border/10 opacity-60 hover:opacity-100 transition-all duration-500">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand-500/5 text-brand-500 border border-brand-500/10 shadow-inner mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-foreground uppercase tracking-[0.1em]">{t('dashboard.metrics.total_endpoints')}</span>
              <span className="px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 text-[10px] font-mono font-black">{stats.total}</span>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground/40 leading-relaxed mt-1.5 break-words">
              {stats.up} {t('common.healthy').toLowerCase()} • {stats.down} {t('common.critical').toLowerCase()} {t('dashboard.metrics.insight_reachable')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 px-5 py-2.5 rounded-2xl bg-foreground/[0.02] border border-white/[0.03] backdrop-blur-md shadow-sm">
          <div className="flex flex-col items-end leading-none gap-1">
            <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t('common.operational')}</span>
            <span className="text-[10px] font-black text-success uppercase tracking-tighter">{t('common.active')}</span>
          </div>
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-success shadow-[0_0_12px_rgba(34,197,94,0.5)] animate-pulse" />
        </div>
      </div>
    </div>
  );
};
