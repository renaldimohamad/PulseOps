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
      // Use a small delay to ensure the modal is in the DOM before animating
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = 'unset';
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up on unmount just in case
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted && !isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-end md:items-center justify-center transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full md:max-w-lg overflow-hidden rounded-t-[2rem] md:rounded-[2.5rem] bg-card border-x border-t md:border border-border shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-h-[95dvh] md:max-h-[90dvh] flex flex-col",
          isOpen
            ? "translate-y-0 md:scale-100 md:translate-y-0"
            : "translate-y-full md:scale-95 md:translate-y-8"
        )}
      >
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="flex items-center justify-between border-b border-border px-6 md:px-8 py-4 md:py-6 shrink-0">
          <div>
            <h3 className="text-[10px] md:text-[13px] font-black text-foreground tracking-tight uppercase">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90"
          >
            <X size={18} className="md:w-5 md:h-5" />
          </Button>
        </div>
        
        <div className="px-6 md:px-8 py-6 md:py-8 text-foreground overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};
