'use client';

import { useState, useEffect, useRef } from 'react';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Globe, Tag, Info, Clock } from 'lucide-react';

interface ServiceFormProps {
  initialData?: Service | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

import { useI18n } from '@/lib/i18n';

export const ServiceForm = ({ initialData, onSubmit, isLoading }: ServiceFormProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    checkInterval: 60,
  });

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        url: initialData.url,
        category: initialData.category,
        checkInterval: initialData.checkInterval,
      });
    } else {
      setFormData({ name: '', url: '', category: '', checkInterval: 60 });
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyles = "w-full rounded-2xl border border-border bg-secondary/30 px-5 py-4 md:py-3 text-base md:text-sm font-medium transition-all focus:bg-card focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 placeholder:text-muted-foreground/50 placeholder:font-normal text-foreground min-h-[48px]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          <Info size={12} className="text-brand-600" /> {t('services.form.name')}
        </label>
        <input
          ref={firstInputRef}
          type="text"
          required
          className={inputStyles}
          placeholder={t('services.form.placeholder_name')}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          <Globe size={12} className="text-brand-600" /> {t('services.form.url')}
        </label>
        <input
          type="url"
          required
          className={inputStyles}
          placeholder={t('services.form.placeholder_url')}
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          <Tag size={12} className="text-brand-600" /> {t('services.form.category')}
        </label>
        <input
          type="text"
          required
          className={inputStyles}
          placeholder={t('services.form.placeholder_category')}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          <Clock size={12} className="text-brand-600" /> {t('services.form.interval')}
        </label>
        <input
          type="number"
          required
          min={10}
          max={3600}
          className={inputStyles}
          value={formData.checkInterval}
          onChange={(e) => setFormData({ ...formData, checkInterval: parseInt(e.target.value) || 60 })}
        />
      </div>

      <div className="pt-4 md:pt-2">
        <Button
          type="submit"
          className="w-full h-14 md:h-12 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700 rounded-2xl active:scale-[0.98] transition-all"
          isLoading={isLoading}
        >
          {initialData ? t('common.save') : t('services.add_service')}
        </Button>
      </div>
    </form>
  );
};
