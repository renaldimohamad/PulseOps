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
  Info,
  ShieldCheck,
  ZapOff,
  LineChart,
  TrendingUp,
  AlertTriangle,
  History,
  Component,
  Milestone
} from 'lucide-react';
import { NextjsIcon, NestjsIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const SectionTitle = ({ children, icon: Icon, badge }: { children: React.ReactNode; icon?: any; badge?: string }) => (
  <div className="flex flex-col gap-4 mb-8">
    {badge && (
      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-brand-500 bg-brand-500/5 px-3 py-1.5 rounded-lg border border-brand-500/10 w-fit">
        {badge}
      </span>
    )}
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-brand-500 shadow-inner">
          <Icon size={22} strokeWidth={1.5} />
        </div>
      )}
      <h2 className="text-xs md:text-lg lg:text-lg font-black tracking-tight text-foreground leading-tight uppercase italic">
        {children}
      </h2>
    </div>
  </div>
);

const DocCard = ({ title, description, icon: Icon, children, className }: { title: string; description?: string; icon: any; children?: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={cn(
      "relative p-8 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-2xl shadow-premium overflow-hidden group transition-all duration-500 hover:border-brand-500/20",
      className
    )}
  >
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="mb-6 p-4 rounded-2xl bg-brand-500/5 text-brand-500 w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-brand-500/10 shadow-inner">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h3 className="text-xs md:text-sm font-bold text-foreground mb-3 group-hover:text-brand-500 transition-colors uppercase tracking-tight italic">{title}</h3>
    {description && <p className="text-xs md:text-xs text-muted-foreground/70 leading-relaxed mb-6 font-medium">{description}</p>}
    {children}
  </motion.div>
);

const TechBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 shadow-sm">
    {children}
  </span>
);

