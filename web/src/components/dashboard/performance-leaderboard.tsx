'use client';

import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface LeaderboardItem {
  name: string;
  latency: number;
  insight?: string;
  status?: string;
}

interface PerformanceLeaderboardProps {
  data: LeaderboardItem[];
  type: 'fastest' | 'slowest';
}

export const PerformanceLeaderboard = ({ data, type }: PerformanceLeaderboardProps) => {
  const { t } = useI18n();

  const getStatus = (latency: number, statusOverride?: string) => {
    if (statusOverride === 'DOWN' || latency >= 1500)
      return { label: t('common.critical'), color: 'text-danger bg-danger/10 border-danger/20' };
    if (statusOverride === 'DEGRADED' || latency >= 1000)
      return { label: t('common.poor'), color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    if (latency >= 500)
      return { label: t('common.degraded'), color: 'text-warning bg-warning/10 border-warning/20' };
    if (latency >= 200)
      return { label: t('common.healthy'), color: 'text-brand-500 bg-brand-500/10 border-brand-500/20' };
    return { label: t('common.excellent'), color: 'text-success bg-success/10 border-success/20' };
  };

  const maxLatency = Math.max(...data.map(d => d.latency), 1);

  return (
    <div className="flex flex-col p-1">
      {data.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center gap-4 opacity-30">
          <div className="p-3 rounded-xl bg-muted/20">
            <Activity size={24} className="text-muted-foreground animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] block">{t('dashboard.analytics.collecting')}</span>
            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">{t('dashboard.analytics.analyzing')}</span>
          </div>
        </div>
      ) : (
        data.map((item, index) => {
          const status = getStatus(item.latency, item.status);
          const percentage = (item.latency / maxLatency) * 100;
          const isRisk = type === 'slowest';

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border border-transparent hover:bg-white/[0.02]",
                isRisk ? "hover:border-danger/10" : "hover:border-success/10"
              )}
            >
              {/* Status Indicator Thread */}
              <div className={cn(
                "w-1 h-10 rounded-full shrink-0 shadow-inner",
                item.status === 'DOWN' || item.latency >= 1500 ? "bg-danger/60 shadow-danger/20" :
                  item.latency >= 500 ? "bg-warning/60 shadow-warning/20" : "bg-success/60 shadow-success/20"
              )} />

              {/* Service Details */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-[13px] font-black text-foreground/90 truncate tracking-tight uppercase leading-none">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate">
                      {item.insight}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                     <span className={cn(
                      "text-[7px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-[0.1em] shadow-sm",
                      status.color
                    )}>
                      {status.label}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[14px] font-mono font-black text-foreground/80 tabular-nums leading-none">
                        {item.latency}
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground/20 uppercase">{t('dashboard.analytics.ms')}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Gauge */}
                <div className="relative h-1 w-full bg-foreground/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 + index * 0.05 }}
                    className={cn(
                      "absolute top-0 left-0 h-full rounded-full",
                      isRisk ? "bg-danger/40" : "bg-success/40"
                    )}
                  />
                </div>
              </div>

              {/* Trending State */}
              <div className="hidden sm:flex shrink-0 p-2 rounded-lg bg-muted/10 opacity-20 group-hover:opacity-100 transition-all">
                {isRisk ? (
                  <TrendingUp size={14} className="text-danger" />
                ) : (
                  <TrendingDown size={14} className="text-success" />
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};
