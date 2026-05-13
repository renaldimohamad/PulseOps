'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/lib/api';
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
  const { success: successToast, error: errorToast, info: infoToast } = useToast();
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
    },
    onError: () => {
      errorToast(t('services.messages.create_failed'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => serviceApi.update(id, data),
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingService(null);
    },
    onError: () => {
      errorToast(t('services.messages.update_failed'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: serviceApi.delete,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    },
    onError: () => {
      errorToast(t('services.messages.delete_failed'));
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
    infoToast(t('services.messages.refreshing'));
    await queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const handleNotification = () => {
    infoToast(`${t('services.messages.system_status_title')}: ${t('services.messages.system_status_ok')}`);
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
            <p className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-foreground leading-tight">
              {t('common.services')}
            </p>
            {/* <h1 className="heading-xl text-foreground">
              {t('common.services')}
            </h1> */}
            <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-success border border-success/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="pulse-dot">
                <span className="pulse-dot-inner"></span>
                <span className="pulse-dot-main bg-success"></span>
              </span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-success/70">{t('dashboard.activity.live')}</span>
            </div>
          </div>
          <p className="text-[11px] md:text-16 font-medium text-foreground/50 leading-relaxed max-w-xl">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl md:h-12 h-10 md:w-12 w-10 hover:rotate-180 transition-transform duration-500 bg-card border-border text-muted-foreground hover:text-foreground active:scale-90"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} className="md:w-5 md:h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl md:h-12 h-10 md:w-12 w-10 relative bg-card border-border text-muted-foreground hover:text-foreground active:scale-90"
              onClick={handleNotification}
            >
              <Bell size={16} className="md:w-5 md:h-5" />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-brand-500 border-2 border-card shadow-[0_0_8px_rgba(14,145,233,0.5)]" />
            </Button>
          </div>
          <Button
            onClick={handleAdd}
            className="flex-1 lg:flex-none h-8 md:h-12 px-1.5 md:px-6 rounded-xl md:rounded-2xl shadow-lg shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700 font-bold uppercase tracking-widest text-xs active:scale-95 transition-all"
          >
            <Plus size={16} className="md:w-5 md:h-5 mr-2" />
            <span className='text-[8px] md:text-[10px]'>
              {t('services.add_service')}
            </span>
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
