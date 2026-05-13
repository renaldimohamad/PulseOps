'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, Activity, AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

interface ActivityEvent {
  id: string;
  serviceName: string;
  type: 'UP' | 'DOWN' | 'PENDING' | 'PROTECTED' | 'UNKNOWN' | 'DEGRADED';
  timestamp: Date;
  message: string;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export const ActivityFeed = ({ events }: ActivityFeedProps) => {
  const { t, locale } = useI18n();

  return (
    <Card className="border border-border/40 shadow-premium bg-card/30 backdrop-blur-2xl overflow-hidden h-full flex flex-col rounded-[2.5rem] transition-all duration-500 hover:shadow-premium-lg group">
      <CardHeader className="p-6 md:p-8 border-b border-border/10 bg-muted/[0.03]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
              <Activity size={16} className="text-brand-500" />
              {t('dashboard.activity.title')}
            </CardTitle>
            <p className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-widest pl-7">System Event Ledger</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/5 border border-brand-500/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-500/80">{t('dashboard.activity.live')}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="max-h-[600px] xl:max-h-none overflow-y-auto custom-scrollbar">
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {events.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-10 gap-6 opacity-40">
                   <div className="p-4 rounded-2xl bg-muted/20 text-muted-foreground/20">
                     <Clock size={32} strokeWidth={1} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 leading-relaxed">
                     {t('dashboard.activity.empty')}
                   </p>
                </div>
              ) : (
                events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={cn(
                      "flex items-start gap-5 px-6 py-5 border-b border-border/10 last:border-0 hover:bg-white/[0.02] transition-all duration-300 relative group/item",
                      idx === 0 && "bg-brand-500/[0.03]"
                    )}
                  >
                    {/* Vertical Timeline Thread */}
                    {idx !== events.length - 1 && (
                      <div className="absolute top-12 left-[31px] w-[1px] h-full bg-border/20 group-hover/item:bg-brand-500/10 transition-colors" />
                    )}

                    <div className={cn(
                      "mt-1 p-2 rounded-xl border transition-all duration-300 relative shrink-0 z-10",
                      event.type === 'UP' ? "bg-success/5 border-success/10 text-success/70" :
                        event.type === 'DOWN' ? "bg-danger/5 border-danger/10 text-danger/70" :
                          (event.type === 'PENDING' || event.type === 'DEGRADED') ? "bg-warning/5 border-warning/10 text-warning/70" :
                            "bg-brand-500/5 border-brand-500/10 text-brand-500/70"
                    )}>
                      {event.type === 'UP' && <CheckCircle2 size={14} />}
                      {event.type === 'DOWN' && <XCircle size={14} />}
                      {event.type === 'PENDING' && <Activity size={14} className="animate-pulse" />}
                      {event.type === 'DEGRADED' && <AlertCircle size={14} />}
                      {(event.type === 'PROTECTED' || event.type === 'UNKNOWN') && <Info size={14} />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[14px] font-black text-foreground/80 truncate group-hover/item:text-brand-500 transition-colors tracking-tight">
                          {event.serviceName}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] font-bold text-muted-foreground/30 bg-muted/10 px-2 py-1 rounded-lg border border-border/10">
                          {new Date(event.timestamp).toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[12px] font-bold text-muted-foreground/50 line-clamp-2 leading-relaxed pl-0.5">
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

      <div className="p-6 border-t border-border/10 bg-muted/[0.03] opacity-30 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
           <span>Fleet Log v4.2</span>
           <div className="flex items-center gap-2">
             <div className="h-1 w-1 rounded-full bg-current" />
             <span>Realtime Journal</span>
           </div>
        </div>
      </div>
    </Card>
  );
};
