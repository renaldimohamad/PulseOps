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
}

import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n';

const Counter = ({ value }: { value: number | string }) => {
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

  return <span className="text-[13px] md:text-[20px]">{displayValue}</span>;
};

export const MetricCard = ({ title, value, suffix, icon: Icon, color, trend, description, statusIndicator, loading }: MetricCardProps) => {
  const { t } = useI18n();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card className="relative overflow-hidden group border border-border/40 shadow-sm bg-card/40 backdrop-blur-xl">
        <div className={cn(
          "absolute top-0 left-0 w-[3px] h-full transition-all duration-300 group-hover:w-[4px]",
          color.includes('brand') ? "bg-brand-500/80" :
            color.includes('success') ? "bg-success/80" :
              color.includes('danger') ? "bg-danger/80" : "bg-muted"
        )} />

        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 md:p-2.5 rounded-xl transition-all duration-300 border border-transparent",
                color.includes('brand') ? "bg-brand-500/5 text-brand-500 group-hover:border-brand-500/20 group-hover:bg-brand-500/10" :
                  color.includes('success') ? "bg-success/5 text-success/80 group-hover:border-success/20 group-hover:bg-success/10" :
                    color.includes('danger') ? "bg-danger/5 text-danger/80 group-hover:border-danger/20 group-hover:bg-danger/10" : "bg-muted/40 text-muted-foreground"
              )}>
                <Icon size={18} className="w-[14px] h-[14px] md:w-[20px] md:h-[20px]" strokeWidth={1.5} />
              </div>
              <span className="text-[7px] md:text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80">
                {title}
              </span>
            </div>
            {trend && (
              <span className={cn(
                "hidden xs:inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border",
                trend.includes('+') || trend.includes('Stable') || trend.includes('Excellent') || trend.includes('Healthy') ? "text-success/90 bg-success/5 border-success/10" :
                  trend.includes('Immediate') || trend.includes('High') || trend.includes('Critical') ? "text-danger/90 bg-danger/5 border-danger/10" :
                    "text-warning/90 bg-warning/5 border-warning/10"
              )}>
                {trend}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="metric-text text-3xl md:text-4xl text-foreground font-semibold flex items-center gap-2">
                {statusIndicator && (
                  <div className="relative flex h-2 w-2 mr-1">
                    <span className={cn(
                      "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
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
              <span className="text-[10px] md:text-[12px] font-medium text-foreground/40 lowercase mb-1">
                {suffix || t('common.services')}
              </span>
            </div>
            {description && (
              <p className="text-[8px] md:text-[10px] font-medium text-muted-foreground/60 tracking-wide mt-1">
                {description}
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-1 items-center opacity-40">
            <div className="h-[2px] flex-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={cn(
                  "h-full rounded-full",
                  color.includes('brand') ? "bg-brand-500" :
                    color.includes('success') ? "bg-success" :
                      color.includes('danger') ? "bg-danger" : "bg-muted"
                )}
              />
            </div>
          </div>
        </CardContent>

        <div className={cn(
          "absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000",
          color.includes('brand') ? "bg-brand-500" :
            color.includes('success') ? "bg-success" :
              color.includes('danger') ? "bg-danger" : "bg-muted"
        )} />
      </Card>
    </motion.div>
  );
};

