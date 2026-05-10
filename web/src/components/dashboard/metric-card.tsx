'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  loading?: boolean;
}

import { useI18n } from '@/lib/i18n';

export const MetricCard = ({ title, value, icon: Icon, color, trend, loading }: MetricCardProps) => {
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
                "p-2.5 rounded-xl transition-all duration-300 border border-transparent",
                color.includes('brand') ? "bg-brand-500/5 text-brand-500 group-hover:border-brand-500/20 group-hover:bg-brand-500/10" :
                  color.includes('success') ? "bg-success/5 text-success/80 group-hover:border-success/20 group-hover:bg-success/10" :
                    color.includes('danger') ? "bg-danger/5 text-danger/80 group-hover:border-danger/20 group-hover:bg-danger/10" : "bg-muted/40 text-muted-foreground"
              )}>
                <Icon size={18} className="md:w-[20px] md:h-[20px]" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80">
                {title}
              </span>
            </div>
            {trend && (
              <span className="hidden xs:inline-block text-[10px] font-bold tracking-wider text-success/90 bg-success/5 px-2 py-0.5 rounded-full border border-success/10">
                {trend}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={value}
              className="metric-text text-3xl md:text-4xl text-foreground font-semibold"
            >
              {value}
            </motion.span>
            <span className="text-[12px] font-medium text-foreground/40 lowercase mb-1">
              {t('common.services')}
            </span>
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

