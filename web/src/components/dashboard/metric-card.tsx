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
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="relative overflow-hidden group border-none shadow-premium bg-card/70 backdrop-blur-xl">
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full",
          color.includes('brand') ? "bg-brand-500" :
            color.includes('success') ? "bg-success" :
              color.includes('danger') ? "bg-danger" : "bg-muted"
        )} />

        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-xl transition-colors group-hover:scale-110 duration-500",
                color.includes('brand') ? "bg-brand-500/10 text-brand-600" :
                  color.includes('success') ? "bg-success/10 text-success" :
                    color.includes('danger') ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground"
              )}>
                <Icon size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                {title}
              </span>
            </div>
            {trend && (
              <span className="hidden xs:inline-block text-[9px] md:text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                {trend}
              </span>
            )}
          </div>

          <div className="flex items-end gap-1.5 md:gap-2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={value}
              className="text-3xl md:text-4xl font-black tracking-tighter text-foreground"
            >
              {value}
            </motion.span>
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground mb-1 md:mb-1.5 uppercase tracking-tight">
              {t('common.services')}
            </span>
          </div>

          <div className="mt-4 flex gap-1 items-center">
            <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  color.includes('brand') ? "bg-brand-500/20" :
                    color.includes('success') ? "bg-success/20" :
                      color.includes('danger') ? "bg-danger/20" : "bg-muted"
                )}
              />
            </div>
          </div>
        </CardContent>

        <div className={cn(
          "absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700",
          color.includes('brand') ? "bg-brand-500" :
            color.includes('success') ? "bg-success" :
              color.includes('danger') ? "bg-danger" : "bg-muted"
        )} />
      </Card>
    </motion.div>
  );
};
