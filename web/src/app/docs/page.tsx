'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import {
  Activity,
  Shield,
  Zap,
  Database,
  Cpu,
  Network,
  ArrowRight,
  Code,
  Layers,
  Smartphone,
  BookOpen,
  Terminal,
  Workflow,
  Box,
  Server,
  Globe,
  Lock,
  Cloud,
  RefreshCw,
  Info
} from 'lucide-react';
import { NextjsIcon, NestjsIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const SectionTitle = ({ children, icon: Icon, badge }: { children: React.ReactNode; icon?: any; badge?: string }) => (
  <div className="flex flex-col gap-4 mb-8">
    {badge && (
      <span className="w-fit px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black uppercase tracking-widest text-brand-600">
        {badge}
      </span>
    )}
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2.5 rounded-xl bg-secondary/50 border border-border text-brand-600 shadow-inner">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      )}
      <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">
        {children}
      </h2>
    </div>
  </div>
);

const DocCard = ({ title, description, icon: Icon, children }: { title: string; description?: string; icon: any; children?: React.ReactNode }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="relative p-8 rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm shadow-premium overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="mb-6 p-3 rounded-2xl bg-brand-500/10 text-brand-600 w-fit group-hover:scale-110 transition-transform duration-500">
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{title}</h3>
    {description && <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">{description}</p>}
    {children}
  </motion.div>
);

export default function DocsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-32 pb-32 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full bg-[grid-black/[0.02]] dark:bg-[grid-white/[0.02]] bg-[size:32px_32px]" />
        </div>

        <div className="max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 w-fit"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">
              {t('docs.hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]"
          >
            {t('docs.hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed max-w-2xl"
          >
            {t('docs.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <SectionTitle icon={BookOpen} badge="Introduction">
            {t('docs.intro.title')}
          </SectionTitle>
          <p className="text-lg font-medium text-muted-foreground leading-relaxed">
            {t('docs.intro.description')}
          </p>
          <div className="p-6 rounded-3xl bg-secondary/50 border border-border space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Shield size={18} className="text-success" /> {t('docs.intro.goal_title')}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('docs.intro.goal_desc')}
            </p>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-[3rem] border border-border bg-card overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-[100px] scale-150 animate-pulse" />
              <Activity size={120} strokeWidth={1} className="text-brand-600 relative opacity-40" />
            </div>
          </div>
          {/* Animated pulses */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-brand-500/30 rounded-full"
            />
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section>
        <SectionTitle icon={Layers} badge="Engineering">
          {t('docs.architecture.title')}
        </SectionTitle>
        <p className="text-muted-foreground mb-12 max-w-2xl">{t('docs.architecture.description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <DocCard title={t('docs.architecture.frontend')} icon={Globe}>
            <div className="space-y-2 mt-4">
              <div className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Stack</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold border border-border">Next.js 14+</span>
                <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold border border-border">TailwindCSS</span>
                <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold border border-border">Framer Motion</span>
              </div>
            </div>
          </DocCard>
          <DocCard title={t('docs.architecture.backend')} icon={Server}>
            <div className="space-y-2 mt-4">
              <div className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Stack</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold border border-border">NestJS</span>
                <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold border border-border">Socket.io</span>
                <span className="px-2 py-1 rounded-lg bg-secondary text-[10px] font-bold border border-border">PostgreSQL</span>
              </div>
            </div>
          </DocCard>
          <DocCard title={t('docs.architecture.sync')} icon={Zap}>
            <p className="text-xs text-muted-foreground leading-relaxed mt-4">
              {t('docs.architecture.flow_desc')}
            </p>
          </DocCard>

          {/* Connectors (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-[31%] w-[6%] h-px bg-gradient-to-r from-brand-500/50 to-brand-500/10 -translate-y-1/2" />
          <div className="hidden md:block absolute top-1/2 left-[64%] w-[6%] h-px bg-gradient-to-r from-brand-500/10 to-brand-500/50 -translate-y-1/2" />
        </div>
      </section>

      {/* Monitoring Flow */}
      <section className="bg-secondary/30 rounded-[3rem] p-8 md:p-16 border border-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 blur-[100px] -z-10" />

        <SectionTitle icon={Workflow} badge="Realtime Engine">
          {t('docs.flow.title')}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col gap-4 group">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-black text-brand-600 shadow-sm group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  0{i}
                </div>
                {i < 6 && <div className="hidden md:block flex-1 h-px bg-border group-hover:bg-brand-500/30 transition-colors" />}
              </div>
              <div className="space-y-1 pr-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
                  {t(`docs.flow.step${i}`)}
                </h4>
                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                  {t(`docs.flow.step${i}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logic Section */}
      <section>
        <SectionTitle icon={Terminal} badge="Intelligent Agent">
          {t('docs.logic.title')}
        </SectionTitle>
        <p className="text-muted-foreground mb-12 max-w-2xl">{t('docs.logic.description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DocCard title={t('docs.logic.op')} description={t('docs.logic.op_desc')} icon={CheckCircle} />
          <DocCard title={t('docs.logic.prot')} description={t('docs.logic.prot_desc')} icon={Lock} />
          <DocCard title={t('docs.logic.conf')} description={t('docs.logic.conf_desc')} icon={Info} />
          <DocCard title={t('docs.logic.off')} description={t('docs.logic.off_desc')} icon={XCircle} />
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <SectionTitle icon={Box} badge="Infrastructure">
          {t('docs.stack.title')}
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StackCard icon={NextjsIcon} title="Next.js" desc={t('docs.stack.nextjs')} color="from-black to-zinc-800" />
          <StackCard icon={NestjsIcon} title="NestJS" desc={t('docs.stack.nestjs')} color="from-red-600 to-red-800" />
          <StackCard icon={Database} title="Prisma" desc={t('docs.stack.prisma')} color="from-blue-600 to-indigo-800" />
          <StackCard icon={Zap} title="WebSocket" desc={t('docs.stack.websocket')} color="from-brand-600 to-brand-800" />
        </div>
      </section>

      {/* Principles Section */}
      <section className="relative overflow-hidden rounded-[3.5rem] bg-foreground text-background p-12 md:p-24">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-brand-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-16">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-500">Manifesto</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              {t('docs.principles.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-px w-12 bg-brand-500" />
                <h4 className="text-xl font-bold uppercase tracking-tight">{t(`docs.principles.p${i}`)}</h4>
                <p className="text-sm font-medium text-background/60 leading-relaxed">
                  {t(`docs.principles.p${i}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const StackCard = ({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) => (
  <div className="group relative p-6 rounded-3xl border border-border bg-card/50 hover:bg-card transition-colors overflow-hidden">
    <div className={cn("absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full", color)} />
    <div className="mb-4 p-3 rounded-2xl bg-secondary w-fit group-hover:scale-110 transition-transform duration-500">
      <Icon size={24} strokeWidth={2.5} className="text-foreground" />
    </div>
    <h4 className="text-lg font-bold text-foreground mb-2 tracking-tight">{title}</h4>
    <p className="text-xs font-medium text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

// Fallback for missing icons
const CheckCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
