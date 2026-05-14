'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
  description?: string;
  statusIndicator?: 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
  children?: React.ReactNode;
}

import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n';

export const Counter = ({ value, className }: { value: number | string, className?: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    const start = Number(prevValue.current) || 0;
    const end = Number(value);
    const duration = 1000;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.round(start + progress * (end - start));

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  return <span className={className}>{displayValue}</span>;
};

export const MetricCard = ({ title, value, suffix, icon: Icon, color, trend, description, statusIndicator, loading, children }: MetricCardProps) => {
  const { t } = useI18n();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card className="relative overflow-hidden group border border-border/40 shadow-sm bg-card/40 backdrop-blur-xl h-full flex flex-col">
        <div className={cn(
          "absolute top-0 left-0 w-[3px] h-full transition-all duration-300 group-hover:w-[4px]",
          color.includes('brand') ? "bg-brand-500/80" :
            color.includes('success') ? "bg-success/80" :
              color.includes('danger') ? "bg-danger/80" : "bg-muted"
        )} />

        <CardContent className="p-4 md:p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300 border border-border/10",
                color.includes('brand') ? "bg-brand-500/5 text-brand-500" :
                  color.includes('success') ? "bg-success/5 text-success/80" :
                    color.includes('danger') ? "bg-danger/5 text-danger/80" : "bg-muted/40 text-muted-foreground"
              )}>
                <Icon size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
              </div>
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50">
                {title}
              </span>
            </div>
            {trend && (
              <div className={cn(
                "hidden xs:flex items-center gap-1 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-md border backdrop-blur-sm",
                trend.includes('+') || trend.includes('Stable') || trend.includes('Excellent') || trend.includes('Healthy') || trend.includes('Operational') ? "text-success bg-success/5 border-success/10" :
                  trend.includes('Immediate') || trend.includes('High') || trend.includes('Critical') || trend.includes('Down') ? "text-danger bg-danger/5 border-danger/10" :
                    "text-warning bg-warning/5 border-warning/10"
              )}>
                {trend}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="metric-text text-2xl md:text-4xl text-foreground font-black tracking-tighter flex items-center gap-2">
                {statusIndicator && (
                  <div className="relative flex h-2 w-2">
                    <span className={cn(
                      "animate-ping absolute inline-flex h-full w-full rounded-full opacity-40",
                      statusIndicator === 'success' ? "bg-success" :
                        statusIndicator === 'warning' ? "bg-warning" :
                          statusIndicator === 'danger' ? "bg-danger" : "bg-brand-500"
                    )}></span>
                    <span className={cn(
                      "relative inline-flex rounded-full h-2 w-2",
                      statusIndicator === 'success' ? "bg-success" :
                        statusIndicator === 'warning' ? "bg-warning" :
                          statusIndicator === 'danger' ? "bg-danger" : "bg-brand-500"
                    )}></span>
                  </div>
                )}
                <Counter value={value} />
              </span>
              <span className="text-[9px] md:text-[12px] font-black text-foreground/20 uppercase tracking-widest">
                {suffix || t('common.services')}
              </span>
            </div>
            {description && (
              <p className="text-[7px] md:text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.1em] mt-1">
                {description}
              </p>
            )}
          </div>
          
          {/* Chart area or spacer */}
          {children ? (
            children
          ) : (
            <div className="mt-3 h-[30px] w-full" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

