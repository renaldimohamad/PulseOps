'use client';

import React from 'react';
import { Activity, Shield, Cpu, Zap } from 'lucide-react';
import { GithubIcon, InstagramIcon } from '@/components/ui/icons';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full border-t border-border/20 bg-background/30 backdrop-blur-md mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">

          {/* Left Section: Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-500/10 transition-transform duration-500 group-hover:scale-105">
                <Activity size={16} strokeWidth={1.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground/90 uppercase">
                PulseOps
              </span>
            </div>
            <p className="text-[13px] font-medium text-foreground/50 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Center Section: System Stats */}
          <div className="flex flex-col md:items-center space-y-6">
            <div className="flex flex-wrap gap-3 md:justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/5 border border-success/10 text-[9px] font-bold uppercase tracking-widest text-success/60">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success/80"></span>
                </span>
                {t('footer.active_engine')}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-border/40 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">
                <Shield size={10} className="text-success/70" />
                Pulse v4.2
              </div>
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.4em] text-muted-foreground/30">
              {t('footer.version')}
            </div>
          </div>

          {/* Right Section: Creator & Links */}
          <div className="flex flex-col md:items-end space-y-6">
            <div className="flex flex-col md:items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">
                {t('footer.engineering')}
              </span>
              <span className="text-[13px] font-semibold text-foreground/70">
                {t('footer.credit')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <motion.a
                href="https://github.com/renaldimohamad"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1 }}
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/30 border border-border/40 text-muted-foreground/70 hover:text-foreground hover:border-brand-500/30 transition-all"
                aria-label="GitHub Repository"
              >
                <GithubIcon size={18} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/aldybalagtown/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1 }}
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/30 border border-border/40 text-muted-foreground/70 hover:text-foreground hover:border-pink-500/30 transition-all"
                aria-label="Instagram Profile"
              >
                <InstagramIcon size={18} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/[0.05] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-medium text-foreground/20 uppercase tracking-[0.25em]">
            © {new Date().getFullYear()} PulseOps Labs • {t('footer.tagline').split('.')[0]}
          </div>
          <div className="flex items-center gap-3 opacity-20">
            <div className="h-1 w-1 rounded-full bg-brand-500" />
            <div className="h-1 w-1 rounded-full bg-brand-500" />
            <div className="h-1 w-1 rounded-full bg-brand-500" />
          </div>
        </div>
      </div>
    </footer>


  );
};
