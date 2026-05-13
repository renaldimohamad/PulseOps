'use client';

import { Service } from '@/types/service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ExternalLink, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './empty-state';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/relative-time';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  onAdd: () => void;
}

import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export const ServiceTable = ({ services, onEdit, onDelete, isLoading, onAdd }: ServiceTableProps) => {
  const { t, locale } = useI18n();

  if (isLoading) {
    return (
      <div className="w-full bg-card/50 rounded-2xl border border-border/50 overflow-hidden">
        <div className="divide-y divide-border/30">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 p-4">
        <AnimatePresence initial={false} mode="popLayout">
          {services.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-5 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-muted/40 text-muted-foreground group-hover:text-brand-500 transition-colors">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] md:text-base font-semibold text-foreground/90 leading-tight mb-0.5">{service.name}</h4>
                    <span className="font-mono text-[8px] md:text-sm text-muted-foreground/70 truncate max-w-[150px] block">{service.url}</span>
                  </div>
                </div>
                <Badge status={service.status} />
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-4 border-y border-border/30">
                <div className="space-y-1">
                  <span className="caption block opacity-60 uppercase text-[8px] md:text-xs font-bold tracking-tighter">{t('services.table.response_health')}</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[12px] font-bold text-foreground/80">
                      {service.rawStatus || '---'}
                    </span>
                    <span className="text-[6px] md:text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                      {service.rawStatus === 200 ? t('common.operational') : t('services.table.issue_detected')}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="caption block opacity-60 uppercase text-[8px] md:text-[9px] font-bold tracking-tighter">{t('services.table.network_latency')}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      service.latency && service.latency < 200 ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                        service.latency && service.latency < 500 ? "bg-success/60" :
                          service.latency && service.latency < 800 ? "bg-warning" : "bg-danger animate-pulse"
                    )} />
                    <span className="metric-text text-[10px] md:text-sm font-bold">
                      {service.latency ? `${service.latency}${t('dashboard.analytics.ms')}` : '-'}
                    </span>
                  </div>
                  <span className="text-[6px] md:text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter block">
                    {service.latency ? (service.latency < 200 ? t('common.excellent') : service.latency < 500 ? t('common.healthy') : service.latency < 800 ? t('common.degraded') : t('common.critical')) : t('common.no_data')}
                  </span>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="caption block opacity-60 uppercase text-[8px] md:text-[9px] font-bold tracking-tighter">{t('services.table.last_sync')}</span>
                  <div className="flex items-center justify-between">
                    <RelativeTime 
                      date={service.lastChecked} 
                      className="text-[9px] md:text-[11px] font-bold text-foreground/70"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-[8px] md:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">
                  {service.category}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-muted/20 text-muted-foreground active:scale-95"
                    onClick={() => onEdit(service)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-danger/5 text-danger/70 hover:text-danger active:scale-95"
                    onClick={() => onDelete(service.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/40">
              <th className="px-6 py-4 table-header-premium">{t('services.table.service')}</th>
              <th className="px-6 py-4 table-header-premium">{t('services.table.category')}</th>
              <th className="px-6 py-4 table-header-premium">{t('services.table.status')}</th>
              <th className="px-6 py-4 table-header-premium">{t('services.table.last_response')}</th>
              <th className="px-6 py-4 table-header-premium">{t('services.table.last_latency')}</th>
              <th className="px-6 py-4 table-header-premium">{t('services.table.last_checked')}</th>
              <th className="px-6 py-4 table-header-premium text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            <AnimatePresence initial={false} mode="popLayout">
              {services.map((service) => (
                <motion.tr
                  key={service.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    backgroundColor: ['rgba(14, 145, 233, 0.03)', 'transparent'],
                  }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{
                    duration: 0.4,
                    backgroundColor: { duration: 1 }
                  }}
                  className="group hover:bg-muted/20 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-500/50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl border border-border/40 bg-muted/30 text-muted-foreground/70 transition-colors group-hover:bg-card group-hover:text-brand-500 group-hover:border-brand-500/20",
                      )}>
                        <Activity size={18} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">{service.name}</span>
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/60 hover:text-brand-500 transition-colors truncate max-w-[180px]"
                        >
                          {service.url} <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <Badge status={service.status} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[13px] font-bold text-foreground/80">
                          {service.rawStatus || '---'}
                        </span>
                        {service.rawStatus && (
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter",
                            service.rawStatus >= 200 && service.rawStatus < 300 ? "bg-success/10 text-success/80 border border-success/20" :
                              service.rawStatus >= 400 && service.rawStatus < 500 ? "bg-warning/10 text-warning/80 border border-warning/20" :
                                "bg-danger/10 text-danger/80 border border-danger/20"
                          )}>
                            {service.rawStatus}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-widest">
                        {service.rawStatus === 200 ? t('common.operational') :
                          service.rawStatus === 401 || service.rawStatus === 403 ? t('common.protected') :
                            service.rawStatus === 404 ? `${t('common.degraded')} (404)` :
                              service.rawStatus ? t('common.critical') : t('services.table.issue_detected')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full relative",
                          service.latency && service.latency < 200 ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                            service.latency && service.latency < 500 ? "bg-success/60" :
                              service.latency && service.latency < 800 ? "bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-danger animate-pulse"
                        )} />
                        <motion.span
                          key={service.latency}
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "metric-text text-[13px] font-bold",
                            service.latency && service.latency > 800 ? 'text-danger' :
                              service.latency && service.latency > 500 ? 'text-warning' : 'text-foreground/90'
                          )}
                        >
                          {service.latency ? `${service.latency}${t('dashboard.analytics.ms')}` : '-'}
                        </motion.span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest",
                        service.latency && service.latency < 200 ? "text-success/60" :
                          service.latency && service.latency < 500 ? "text-success/40" :
                            service.latency && service.latency < 800 ? "text-warning/70" : "text-danger/70"
                      )}>
                        {service.latency ? (service.latency < 200 ? t('common.excellent') : service.latency < 500 ? t('common.healthy') : service.latency < 800 ? t('common.degraded') : t('common.critical')) : t('common.no_data')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <RelativeTime 
                        date={service.lastChecked}
                        className="text-[11px] text-foreground/80 font-bold"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground/60 hover:text-brand-500 hover:bg-brand-500/5 transition-colors rounded-lg"
                        onClick={() => onEdit(service)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground/60 hover:text-danger hover:bg-danger/5 transition-colors rounded-lg"
                        onClick={() => onDelete(service.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};


