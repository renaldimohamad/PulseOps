'use client';

import { Service } from '@/types/service';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Activity, Globe, Zap, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RelativeTime } from '@/components/ui/relative-time';
import { useI18n } from '@/lib/i18n';

interface ServiceNodeCardProps {
  service: Service;
  index: number;
}

export const ServiceNodeCard = ({ service, index }: ServiceNodeCardProps) => {
  const { t } = useI18n();
  const isDown = service.status === 'DOWN';
  const isDegraded = service.status === 'DEGRADED';

  const getStatusConfig = () => {
    switch (service.status) {
      case 'UP':
        return {
          color: 'text-success',
          bg: 'bg-success/5',
          border: 'border-success/20',
          icon: CheckCircle2,
          label: t('dashboard.breakdown.status.operational'),
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'
        };
      case 'DOWN':
        return {
          color: 'text-danger',
          bg: 'bg-danger/5',
          border: 'border-danger/20',
          icon: AlertCircle,
          label: t('dashboard.breakdown.status.critical'),
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]'
        };
      case 'DEGRADED':
        return {
          color: 'text-warning',
          bg: 'bg-warning/5',
          border: 'border-warning/20',
          icon: Zap,
          label: t('dashboard.breakdown.status.degraded'),
          glow: 'shadow-[0_0_15_rgba(245,158,11,0.1)]'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted/5',
          border: 'border-border/20',
          icon: Clock,
          label: t('dashboard.breakdown.status.pending'),
          glow: ''
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className={cn(
        "group relative p-5 rounded-[2rem] border bg-card/40 transition-all duration-500 hover:bg-card/60",
        config.border,
        config.glow
      )}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6",
            config.bg
          )}>
            <Globe className={cn("h-5 w-5", config.color)} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[14px] font-bold tracking-tight text-foreground/90 group-hover:text-foreground truncate max-w-[140px]">
              {service.name}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/60 font-medium truncate max-w-[100px]">
                {service.url.replace(/^https?:\/\//, '')}
              </span>
            </div>
          </div>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
          config.color,
          config.border,
          config.bg
        )}>
          <span className="relative flex h-1.5 w-1.5">
            {(isDown || isDegraded) && (
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDown ? "bg-danger" : "bg-warning")}></span>
            )}
            <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", config.color.replace('text-', 'bg-'))}></span>
          </span>
          {config.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-muted/5 border border-border/10 space-y-1">
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {t('dashboard.breakdown.response')}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-mono font-bold tracking-tighter">
              {service.latency !== null ? service.latency : '--'}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground/40">{t('dashboard.analytics.ms')}</span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-muted/5 border border-border/10 space-y-1">
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {t('dashboard.breakdown.category')}
          </p>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-brand-500/50" />
            <span className="text-[10px] font-bold truncate">
              {service.category || t('dashboard.breakdown.general')}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground/40" />
          <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tight">
            {t('dashboard.breakdown.last_checked')}
          </span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground/80">
          {service.lastChecked ? (
            <RelativeTime date={new Date(service.lastChecked)} />
          ) : t('common.never')}
        </span>
      </div>

      {/* Decorative Gradient Glow */}
      <div className={cn(
        "absolute -bottom-2 -right-2 h-20 w-20 blur-[30px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700",
        config.color.replace('text-', 'bg-')
      )} />
    </motion.div>
  );
};
