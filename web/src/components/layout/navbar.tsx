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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('common.dashboard'), href: '/' },
    { label: t('common.services'), href: '/services' },
    { label: t('common.docs'), href: '/docs' },
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
              ? "bg-card/80 backdrop-blur-xl border-border/50 shadow-premium"
              : "bg-card/40 backdrop-blur-md border-transparent"
          )}
        >
          {/* Left: Logo & Status */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full group-hover:bg-brand-500/30 transition-colors" />
                <div className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105 active:scale-95">
                  <Activity size={20} className="md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-black tracking-tighter text-foreground leading-none">
                  PulseOps
                </span>
                <span className="hidden xs:block text-[9px] md:text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em] mt-0.5 opacity-80">
                  Control Center
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1.5 border border-border shadow-inner">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-success glow-green"></span>
              </span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                Live Status
              </span>
            </div>
          </div>

          {/* Center: Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 min-h-[40px] flex items-center",
                    isActive ? "text-brand-600" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Technical Stats & Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden xl:flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground tracking-tighter">
                <Clock size={10} />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "h-1 w-1 rounded-full",
                  isConnected ? "bg-brand-500 animate-pulse" : "bg-danger"
                )} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-border hidden xl:block" />

            <div className="hidden md:flex items-center gap-1 relative user-menu-container">
              <button
                onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
                className="flex h-10 w-12 items-center justify-center rounded-xl text-[10px] font-black text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-90"
              >
                {locale.toUpperCase()}
              </button>

              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-90"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "group flex items-center gap-2 rounded-xl border p-1 pr-3 transition-all active:scale-95",
                  isUserMenuOpen ? "border-brand-500 bg-brand-500/5" : "border-border bg-secondary/50 hover:border-brand-500/50"
                )}
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-[11px] font-black text-white shadow-sm ring-1 ring-white/20">
                  RM
                </div>
                <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-300", isUserMenuOpen && "rotate-180 text-brand-600")} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-64 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-[110]"
                  >
                    <div className="p-4 bg-secondary/30 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-sm font-black text-white">
                          RM
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-foreground">Renaldi Mohamad</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-success glow-green" : "bg-danger")} />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                              {isConnected ? 'System Connected' : 'System Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <a
                        href="https://github.com/renaldimohamad/PulseOps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <GithubIcon size={14} />
                          <span>View Repository</span>
                        </div>
                        <ExternalLink size={10} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={14} />
                          <span>Documentation</span>
                        </div>
                        <ExternalLink size={10} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </a>
                    </div>

                    <div className="p-2 bg-secondary/20 border-t border-border">
                      <button
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-black text-danger hover:bg-danger/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="h-2 w-2 rounded-full bg-danger animate-pulse" />
                        TERMINATE SESSION
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground active:scale-90 transition-transform"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[-1] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="absolute top-full left-0 w-full px-4 pt-2 md:hidden"
            >
              <div className="bg-card rounded-[2rem] border border-border shadow-2xl p-4 space-y-2 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]",
                      pathname === item.href
                        ? "bg-brand-500/10 text-brand-600 border border-brand-500/20"
                        : "text-muted-foreground hover:bg-secondary border border-transparent"
                    )}
                  >
                    {item.href === '/' ? <Monitor size={18} /> : <Activity size={18} />}
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-border grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setLocale(locale === 'en' ? 'id' : 'en');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex h-12 px-5 items-center justify-center gap-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/50 hover:bg-secondary active:scale-95 transition-all"
                  >
                    <Languages size={16} />
                    {locale.toUpperCase()}
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/50 hover:bg-secondary active:scale-95 transition-all"
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {theme.toUpperCase()}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <a
                    href="https://github.com/renaldimohamad/PulseOps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 px-5 items-center gap-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/30 hover:bg-secondary active:scale-95 transition-all border border-transparent hover:border-border"
                  >
                    <GithubIcon size={16} />
                    View Repository
                  </a>
                  <a
                    href="#"
                    className="flex h-12 px-5 items-center gap-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/30 hover:bg-secondary active:scale-95 transition-all border border-transparent hover:border-border"
                  >
                    <FileText size={16} />
                    Documentation
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
