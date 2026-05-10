import * as React from 'react';
import { cn } from '@/lib/utils';
import { ServiceStatus } from '@/types/service';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ServiceStatus;
  variant?: 'default' | 'outline' | 'soft';
}

import { useI18n } from '@/lib/i18n';

const Badge = ({ className, status, variant = 'soft', children, ...props }: BadgeProps) => {
  const { t } = useI18n();
  
  const statusStyles: Record<ServiceStatus, string> = {
    UP: 'bg-success/5 text-success/90 border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]',
    DOWN: 'bg-danger/5 text-danger/80 border-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
    PENDING: 'bg-warning/5 text-warning/80 border-warning/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]',
    PROTECTED: 'bg-brand-500/5 text-brand-500 border-brand-500/20 shadow-[0_0_15px_rgba(14,145,233,0.05)]',
    UNKNOWN: 'bg-muted/30 text-muted-foreground border-border/40',
  };

  const statusLabels: Record<ServiceStatus, string> = {
    UP: t('dashboard.metrics.operational'),
    DOWN: 'Offline',
    PENDING: 'Pending',
    PROTECTED: 'Protected',
    UNKNOWN: 'Unknown',
  };

  const dotStyles: Record<ServiceStatus, string> = {
    UP: 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    DOWN: 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.3)]',
    PENDING: 'bg-warning animate-pulse',
    PROTECTED: 'bg-brand-500 shadow-[0_0_8px_rgba(14,145,233,0.3)]',
    UNKNOWN: 'bg-muted-foreground/50',
  };

  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 status-text transition-all duration-300 whitespace-nowrap backdrop-blur-[2px]';

  return (
    <div
      className={cn(
        baseStyles,
        status ? statusStyles[status] : 'bg-muted text-muted-foreground border-transparent',
        className
      )}
      {...props}
    >
      {status && (
        <span className="pulse-dot">
          {status === 'UP' && (
            <span className="pulse-dot-inner"></span>
          )}
          <span className={cn('pulse-dot-main', dotStyles[status])} />
        </span>
      )}
      <span className="translate-y-[0.5px]">
        {children || (status ? statusLabels[status] : 'Unknown')}
      </span>
    </div>
  );
};


export { Badge };
