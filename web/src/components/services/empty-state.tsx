import { Button } from "@/components/ui/button";
import { Plus, MonitorOff } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
}

import { useI18n } from "@/lib/i18n";

export const EmptyState = ({ onAdd }: EmptyStateProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 blur-3xl bg-brand-500/10 rounded-full" />
        <div className="relative h-20 w-20 bg-card rounded-2xl shadow-premium border border-border flex items-center justify-center text-brand-600">
          <MonitorOff size={40} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{t('services.empty_state.title')}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        {t('services.empty_state.subtitle')}
      </p>
      <Button onClick={onAdd} className="px-8 shadow-lg shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700">
        <Plus size={18} className="mr-2" /> {t('services.add_service')}
      </Button>
    </div>
  );
};
