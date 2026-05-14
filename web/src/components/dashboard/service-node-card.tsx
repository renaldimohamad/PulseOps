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
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]'
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: 'easeOut'
      }}
      className={cn(
        "group relative overflow-hidden p-2 rounded-xl border bg-card/40 transition-all duration-500 hover:bg-card/60",
        config.border,
        config.glow
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-6",
            config.bg
          )}>
            <Globe className={cn("h-4 w-4", config.color)} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[13px] font-bold tracking-tight text-foreground/90 group-hover:text-foreground truncate max-w-[120px]">
              {service.name}
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-muted-foreground/60 font-medium truncate max-w-[90px]">
                {service.url.replace(/^https?:\/\//, '')}
              </span>
            </div>
          </div>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
          config.color,
          config.border,
          config.bg
        )}>
          <span className="relative flex h-1 w-1">
            {(isDown || isDegraded) && (
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDown ? "bg-danger" : "bg-warning")}></span>
            )}
            <span className={cn("relative inline-flex rounded-full h-1 w-1", config.color.replace('text-', 'bg-'))}></span>
          </span>
          {config.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-muted/5 border border-border/10 space-y-0.5">
          <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {t('dashboard.breakdown.response')}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold tracking-tighter">
              {service.latency !== null ? service.latency : '--'}
            </span>
            <span className="text-[8px] font-bold text-muted-foreground/40">{t('dashboard.analytics.ms')}</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/5 border border-border/10 space-y-0.5">
          <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {t('dashboard.breakdown.category')}
          </p>
          <div className="flex items-center gap-1">
            <Activity className="h-2.5 w-2.5 text-brand-500/50" />
            <span className="text-[9px] font-bold truncate">
              {service.category || t('dashboard.breakdown.general')}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-2.5 w-2.5 text-muted-foreground/40" />
          <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tight">
            {t('dashboard.breakdown.last_checked')}
          </span>
        </div>
        <span className="text-[9px] font-medium text-muted-foreground/80">
          {service.lastChecked ? (
            <RelativeTime date={new Date(service.lastChecked)} />
          ) : t('common.never')}
        </span>
      </div>

      {/* Decorative Gradient Glow */}
      <div
        className={cn(
          "absolute bottom-0 right-0 h-12 w-12 blur-2xl rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none",
          config.color.replace('text-', 'bg-')
        )}
      />
    </motion.div>
  );
};
