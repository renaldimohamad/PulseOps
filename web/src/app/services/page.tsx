'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import { ServiceTable } from '@/components/services/service-table';
import { ServiceForm } from '@/components/services/service-form';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Button } from '@/components/ui/button';
import { Plus, Bell, RefreshCw } from 'lucide-react';
import { Service } from '@/types/service';
import { useToast } from '@/components/ui/toast';
import { useI18n } from '@/lib/i18n';

export default function ServicesPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { success, error, info } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll(),
  });



  const createMutation = useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => {
      setIsModalOpen(false);
      // RealtimeSync handles cache update & success toast
    },
    onError: () => {
      error(t('services.messages.create_failed'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => serviceApi.update(id, data),
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingService(null);
      // RealtimeSync handles cache update & success toast
    },
    onError: () => {
      error(t('services.messages.update_failed'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: serviceApi.delete,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      // RealtimeSync handles cache update & success toast
    },
    onError: () => {
      error(t('services.messages.delete_failed'));
    }
  });

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setServiceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete);
    }
  };

  const handleRefresh = async () => {
    info(t('services.messages.refreshing'));
    await queryClient.invalidateQueries({ queryKey: ['services'] });
    success(t('services.messages.refreshed'));
  };

  const handleNotification = () => {
    info(`${t('services.messages.system_status_title')}: ${t('services.messages.system_status_ok')}`);
  };

  const handleSubmit = (data: any) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
        <div className="space-y-2 md:space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              {t('common.services')}
            </h1>
            <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-success border border-success/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-success"></span>
              </span>
              {t('dashboard.activity.live')}
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl h-12 w-12 hover:rotate-180 transition-transform duration-500 bg-card border-border text-muted-foreground hover:text-foreground active:scale-90"
              onClick={handleRefresh}
            >
              <RefreshCw size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl h-12 w-12 relative bg-card border-border text-muted-foreground hover:text-foreground active:scale-90"
              onClick={handleNotification}
            >
              <Bell size={20} />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-brand-500 border-2 border-card shadow-[0_0_8px_rgba(14,145,233,0.5)]" />
            </Button>
          </div>
          <Button
            onClick={handleAdd}
            className="flex-1 lg:flex-none h-12 px-6 rounded-2xl shadow-lg shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700 font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
          >
            <Plus size={18} className="mr-2" /> {t('services.add_service')}
          </Button>
        </div>
      </div>

      <div className="rounded-[32px] border border-border bg-card/70 backdrop-blur-xl shadow-premium overflow-hidden transition-all duration-500">
        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          onAdd={handleAdd}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? t('services.edit_service') : t('services.new_service')}
      >
        <ServiceForm
          initialData={editingService}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={t('services.delete_service')}
        description={t('services.delete_confirm')}
        confirmText={t('common.delete')}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
