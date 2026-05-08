'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import { ServiceTable } from '@/components/services/service-table';
import { ServiceForm } from '@/components/services/service-form';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Service } from '@/types/service';

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll(),
  });

  useEffect(() => {
    socket.on('service.updated', (updatedService: Service) => {
      queryClient.setQueryData(['services'], (old: Service[] | undefined) => {
        if (!old) return [updatedService];
        return old.map((s) => s.id === updatedService.id ? updatedService : s);
      });
    });

    return () => {
      socket.off('service.updated');
    };
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => serviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsModalOpen(false);
      setEditingService(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: serviceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
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
    if (confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Services
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and monitor your infrastructure services.
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">
            Loading services...
          </div>
        ) : (
          <ServiceTable 
            services={services} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <ServiceForm 
          initialData={editingService} 
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
