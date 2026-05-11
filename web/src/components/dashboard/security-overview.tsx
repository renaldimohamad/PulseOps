'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Globe, AlertTriangle, Fingerprint } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export const SecurityOverview = () => {
  const { t } = useI18n();
  const [threatLevel, setThreatLevel] = useState(12);
  const [blockedToday, setBlockedToday] = useState(1240);
  const [isScanning, setIsScanning] = useState(true);

  // Simulate realtime fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
      setBlockedToday(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const securityMetrics = [
    { label: 'WAF Filter', value: '99.9%', icon: ShieldCheck, color: 'text-success' },
    { label: 'SSL Valid', value: '100%', icon: Lock, color: 'text-brand-500' },
    { label: 'Blocked IPs', value: blockedToday.toLocaleString(), icon: Globe, color: 'text-danger' },
    { label: 'Encryption', value: 'AES-256', icon: Fingerprint, color: 'text-brand-400' },
  ];

  return (
    <Card className="relative h-full overflow-hidden border border-border/40 bg-card/40 backdrop-blur-xl group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <ShieldCheck size={200} />
      </div>

      <div className="p-6 md:p-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-md md:text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="text-brand-500 md:w-6 md:h-6 w-4 h-4" size={20} />
              {t('dashboard.security.title')}
            </h3>
            <p className="text-[7px] md:text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
              {t('dashboard.security.threat_intel')}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-brand-500"
            />
            <span className="text-[8px] md:text-[10px] font-bold text-brand-500 uppercase tracking-widest">{t('dashboard.security.scanning')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Main Visualization: Security Pulse */}
          <div className="relative flex items-center justify-center min-h-[200px] bg-muted/10 rounded-3xl border border-border/40 overflow-hidden">
            {/* Animated Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [0.8, 1.5],
                    opacity: [0.3, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "easeOut"
                  }}
                  className="absolute w-32 h-32 border border-brand-500/20 rounded-full"
                />
              ))}
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full" />
                <div className="relative h-24 w-24 rounded-full border-2 border-brand-500/30 flex flex-col items-center justify-center bg-card shadow-xl">
                  <span className="text-2xl font-mono font-bold text-foreground">
                    {threatLevel}
                  </span>
                  <span className="text-[8px] font-bold uppercase text-muted-foreground">{t('dashboard.security.threats')}</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[8px] md:text-[8px] font-bold text-foreground uppercase tracking-widest">{t('dashboard.security.status_protected')}</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={cn("h-1 w-4 rounded-full", i <= 4 ? "bg-success" : "bg-muted")} />
                  ))}
                </div>
              </div>
            </div>

            {/* Ambient Mesh */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, var(--brand-500) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
            />
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-4">
            {securityMetrics.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-1.5 rounded-lg bg-background shadow-sm", m.color)}>
                    <m.icon size={14} />
                  </div>
                  <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase">{m.label}</span>
                </div>
                <div className="text-[12px] md:text-xl font-mono font-bold text-foreground">
                  {m.value}
                </div>
              </div>
            ))}

            {/* System Log Snippet */}
            <div className="col-span-2 p-3 rounded-xl bg-card/50 border border-border/20 font-mono text-[9px] text-muted-foreground/80">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-1 w-1 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-foreground/60 uppercase tracking-tighter">{t('dashboard.security.live_logs')}</span>
              </div>
              <div className="space-y-0.5 opacity-60">
                <p>&gt; {t('dashboard.security.log_established')} 192.168.1.42</p>
                <p>&gt; {t('dashboard.security.log_rule_applied')}</p>
                <p className="text-brand-500">&gt; {t('dashboard.security.log_mitigated')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase">
            <AlertTriangle className="text-warning w-4 h-4" />
            <span className="md:text-[10px] text-[8px]">
              {t('dashboard.security.alerts_24h', { count: 0 })}
            </span>
          </div>
          <button className="md:text-[10px] text-[6px] font-bold text-brand-500 uppercase tracking-widest hover:underline text-center">
            {t('dashboard.security.security_dashboard')} &rarr;
          </button>
        </div>
      </div>
    </Card>
  );
};
