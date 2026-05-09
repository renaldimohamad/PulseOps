'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-end md:items-center justify-center transition-all duration-300 ease-out",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full md:max-w-lg overflow-hidden rounded-t-[2.5rem] md:rounded-[2.5rem] bg-card border-x border-t md:border border-border shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-h-[95dvh] md:max-h-[90dvh] flex flex-col",
          isOpen
            ? "translate-y-0 md:scale-100 md:translate-y-0"
            : "translate-y-full md:scale-95 md:translate-y-4"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 md:px-8 py-5 md:py-6 shrink-0">
          <div>
            <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight uppercase">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 md:h-9 md:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90"
          >
            <X size={20} />
          </Button>
        </div>
        <div className="px-6 md:px-8 py-6 md:py-8 text-foreground overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
