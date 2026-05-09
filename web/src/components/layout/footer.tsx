'use client';

import React from 'react';
import { Activity, Shield, Cpu, Zap } from 'lucide-react';
import { GithubIcon, InstagramIcon } from '@/components/ui/icons';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-md mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">

          {/* Left Section: Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/20 blur-lg rounded-full group-hover:bg-brand-500/30 transition-colors" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-500/20">
                  <Activity size={18} strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground uppercase">
                PulseOps
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Center Section: System Stats */}
          <div className="flex flex-col md:items-center space-y-6">
            <div className="flex flex-wrap gap-4 md:justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Zap size={12} className="text-warning" />
                WebSocket v4
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Shield size={12} className="text-success" />
                Engine Active
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
              {t('footer.version')}
            </div>
          </div>

          {/* Right Section: Creator & Links */}
          <div className="flex flex-col md:items-end space-y-6">
            <div className="flex flex-col md:items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Engineering
              </span>
              <span className="text-sm font-bold text-foreground">
                {t('footer.credit')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hidden sm:block">
                {t('footer.follow_me')}
              </span>
              <div className="flex items-center gap-2">
                <motion.a
                  href="https://github.com/renaldimohamad"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition-all"
                  aria-label="GitHub Repository"
                >
                  <GithubIcon size={20} />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/aldybalagtown/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon size={20} />
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} PulseOps Labs • Built with Next.js & NestJS
          </div>
          <div className="flex items-center gap-6">
            <div className="h-1 w-1 rounded-full bg-brand-500" />
            <div className="h-1 w-1 rounded-full bg-brand-500/50" />
            <div className="h-1 w-1 rounded-full bg-brand-500/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};
