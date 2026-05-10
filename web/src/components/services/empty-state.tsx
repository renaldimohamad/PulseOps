import { Button } from "@/components/ui/button";
import { Plus, MonitorOff } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
}

import { useI18n } from "@/lib/i18n";

export const EmptyState = ({ onAdd }: EmptyStateProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-card/20 rounded-[2.5rem] border border-dashed border-border/60 backdrop-blur-sm">
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-150 blur-[100px] bg-brand-500/20 rounded-full" />
        <div className="relative h-24 w-24 bg-card/80 rounded-3xl shadow-2xl border border-border/40 flex items-center justify-center text-brand-600 transition-transform hover:rotate-3">
          <MonitorOff size={44} strokeWidth={1.2} className="opacity-80" />
        </div>
        <div className="absolute -right-2 -bottom-2 h-8 w-8 bg-background rounded-full border border-border/40 flex items-center justify-center shadow-lg">
          <Plus size={14} className="text-brand-500" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground/90 tracking-tight mb-3">
        {t('services.empty_state.title')}
      </h3>
      <p className="text-[14px] font-medium text-muted-foreground/60 max-w-[320px] mb-10 leading-relaxed">
        {t('services.empty_state.subtitle')}
      </p>
      <Button 
        onClick={onAdd} 
        className="h-12 px-10 rounded-2xl shadow-xl shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all text-xs font-bold uppercase tracking-widest"
      >
        <Plus size={18} className="mr-2" /> {t('services.add_service')}
      </Button>
    </div>
  );
};
