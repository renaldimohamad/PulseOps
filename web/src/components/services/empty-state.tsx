import { Button } from "@/components/ui/button";
import { Plus, MonitorOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface EmptyStateProps {
  onAdd: () => void;
}

export const EmptyState = ({ onAdd }: EmptyStateProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center bg-card/20 rounded-[2rem] md:rounded-[2.5rem] border border-dashed border-border/60 backdrop-blur-sm">
      <div className="relative mb-6 md:mb-8">
        <div className="absolute inset-0 scale-150 blur-[80px] md:blur-[100px] bg-brand-500/10 rounded-full" />
        <div className="relative h-16 w-16 md:h-24 md:w-24 bg-card/80 rounded-2xl md:rounded-3xl shadow-2xl border border-border/40 flex items-center justify-center text-brand-600 transition-transform hover:rotate-3">
          <MonitorOff className="w-8 h-8 md:w-11 md:h-11 opacity-80" strokeWidth={1.2} />
        </div>
        <div className="absolute -right-1 -bottom-1 md:-right-2 md:-bottom-2 h-6 w-6 md:h-8 md:w-8 bg-background rounded-full border border-border/40 flex items-center justify-center shadow-lg">
          <Plus className="w-3 h-3 md:w-4 md:h-4 text-brand-500" />
        </div>
      </div>
      
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground/90 tracking-tight mb-2 md:mb-3">
        {t('services.empty_state.title')}
      </h3>
      
      <p className="text-[11px] md:text-[13px] font-medium text-muted-foreground/60 max-w-[280px] md:max-w-[320px] mb-8 md:mb-10 leading-relaxed">
        {t('services.empty_state.subtitle')}
      </p>
      
      <Button 
        onClick={onAdd} 
        className="h-8 md:h-12 px-6 md:px-10 rounded-lg md:rounded-2xl shadow-lg shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <Plus size={14} className="md:w-4 md:h-4 mr-2" /> {t('services.add_service')}
      </Button>
    </div>
  );
};
