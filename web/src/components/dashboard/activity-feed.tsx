'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, Info, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Service } from '@/types/service';
import { cn } from '@/lib/utils';

interface ActivityEvent {
  id: string;
  serviceName: string;
  type: 'UP' | 'DOWN' | 'PENDING' | 'PROTECTED' | 'UNKNOWN';
  timestamp: Date;
  message: string;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

import { useI18n } from '@/lib/i18n';

export const ActivityFeed = ({ events }: ActivityFeedProps) => {
  const { t, locale } = useI18n();

  return (
    <Card className="border-none shadow-premium bg-card/70 backdrop-blur-xl overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-secondary/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Activity size={16} className="text-brand-600" />
            {t('dashboard.activity.title')}
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-tighter text-brand-600">{t('dashboard.activity.live')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          <div className="flex flex-col max-h-[350px] md:max-h-[450px] overflow-y-auto scrollbar-hide">
            <AnimatePresence initial={false}>
              {events.length === 0 ? (
                <div className="p-10 md:p-12 text-center text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {t('dashboard.activity.empty')}
                </div>
              ) : (
                events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group",
                      idx === 0 && "bg-brand-500/5"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 md:p-2 rounded-xl border transition-transform group-hover:scale-110 duration-300",
                      event.type === 'UP' ? "bg-success/10 border-success/20 text-success" :
                        event.type === 'DOWN' ? "bg-danger/10 border-danger/20 text-danger" :
                          event.type === 'PENDING' ? "bg-warning/10 border-warning/20 text-warning" :
                            "bg-brand-500/10 border-brand-500/20 text-brand-600"
                    )}>
                      {event.type === 'UP' && <CheckCircle2 size={14} className="md:w-4 md:h-4" />}
                      {event.type === 'DOWN' && <XCircle size={14} className="md:w-4 md:h-4" />}
                      {event.type === 'PENDING' && <Activity size={14} className="md:w-4 md:h-4 animate-pulse" />}
                      {(event.type === 'PROTECTED' || event.type === 'UNKNOWN') && <Info size={14} className="md:w-4 md:h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs md:text-sm font-bold text-foreground truncate">
                          {event.serviceName}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                          {formatDistanceToNow(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground line-clamp-1">
                        {event.message}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
