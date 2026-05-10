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
      <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-600/80 bg-brand-500/5 px-3 py-1 rounded-full border border-brand-500/10 w-fit">
        {badge}
      </span>
    )}
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-brand-500/80">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground/90 uppercase">
        {children}
      </h2>
    </div>
  </div>
);

const DocCard = ({ title, description, icon: Icon, children }: { title: string; description?: string; icon: any; children?: React.ReactNode }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="relative p-8 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="mb-6 p-3 rounded-2xl bg-brand-500/5 text-brand-500/80 w-fit group-hover:scale-105 transition-transform duration-500 border border-transparent group-hover:border-brand-500/10">
      <Icon size={22} strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-semibold text-foreground/90 mb-3 group-hover:text-foreground transition-colors">{title}</h3>
    {description && <p className="text-[14px] text-foreground/50 leading-relaxed mb-6 font-normal">{description}</p>}
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/[0.03] blur-[120px] rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10" />
        </div>

        <div className="max-w-4xl space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/5 border border-brand-500/10 w-fit"
          >
            <span className="pulse-dot">
              <span className="pulse-dot-inner"></span>
              <span className="pulse-dot-main bg-brand-500/80"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600/80">
              {t('docs.hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]"
            style={{ letterSpacing: '-0.025em' }}
          >
            {t('docs.hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-foreground/40 leading-relaxed max-w-2xl tracking-normal"
          >
            {t('docs.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <SectionTitle icon={BookOpen} badge="Introduction">
            {t('docs.intro.title')}
          </SectionTitle>
          <p className="text-[17px] text-foreground/60 leading-relaxed font-normal">
            {t('docs.intro.description')}
          </p>
          <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/40 space-y-4">
            <h4 className="text-[15px] font-semibold text-foreground/90 flex items-center gap-2.5">
              <Shield size={18} className="text-success/70" /> {t('docs.intro.goal_title')}
            </h4>
            <p className="text-[14px] text-foreground/50 leading-relaxed font-normal">
              {t('docs.intro.goal_desc')}
            </p>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-auto md:h-[450px] rounded-[3.5rem] border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.05] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/10 blur-[100px] scale-150 animate-pulse" />
              <Activity size={120} strokeWidth={0.5} className="text-brand-500/40 relative" />
            </div>
          </div>
          {/* Animated pulses */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0.3 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-brand-500/10 rounded-full"
            />
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section>
        <SectionTitle icon={Layers} badge="Engineering">
          {t('docs.architecture.title')}
        </SectionTitle>
        <p className="text-[17px] text-foreground/50 mb-12 max-w-2xl font-normal leading-relaxed">{t('docs.architecture.description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <DocCard title={t('docs.architecture.frontend')} icon={Globe}>
            <div className="space-y-3 mt-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-600/60">Core Stack</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">Next.js 14+</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">Tailwind</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">Framer</span>
              </div>
            </div>
          </DocCard>
          <DocCard title={t('docs.architecture.backend')} icon={Server}>
            <div className="space-y-3 mt-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-600/60">Engine</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">NestJS</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">Socket.io</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">PostgreSQL</span>
              </div>
            </div>
          </DocCard>
          <DocCard title={t('docs.architecture.sync')} icon={Zap}>
            <p className="text-[14px] text-foreground/50 leading-relaxed font-normal mt-6">
              {t('docs.architecture.flow_desc')}
            </p>
          </DocCard>

          {/* Connectors (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-[31.5%] w-[4%] h-[1px] bg-border/40 -translate-y-1/2" />
          <div className="hidden lg:block absolute top-1/2 left-[64.5%] w-[4%] h-[1px] bg-border/40 -translate-y-1/2" />
        </div>
      </section>

      {/* Monitoring Flow */}
      <section className="bg-muted/10 rounded-[4rem] p-8 md:p-20 border border-border/40 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/[0.02] blur-[120px] -z-10" />

        <SectionTitle icon={Workflow} badge="Realtime Engine">
          {t('docs.flow.title')}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4 mt-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col gap-6 group">
              <div className="flex items-center gap-3">
                <div className="font-mono text-[10px] h-7 w-7 rounded-lg bg-card border border-border/60 flex items-center justify-center text-brand-600/70 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                  {i}
                </div>
                {i < 6 && <div className="hidden lg:block flex-1 h-[1px] bg-border/30 group-hover:bg-brand-500/20 transition-colors" />}
              </div>
              <div className="space-y-2 pr-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/80 group-hover:text-foreground transition-colors">
                  {t(`docs.flow.step${i}`)}
                </h4>
                <p className="text-[10px] font-medium uppercase tracking-wider text-foreground/30 opacity-0 group-hover:opacity-100 transition-all duration-500">
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
        <p className="text-[17px] text-foreground/50 mb-12 max-w-2xl font-normal leading-relaxed">{t('docs.logic.description')}</p>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <StackCard icon={NextjsIcon} title="Next.js" desc={t('docs.stack.nextjs')} color="from-black to-zinc-800" />
          <StackCard icon={NestjsIcon} title="NestJS" desc={t('docs.stack.nestjs')} color="from-red-600 to-red-800" />
          <StackCard icon={Database} title="Prisma" desc={t('docs.stack.prisma')} color="from-blue-600 to-indigo-800" />
          <StackCard icon={Zap} title="WebSocket" desc={t('docs.stack.websocket')} color="from-brand-600 to-brand-800" />
        </div>
      </section>

      {/* Principles Section */}
      <section className="relative overflow-hidden rounded-[4rem] bg-foreground text-background p-12 md:p-24 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-brand-500/10 to-transparent pointer-events-none opacity-40" />

        <div className="relative z-10 space-y-20">
          <div className="space-y-6">
            <span className="text-[11px] font-bold text-brand-500 tracking-[0.4em] uppercase">Manifesto</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-background uppercase leading-tight">
              {t('docs.principles.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-6">
                <div className="h-[2px] w-12 bg-brand-500/60" />
                <h4 className="text-xl font-bold text-background uppercase tracking-tight">{t(`docs.principles.p${i}`)}</h4>
                <p className="text-[14px] font-medium text-background/40 leading-relaxed">
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
  <div className="group relative p-8 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-300 overflow-hidden">
    <div className={cn("absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full", color)} />
    <div className="mb-6 p-3 rounded-2xl bg-muted/40 w-fit group-hover:scale-105 transition-transform duration-500 border border-transparent group-hover:border-border/40">
      <Icon size={22} strokeWidth={1.5} className="text-foreground/80" />
    </div>
    <h4 className="text-lg font-semibold text-foreground/90 mb-3 group-hover:text-foreground transition-colors">{title}</h4>
    <p className="text-[14px] text-foreground/50 leading-relaxed font-normal">{desc}</p>
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
