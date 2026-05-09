'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/lib/socket';
import { Service } from '@/types/service';
import { useToast } from '@/components/ui/toast';

export const useRealtimeSynchronization = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  useEffect(() => {
    // 1. Service Created
    socket.on('service.created', (newService: Service) => {
      queryClient.setQueryData(['services'], (old: Service[] | undefined) => {
        if (!old) return [newService];
        // Check if already exists to avoid duplicates
        if (old.some(s => s.id === newService.id)) return old;
        return [newService, ...old];
      });
      success(`${newService.name} has been added to monitoring.`);
    });

    // 2. Service Updated (includes status changes)
    socket.on('service.updated', (updatedService: Service) => {
      queryClient.setQueryData(['services'], (old: Service[] | undefined) => {
        if (!old) return [updatedService];

        const prev = old.find(s => s.id === updatedService.id);
        
        // Show status change notification & add to events
        if (prev && prev.status !== updatedService.status) {
          if (updatedService.status === 'DOWN') {
            error(`${updatedService.name} is DOWN!`);
          } else if (updatedService.status === 'UP') {
            success(`${updatedService.name} is back online.`);
          }

          // Add to global events
          queryClient.setQueryData(['events'], (oldEvents: any[] | undefined) => {
            const newEvent = {
              id: Math.random().toString(36).substring(2, 9),
              serviceName: updatedService.name,
              type: updatedService.status,
              timestamp: new Date(),
              message: updatedService.status === 'UP'
                ? 'Service recovered and is now online.'
                : updatedService.status === 'DOWN'
                  ? 'Service is unresponsive and reporting errors.'
                  : 'Service status changed.',
            };
            return [newEvent, ...(oldEvents || [])].slice(0, 20);
          });
        }

        return old.map((s) => (s.id === updatedService.id ? updatedService : s));
      });
    });

    // 3. Service Deleted
    socket.on('service.deleted', ({ id }: { id: string }) => {
      queryClient.setQueryData(['services'], (old: Service[] | undefined) => {
        if (!old) return [];
        return old.filter(s => s.id !== id);
      });
    });

    return () => {
      socket.off('service.created');
      socket.off('service.updated');
      socket.off('service.deleted');
    };
  }, [queryClient, success, error]);
};
