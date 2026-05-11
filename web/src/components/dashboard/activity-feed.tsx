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
    <Card className="border border-border/40 shadow-sm bg-card/40 backdrop-blur-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-4 md:px-6 md:py-5 border-b border-border/30 bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[8px] md:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2.5">
            <Activity size={14} className="text-brand-500/80" />
            {t('dashboard.activity.title')}
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/5 border border-brand-500/10">
            <span className="pulse-dot">
              <span className="pulse-dot-inner"></span>
              <span className="pulse-dot-main bg-brand-500/80"></span>
            </span>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-brand-600/80">{t('dashboard.activity.live')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="max-h-[400px] lg:max-h-none overflow-y-auto custom-scrollbar">
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {events.length === 0 ? (
                <div className="p-12 text-center text-[8px] md:text-[11px] font-medium uppercase tracking-widest text-muted-foreground/40">
                  {t('dashboard.activity.empty')}
                </div>
              ) : (
                events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 border-b border-border/20 last:border-0 hover:bg-muted/20 transition-all duration-200 group",
                      idx === 0 && "bg-brand-500/[0.02]"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-lg border transition-all duration-300",
                      event.type === 'UP' ? "bg-success/5 border-success/10 text-success/70" :
                        event.type === 'DOWN' ? "bg-danger/5 border-danger/10 text-danger/70" :
                          event.type === 'PENDING' ? "bg-warning/5 border-warning/10 text-warning/70" :
                            "bg-brand-500/5 border-brand-500/10 text-brand-500/70"
                    )}>
                      {event.type === 'UP' && <CheckCircle2 size={13} />}
                      {event.type === 'DOWN' && <XCircle size={13} />}
                      {event.type === 'PENDING' && <Activity size={13} className="animate-pulse" />}
                      {(event.type === 'PROTECTED' || event.type === 'UNKNOWN') && <Info size={13} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-foreground/90 truncate group-hover:text-foreground transition-colors">
                          {event.serviceName}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/50 whitespace-nowrap">
                          {formatDistanceToNow(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-[12px] text-foreground/50 line-clamp-1 leading-normal font-normal">
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
