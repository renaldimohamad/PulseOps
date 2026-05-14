'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Menu, X, ChevronDown, Monitor, Moon, Sun, Languages, ExternalLink, FileText } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

import { cn } from '@/lib/utils';
import { socket } from '@/lib/socket';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

export const Navbar = () => {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsConnected(socket.connected);
  }, []);

  const navItems = [
    { label: t('common.dashboard'), href: '/' },
    { label: t('common.services'), href: '/services' },
    // { label: t('common.docs'), href: '/docs' },
  ];

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen && !(e.target as Element).closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
      socket.off('connect');
      socket.off('disconnect');
      clearInterval(timer);
    };
  }, [isUserMenuOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 z-[100] w-full transition-all duration-500",
        isScrolled ? "py-2" : "py-3 md:py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative flex h-14 md:h-16 items-center justify-between rounded-2xl border px-4 md:px-6 transition-all duration-500",
            isScrolled
              ? "bg-card/70 backdrop-blur-2xl border-border/40 shadow-premium"
              : "bg-card/30 backdrop-blur-md border-transparent"
          )}
        >
          {/* Left: Logo & Status */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/10 blur-xl rounded-full group-hover:bg-brand-500/20 transition-colors" />
                <div className="relative flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/10 transition-transform group-hover:scale-105 active:scale-95">
                  <Activity size={20} className="w-[18px] h-[18px] lg:w-[22px] lg:h-[22px]" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] lg:text-[17px] font-semibold tracking-tight text-foreground/90 leading-none group-hover:text-foreground transition-colors">
                  PulseOps
                </span>
                <span className="hidden xs:block text-[9px] font-semibold uppercase tracking-[0.15em] text-brand-600/80 mt-1">
                  {t('common.control_center')}
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5 border border-border/40">
              <span className="pulse-dot">
                <span className="pulse-dot-inner"></span>
                <span className="pulse-dot-main bg-success/80"></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 whitespace-nowrap">
                {t('dashboard.activity.live')} {t('common.status')}
              </span>
            </div>
          </div>

          {/* Center: Navigation (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/40">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300 min-h-[36px] flex items-center",
                    isActive ? "text-brand-600" : "text-muted-foreground/70 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/60"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Technical Stats & Profile */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden xl:flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground/50 tracking-tight">
                <Clock size={11} className="opacity-60" />
                {mounted
                  ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                  : '--:--:--'
                }
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "h-1 w-1 rounded-full",
                  mounted && isConnected ? "bg-brand-500/60 animate-pulse" : "bg-danger/60"
                )} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {!mounted ? t('common.syncing') : isConnected ? t('common.connected') : t('common.offline')}
                </span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-border/40 hidden xl:block" />

            <div className="hidden lg:flex items-center gap-1 relative user-menu-container">
              <button
                onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
                className="cursor-pointer flex h-9 w-10 items-center justify-center text-[10px] font-bold text-muted-foreground/70 hover:bg-muted/40 hover:text-foreground transition-all active:scale-95 rounded-lg"
              >
                {locale.toUpperCase()}
              </button>

              <button
                onClick={toggleTheme}
                className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground/70 hover:bg-muted/40 hover:text-foreground transition-all active:scale-95"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "group flex items-center gap-2 rounded-lg border p-1 transition-all active:scale-95",
                  isUserMenuOpen ? "border-brand-500/50 bg-brand-500/5" : "border-border/60 bg-muted/30 hover:border-brand-500/30"
                )}
              >
                <div className="cursor-pointer h-7 w-7 rounded-md bg-gradient-to-tr from-brand-600/80 to-brand-400/80 flex items-center justify-center font-mono text-[10px] text-white shadow-sm ring-1 ring-white/10">
                  RM
                </div>
                <ChevronDown size={12} className={cn("text-muted-foreground/60 transition-transform duration-300 pr-0.5", isUserMenuOpen && "rotate-180 text-brand-600")} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute top-full right-0 mt-3 w-64 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/60 shadow-2xl overflow-hidden z-[110]"
                  >
                    <div className="p-4 bg-muted/20 border-b border-border/40">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                          RM
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-foreground/90">Renaldi Mohamad</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={cn("h-1 w-1 rounded-full", mounted && isConnected ? "bg-success/80" : "bg-danger/80")} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                              {!mounted ? t('common.syncing') : isConnected ? t('common.system_connected') : t('common.system_offline')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">
                      {/* <a
                        href="https://github.com/renaldimohamad/PulseOps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 hover:bg-muted/40 hover:text-foreground transition-colors group/item"
                      >
                        <div className="flex items-center gap-3">
                          <GithubIcon size={14} className="opacity-70" />
                          <span>{t('common.view_repository')}</span>
                        </div>
                        <ExternalLink size={10} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </a> */}
                      <a
                        href="/docs"
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 hover:bg-muted/40 hover:text-foreground transition-colors group/item"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={14} className="opacity-70" />
                          <span>{t('common.docs')}</span>
                        </div>
                        <ExternalLink size={10} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </a>
                    </div>

                    <div className="p-1.5 bg-muted/10 border-t border-border/40">
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] text-danger/70 hover:bg-danger/5 hover:text-danger transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-danger/60 animate-pulse" />
                        {t('common.terminate_session')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Toggle */}
            <button
              className="cursor-pointer lg:hidden flex md:h-10 md:w-10items-center justify-center rounded-xl bg-muted/40 text-foreground/80 active:scale-90 transition-transform"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className='w-4 h-4 md:w-6 md:h-6' /> : <Menu className='w-4 h-4 md:w-6 md:h-6' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[-1] lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="absolute top-full left-0 w-full px-4 pt-2 lg:hidden"
            >
              <div className="bg-card/90 backdrop-blur-xl rounded-3xl border border-border/60 shadow-2xl p-4 space-y-1.5 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[8px] md:text-[11px] font-semibold uppercase tracking-widest transition-all active:scale-[0.98]",
                      pathname === item.href
                        ? "bg-brand-500/5 text-brand-600 border border-brand-500/10"
                        : "text-muted-foreground/70 hover:bg-muted/40 border border-transparent"
                    )}
                  >
                    {item.href === '/' ? (
                      <Monitor className="w-3 h-3 md:w-4 md:h-4" />
                    ) : item.href === '/services' ? (
                      <Activity className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <FileText className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-border/40 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setLocale(locale === 'en' ? 'id' : 'en');
                      setIsMobileMenuOpen(false);
                    }}
                    className="cursor-pointer flex h-11 px-5 items-center justify-center gap-3 rounded-2xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/30 hover:bg-muted/50 active:scale-95 transition-all"
                  >
                    <Languages className='w-3 h-3 md:w-4 md:h-4' />
                    {locale.toUpperCase()}
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/30 hover:bg-muted/50 active:scale-95 transition-all"
                  >
                    {theme === 'dark' ? <Sun className='w-3 h-3 md:w-4 md:h-4' /> : <Moon className='w-3 h-3 md:w-4 md:h-4' />}
                    {theme.toUpperCase()}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-1.5 mt-2">
                  {/* <a
                    href="https://github.com/renaldimohamad/PulseOps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 px-5 items-center gap-3 rounded-2xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/20 hover:bg-muted/40 active:scale-95 transition-all border border-transparent"
                  >
                    <GithubIcon className='w-3 h-3 md:w-4 md:h-4' />
                    {t('common.view_repository')}
                  </a> */}
                  <a
                    href="#"
                    className="flex h-11 px-5 items-center gap-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/20 hover:bg-muted/40 active:scale-95 transition-all border border-transparent"
                  >
                    <FileText size={14} />
                    {t('common.docs')}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
