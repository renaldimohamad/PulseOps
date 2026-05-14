'use client';

import { motion } from 'framer-motion';
import { Plus, Server, Activity, Search, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  onAdd: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
  hint?: string;
}

export const EmptyState = ({
  onAdd,
  title,
  description,
  actionLabel,
  hint
}: EmptyStateProps) => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 min-h-[600px] text-center animate-in fade-in duration-1000"
    >
      {/* Central Infrastructure Illustration */}
      <div className="relative mb-12">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 blur-[100px] bg-brand-500/10 rounded-full scale-150 animate-pulse" />

        <div className="relative flex items-center justify-center h-56 w-56 md:h-64 md:w-64">
          {/* Animated Orbiting Icons */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-border/20 rounded-full"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 border border-dashed border-border/10 rounded-full"
          />

          {/* Central Monitor Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="z-10 p-8 md:p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-premium flex items-center justify-center relative group backdrop-blur-3xl"
          >
            <div className="absolute inset-0 bg-brand-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
            <Server size={56} className="text-brand-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" strokeWidth={1} />

            {/* Pulse Indicator */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-20"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-500/20 border border-brand-500/40" />
            </span>
          </motion.div>

          {/* Floating Satellites */}
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-8 p-3 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-sm text-muted-foreground/30"
          >
            <Globe size={20} />
          </motion.div>

          <motion.div
            animate={{ x: [0, -15, 0], y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-4 p-3 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-sm text-muted-foreground/30"
          >
            <Database size={20} />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-8 left-16 text-brand-500/20"
          >
            <Search size={28} />
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-lg space-y-5 px-4">
        <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight uppercase leading-tight">
          {title || "No infrastructure connected"}
        </h2>
        <p className="text-[10px] md:text-[12px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] leading-relaxed max-w-sm mx-auto">
          {description || "PulseOps is ready to monitor your services, APIs, and infrastructure endpoints in real time."}
        </p>
      </div>

      {/* Action Section */}
      <div className="mt-12 flex flex-col items-center gap-8 w-full max-w-xs mx-auto">
        <Button
          onClick={onAdd}
          className={cn(
            "w-full h-14 rounded-2xl bg-brand-600 text-white font-black uppercase tracking-[0.2em] text-[10px]",
            "shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]",
            "hover:bg-brand-500 active:scale-[0.97] transition-all duration-500 group/btn"
          )}
        >
          <Plus size={18} className="mr-3 transition-transform group-hover/btn:rotate-90" />
          {actionLabel || "Add First Service"}
        </Button>

        <div className="flex items-center gap-3 opacity-20 hover:opacity-50 transition-opacity">
          <Activity size={12} className="text-brand-500" />
          <p className="text-[8px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
            {hint || "Start by connecting an API, website, or server endpoint."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
