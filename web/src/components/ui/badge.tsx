import * as React from 'react';
import { cn } from '@/lib/utils';
import { ServiceStatus } from '@/types/service';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ServiceStatus;
  variant?: 'default' | 'outline';
}

const Badge = ({ className, status, variant = 'default', children, ...props }: BadgeProps) => {
  const statusStyles: Record<ServiceStatus, string> = {
    UP: 'bg-green-50 text-green-700 border-green-200',
    DOWN: 'bg-red-50 text-red-700 border-red-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    UNKNOWN: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const statusLabels: Record<ServiceStatus, string> = {
    UP: 'Healthy',
    DOWN: 'Offline',
    PENDING: 'Pending',
    UNKNOWN: 'Unknown',
  };

  const dotStyles: Record<ServiceStatus, string> = {
    UP: 'bg-green-500',
    DOWN: 'bg-red-500',
    PENDING: 'bg-yellow-500',
    UNKNOWN: 'bg-gray-400',
  };

  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';
  
  return (
    <div
      className={cn(
        baseStyles,
        status ? statusStyles[status] : 'bg-gray-100 text-gray-800 border-transparent',
        className
      )}
      {...props}
    >
      {status && <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[status])} />}
      {children || (status ? statusLabels[status] : 'Unknown')}
    </div>
  );
};

export { Badge };