export default function DocsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-40 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 md:pt-32 flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-brand-500/[0.05] blur-[160px] rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-500/5 border border-brand-500/10 mb-10 shadow-inner"
        >
          <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_12px_rgba(var(--brand-500),0.8)]" />
          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-brand-500">
            {t('docs.hero.badge')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-2xl lg:text-2xl font-black tracking-tighter text-foreground leading-[1.1] uppercase italic mb-8"
        >
          {t('docs.hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[12px] md:text-sm lg:text-sm font-medium text-muted-foreground/60 leading-relaxed max-w-3xl mb-12"
        >
          {t('docs.hero.subtitle')}
        </motion.p>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <SectionTitle icon={ShieldCheck} badge={t('docs.badges.introduction')}>
            {t('docs.intro.title')}
          </SectionTitle>
          <p className="text-xs md:text-sm text-muted-foreground/70 leading-relaxed font-medium">
            {t('docs.intro.description')}
          </p>
          <div className="p-10 rounded-[3rem] bg-brand-500/[0.03] border border-brand-500/10 relative overflow-hidden group">
            <h4 className="text-xs md:text-lg font-bold text-foreground mb-4 flex items-center gap-3 uppercase tracking-tight italic">
              <Zap size={20} className="text-brand-500" /> {t('docs.intro.goal_title')}
            </h4>
            <p className="text-[12px] md:text-[14px] text-muted-foreground/60 leading-relaxed font-medium">
              {t('docs.intro.goal_desc')}
            </p>
          </div>
        </div>
        <div className="relative aspect-square rounded-[4rem] border border-border/40 bg-card/20 backdrop-blur-3xl overflow-hidden group shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.08] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-[120px] scale-150 animate-pulse" />
              <Activity size={160} strokeWidth={0.5} className="text-brand-500/40 relative animate-slow-spin" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOGIC SECTION */}
      <section>
        <SectionTitle icon={Terminal} badge={t('docs.badges.intelligent_agent')}>
          {t('docs.logic.title')}
        </SectionTitle>
        <p className="text-[12px] md:text-sm text-muted-foreground/50 mb-16 max-w-2xl font-medium leading-relaxed">
          {t('docs.logic.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DocCard title={t('docs.logic.op')} description={t('docs.logic.op_desc')} icon={ShieldCheck} />
          <DocCard title={t('docs.logic.prot')} description={t('docs.logic.prot_desc')} icon={Lock} />
          <DocCard title={t('docs.logic.conf')} description={t('docs.logic.conf_desc')} icon={Info} />
          <DocCard title={t('docs.logic.off')} description={t('docs.logic.off_desc')} icon={ZapOff} />
        </div>
      </section>

      {/* 4. ARCHITECTURE & STACK */}
      <section className="relative">
        <SectionTitle icon={Layers} badge={t('docs.badges.engineering')}>
          {t('docs.architecture.title')}
        </SectionTitle>
        <p className="text-base text-muted-foreground/50 mb-16 max-w-2xl font-medium leading-relaxed">
          {t('docs.architecture.description')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <DocCard title={t('docs.architecture.frontend')} icon={Globe}>
            <p className="text-[12px] md:text-[13px] text-muted-foreground/60 mb-8 leading-relaxed">
              {t('docs.architecture.frontend_desc')}
            </p>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-500/60">{t('docs.stack.core_stack')}</div>
              <div className="flex flex-wrap gap-2">
                <TechBadge>{t('docs.stack.next_desc')}</TechBadge>
                <TechBadge>{t('docs.stack.tailwind_desc')}</TechBadge>
                <TechBadge>{t('docs.stack.framer_desc')}</TechBadge>
              </div>
            </div>
          </DocCard>

          <DocCard title={t('docs.architecture.backend')} icon={Server}>
            <p className="text-[13px] text-muted-foreground/60 mb-8 leading-relaxed">
              {t('docs.architecture.backend_desc')}
            </p>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-500/60">{t('docs.stack.engine')}</div>
              <div className="flex flex-wrap gap-2">
                <TechBadge>{t('docs.stack.nestjs')}</TechBadge>
                <TechBadge>{t('docs.stack.socket_desc')}</TechBadge>
                <TechBadge>{t('docs.stack.postgres_desc')}</TechBadge>
              </div>
            </div>
          </DocCard>

          <DocCard title={t('docs.architecture.sync')} icon={Zap}>
            <p className="text-[13px] text-muted-foreground/60 mb-8 leading-relaxed">
              {t('docs.architecture.telemetry_desc')}
            </p>
            <div className="p-5 rounded-2xl bg-muted/20 border border-border/40">
              <p className="text-[12px] text-muted-foreground/60 leading-relaxed font-medium">
                {t('docs.architecture.flow_desc')}
              </p>
            </div>
          </DocCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StackCard icon={NextjsIcon} title="Next.js" desc={t('docs.stack.nextjs')} color="from-black to-zinc-800" />
          <StackCard icon={NestjsIcon} title="NestJS" desc={t('docs.stack.nestjs')} color="from-red-600 to-red-800" />
          <StackCard icon={Database} title="Prisma" desc={t('docs.stack.prisma')} color="from-blue-600 to-indigo-800" />
          <StackCard icon={Zap} title="WebSocket" desc={t('docs.stack.websocket')} color="from-brand-600 to-brand-800" />
        </div>
      </section>

      {/* 5. LIFECYCLE FLOW */}
      <section className="bg-muted/10 rounded-[4rem] p-10 md:p-24 border border-border/40 relative overflow-hidden">
        <SectionTitle icon={Workflow} badge={t('docs.badges.realtime_engine')}>
          {t('docs.flow.title')}
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-6 group">
              <div className="h-12 w-12 rounded-2xl bg-card border border-border/60 flex items-center justify-center font-black text-lg text-brand-500 shadow-premium">
                {i}
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] md:text-xs font-bold text-foreground uppercase tracking-tight italic">
                  {t(`docs.flow.step${i}`)}
                </h4>
                <p className="text-[10px] md:text-[11px] text-muted-foreground/60 leading-relaxed font-medium">
                  {t(`docs.flow.step${i}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MANIFESTO & PRINCIPLES */}
      <section className="relative overflow-hidden rounded-2xl bg-foreground text-background p-12 md:p-32 shadow-3xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-brand-500/20 to-transparent pointer-events-none opacity-40" />
        <div className="relative z-10 space-y-24">
          <div className="space-y-6 text-center md:text-left">
            <span className="text-[10px] font-black text-brand-500 tracking-[0.5em] uppercase">{t('docs.manifesto')}</span>
            <h2 className="text-sm md:text-xl lg:text-xl font-black tracking-tighter text-background uppercase leading-tight italic">
              {t('docs.principles.title')}
            </h2>
            <p className="text-xs md:text-xs lg:text-xs text-background/40 font-medium max-w-2xl uppercase tracking-widest leading-relaxed">
              {t('docs.principles.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-8">
                <div className="h-[2px] w-16 bg-brand-500/60" />
                <h4 className="text-xs md:text-xs lg:text-xs font-black text-background uppercase tracking-tight italic">{t(`docs.principles.p${i}`)}</h4>
                <p className="text-xs md:text-xs lg:text-xs text-background/40 leading-relaxed font-medium">
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
    <h4 className="text-base font-semibold text-foreground/90 mb-3 group-hover:text-foreground transition-colors">{title}</h4>
    <p className="text-[11px] md:text-[13px] text-foreground/50 leading-relaxed font-normal">{desc}</p>
  </div>
);
