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
    <div className="space-y-10">
      {/* 1. INTELLIGENCE LAYER (SECONDARY HERO - 60% FOCUS) */}
      <Card className="relative overflow-hidden border border-border/40 bg-card/30 backdrop-blur-2xl group shadow-premium-lg rounded-[2.5rem]">
        <div className="p-8 md:p-10 lg:p-12 flex flex-col h-full gap-10">

          {/* Header & Contextual Insights */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 ring-1 ring-brand-500/20 shadow-inner">
                <Zap size={24} />
              </div>
              <div className="space-y-0.5 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight uppercase">
                  {t('dashboard.security.intelligence')}
                </h3>
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
                  {t('dashboard.security.fleet_engine')}
                </p>
              </div>
            </div>

            <div className="max-w-xl w-full lg:w-auto">
              <div className="px-5 py-3 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center lg:justify-start gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </div>
                <p className="text-[11px] font-black text-brand-500/70 uppercase tracking-widest truncate">
                  {getDynamicInsight()}
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Visualization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">

            {/* LATENCY TREND (60% OF INNER CONTENT) */}
            <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-muted/40 text-muted-foreground/40 border border-border/10"><BarChart3 size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{t('dashboard.analytics.performance_score')}</span>
                    <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{t('dashboard.security.telemetry_hint')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <Counter value={averageLatency} className="font-mono text-2xl font-black text-warning tracking-tighter" />
                    <span className="text-[10px] font-black text-warning/20 uppercase">{t('dashboard.analytics.ms')}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-[300px] w-full relative overflow-hidden rounded-[2rem] bg-muted/[0.02] border border-border/5">
                <LatencyTrendChart data={globalTrend} height="100%" />
              </div>
            </div>

            {/* HEALTH DONUT (30% OF INNER CONTENT) */}
            <div className="lg:col-span-4 flex flex-col gap-8 min-w-0">
              <div className="flex items-center gap-4 px-2">
                <div className="p-2.5 rounded-2xl bg-muted/40 text-muted-foreground/40 border border-border/10"><PieChart size={18} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{t('dashboard.analytics.fleet_health')}</span>
              </div>
              <div className="flex-1 min-h-[300px] flex items-center justify-center rounded-[2rem] bg-muted/[0.03] border border-border/10 p-6 relative group/donut shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent opacity-0 group-hover/donut:opacity-100 transition-opacity duration-1000" />
                <div className="w-full max-w-[240px]">
                  <ServiceHealthDonut stats={stats} />
                </div>
              </div>
            </div>
          </div>

          {/* Tertiary Metrics Strip (10% DENSITY) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-10 border-t border-border/10">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.analytics.availability_rate')}</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <Counter value={uptimeRate} className="text-2xl font-black text-success tracking-tighter" />
                <span className="text-xs font-black text-success/30">%</span>
              </div>
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.analytics.stability_index')}</span>
              <span className={cn(
                "text-xl font-black uppercase tracking-tighter leading-none block",
                stabilityScore > 90 ? "text-brand-500" : stabilityScore > 70 ? "text-warning" : "text-danger"
              )}>
                {intelligence?.fleetStability || (stabilityScore > 90 ? t('common.stable') : t('common.degraded'))}
              </span>
              <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest">IDX: {stabilityScore}</span>
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.security.responsiveness')}</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1.5">
                <Counter value={intelligence?.responsivenessScore || 0} className="text-2xl font-black text-warning tracking-tighter" />
                <span className="text-[9px] font-black text-warning/20 uppercase tracking-widest">SCORE</span>
              </div>
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] block">{t('dashboard.security.latency_spread')}</span>
              <span className="text-xl font-mono font-black text-foreground/60 tracking-tighter leading-none block">{minLat}{t('dashboard.analytics.ms')}—{maxLat}{t('dashboard.analytics.ms')}</span>
              <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest">Δ {maxLat - minLat}{t('dashboard.analytics.ms')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. PERFORMANCE OUTLIERS (30% FOCUS SECTION) */}
      {!insufficientData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Performance Risks */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-danger/10 text-danger border border-danger/20 shadow-sm"><ArrowDownRight size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/70 leading-none mb-1">{t('dashboard.security.risks_title')}</span>
                  <span className="text-[8px] font-black text-danger/30 uppercase tracking-widest">{t('dashboard.security.risks_action')}</span>
                </div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
            </div>
            <div className="p-1 rounded-[2rem] bg-card/10 border border-border/40 backdrop-blur-xl shadow-premium">
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
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-success/10 text-success border border-success/20 shadow-sm"><ArrowUpRight size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/70 leading-none mb-1">{t('dashboard.security.best_performers_title')}</span>
                  <span className="text-[8px] font-black text-success/30 uppercase tracking-widest">{t('dashboard.security.best_performers_optimized')}</span>
                </div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
            </div>
            <div className="p-1 rounded-[2rem] bg-card/10 border border-border/40 backdrop-blur-xl shadow-premium">
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

      {/* Insufficient Data State */}
      {insufficientData && (
        <Card className="p-16 rounded-[2.5rem] border border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center text-center gap-6 group/empty hover:border-brand-500/20 transition-all duration-1000">
          <div className="p-6 rounded-2xl bg-muted/10 text-muted-foreground/10 group-hover/empty:scale-110 group-hover/empty:text-brand-500/20 transition-all duration-1000">
            <Activity size={48} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <p className="text-base font-black text-foreground/60 uppercase tracking-[0.25em]">{t('dashboard.security.insufficient_data_title')}</p>
            <p className="text-[10px] text-muted-foreground/30 max-w-sm mx-auto leading-relaxed font-black">{t('dashboard.security.insufficient_data_desc')}</p>
          </div>
        </Card>
      )}

      {/* 5. INFRASTRUCTURE TRUST (FOOTER - 10% DENSITY) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-10 border-t border-border/10 opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-brand-500/5 text-brand-500 border border-brand-500/10 shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-brand-500/60 uppercase tracking-[0.4em] block">{t('dashboard.metrics.total_endpoints')}</span>
            <p className="text-[13px] font-bold text-muted-foreground/60 leading-relaxed">
              {t('dashboard.metrics.insight_reachable')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 px-5 py-2.5 rounded-2xl bg-foreground/5 border border-foreground/5">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">{t('common.operational')}</span>
            <span className="text-[10px] font-black text-foreground/40 uppercase tracking-tighter">{t('common.active').toUpperCase()}</span>
          </div>
          <div className="h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse" />
        </div>
      </div>
    </div>
  );
};
