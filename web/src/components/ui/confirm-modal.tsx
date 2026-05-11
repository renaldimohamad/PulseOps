'use client';

import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) => {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-2 md:p-3 rounded-2xl",
            variant === 'danger' ? 'bg-danger/10 text-danger' :
              variant === 'warning' ? 'bg-warning/10 text-warning' : 'bg-brand-500/10 text-brand-600'
          )}>
            <AlertTriangle size={20} className='h-4 w-4 md:h-5 md:w-5' />
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground text-[12px] md:text-[14px] leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-4 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg md:rounded-2xl px-6 h-8 md:h-12 w-full sm:w-auto font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]"
          >
            {cancelText || t('common.cancel')}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className={cn(
              "rounded-lg md:rounded-2xl px-8 h-8 md:h-12 w-full sm:w-auto shadow-lg font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]",
              variant === 'danger' ? 'shadow-danger/20' :
                variant === 'warning' ? 'shadow-warning/20' : 'shadow-brand-500/20'
            )}
          >
            {confirmText || t('common.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
