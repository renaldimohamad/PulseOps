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
    UP: 'bg-success/10 text-success border-success/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    DOWN: 'bg-danger/10 text-danger border-danger/20 shadow-[0_0_12px_rgba(239,68,68,0.1)]',
    PENDING: 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
    PROTECTED: 'bg-brand-500/10 text-brand-600 border-brand-500/20 shadow-[0_0_12px_rgba(14,145,233,0.1)]',
    UNKNOWN: 'bg-muted text-muted-foreground border-border',
  };

  const statusLabels: Record<ServiceStatus, string> = {
    UP: t('dashboard.metrics.operational'), // or custom label
    DOWN: 'Offline',
    PENDING: 'Pending',
    PROTECTED: 'Protected',
    UNKNOWN: 'Unknown',
  };

  const dotStyles: Record<ServiceStatus, string> = {
    UP: 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    DOWN: 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    PENDING: 'bg-warning animate-pulse',
    PROTECTED: 'bg-brand-500 shadow-[0_0_8px_rgba(14,145,233,0.5)]',
    UNKNOWN: 'bg-muted-foreground',
  };

  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap';

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
        <span className="relative flex h-2 w-2">
          {status === 'UP' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-40"></span>
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotStyles[status])} />
        </span>
      )}
      {children || (status ? statusLabels[status] : 'Unknown')}
    </div>
  );
};

export { Badge };
