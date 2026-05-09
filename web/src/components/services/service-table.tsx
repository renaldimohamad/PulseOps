'use client';

import { Service } from '@/types/service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ExternalLink, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './empty-state';
import { cn } from '@/lib/utils';

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
    // ... (Loading state remains the same)
    return (
      <div className="w-full bg-card">
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
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
      <div className="md:hidden space-y-4 p-4 bg-background/50">
        <AnimatePresence initial={false} mode="popLayout">
          {services.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, backgroundColor: 'var(--card)' }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-5 rounded-3xl border border-border bg-card shadow-sm overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover:text-brand-600 transition-colors">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground leading-none mb-1">{service.name}</h4>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px] block">{service.url}</span>
                  </div>
                </div>
                <Badge status={service.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">{t('services.table.latency')}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      service.latency && service.latency < 200 ? "bg-success" :
                        service.latency && service.latency < 500 ? "bg-warning" : "bg-danger"
                    )} />
                    <span className="font-mono text-xs font-bold text-foreground">
                      {service.latency ? `${service.latency}ms` : '-'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">{t('services.table.last_checked')}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {service.lastChecked ? formatDistanceToNow(new Date(service.lastChecked)) : '-'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground border border-border uppercase">
                  {service.category}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-xl bg-muted/30 text-muted-foreground active:scale-90"
                    onClick={() => onEdit(service)}
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-xl bg-danger/10 text-danger active:scale-90"
                    onClick={() => onDelete(service.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto bg-card">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">{t('services.table.service')}</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">{t('services.table.category')}</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">{t('services.table.status')}</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">{t('services.table.latency')}</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">{t('services.table.last_checked')}</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence initial={false} mode="popLayout">
              {services.map((service) => (
                <motion.tr
                  key={service.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    backgroundColor: ['rgba(14, 145, 233, 0.05)', 'transparent'],
                  }}
                  exit={{ opacity: 0, x: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  transition={{
                    duration: 0.5,
                    backgroundColor: { duration: 1.5 }
                  }}
                  className="group hover:bg-brand-500/5 transition-colors duration-300 ease-out border-l-4 border-l-transparent hover:border-l-brand-500 relative"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors group-hover:bg-card group-hover:text-brand-600 group-hover:border-brand-500/30",
                      )}>
                        <Activity size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">{service.name}</span>
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand-600 transition-colors truncate max-w-[200px]"
                        >
                          {service.url} <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground border border-border uppercase tracking-tight">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <Badge status={service.status} />
                      {service.status === 'DOWN' && service.rawStatus && (
                        <span className="text-[10px] text-danger font-bold uppercase tracking-tighter">
                          {service.rawStatus === 404 && 'Misconfigured (404)'}
                          {(service.rawStatus === 401 || service.rawStatus === 403) && 'Auth Required'}
                          {service.rawStatus >= 500 && 'Server Error'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        service.latency && service.latency < 200 ? "bg-success" :
                          service.latency && service.latency < 500 ? "bg-warning" : "bg-danger"
                      )} />
                      <span className={cn(
                        "font-mono text-xs font-bold",
                        service.latency && service.latency > 500 ? 'text-warning' : 'text-muted-foreground'
                      )}>
                        {service.latency ? `${service.latency}ms` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-muted-foreground">
                    {service.lastChecked
                      ? `${formatDistanceToNow(new Date(service.lastChecked))} ${locale === 'en' ? 'ago' : 'lalu'}`
                      : 'Never'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-brand-600 hover:bg-brand-500/10 transition-colors"
                        onClick={() => onEdit(service)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                        onClick={() => onDelete(service.id)}
                      >
                        <Trash2 size={16} />
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

