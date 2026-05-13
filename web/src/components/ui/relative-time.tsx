'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface RelativeTimeProps {
  date: string | Date | null;
  className?: string;
  prefix?: string;
}

export const RelativeTime = ({ date, className, prefix = 'checked' }: RelativeTimeProps) => {
  const { t } = useI18n();
  const [relativeText, setRelativeText] = useState<string>('');

  useEffect(() => {
    if (!date) {
      setRelativeText(t('common.never'));
      return;
    }

    const updateTime = () => {
      const d = typeof date === 'string' ? new Date(date) : date;
      // includeSeconds: true gives us '3 seconds ago' style instead of 'less than a minute'
      const distance = formatDistanceToNow(d, { addSuffix: true, includeSeconds: true });

      setRelativeText(`${prefix} ${distance}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [date, prefix, t]);

  return (
    <span className={cn("whitespace-nowrap", className)}>
      {relativeText}
    </span>
  );
};
