'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Loader2, Bell, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== 'loading') {
      setTimeout(() => removeToast(id), 5000);
    }
  }, [removeToast]);

  const success = (message: string) => toast(message, 'success');
  const error = (message: string) => toast(message, 'error');
  const info = (message: string) => toast(message, 'info');

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-4 overflow-hidden rounded-2xl border bg-card p-4 shadow-premium transition-all duration-500 animate-in slide-in-from-right-full fade-in",
        toast.type === 'success' ? "border-success/30" : 
        toast.type === 'error' ? "border-danger/30" : "border-border"
      )}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        toast.type === 'success' ? "bg-success/10 text-success" : 
        toast.type === 'error' ? "bg-danger/10 text-danger" : "bg-brand-500/10 text-brand-600"
      )}>
        {toast.type === 'success' && <CheckCircle2 size={20} />}
        {toast.type === 'error' && <XCircle size={20} />}
        {toast.type === 'info' && <Bell size={20} />}
        {toast.type === 'loading' && <Loader2 size={20} className="animate-spin" />}
      </div>
      <p className="flex-1 text-sm font-semibold text-foreground leading-snug">{toast.message}</p>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
