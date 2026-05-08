'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Service, ServiceStats } from '@/types/service';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll(),
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('service.updated', (updatedService: Service) => {
      queryClient.setQueryData(['services'], (old: Service[] | undefined) => {
        if (!old) return [updatedService];
        return old.map((s) => (s.id === updatedService.id ? updatedService : s));
      });
    });

    socket.on('disconnect', () => {
      console.warn('WebSocket disconnected, fallback to manual refresh mode');
    });

    return () => {
      socket.off('connect');
      socket.off('service.updated');
      socket.off('disconnect');
    };
  }, [queryClient]);

  const stats: ServiceStats = {
    total: services?.length || 0,
    up: services?.filter((s) => s.status === 'UP').length || 0,
    down: services?.filter((s) => s.status === 'DOWN').length || 0,
    pending: services?.filter((s) => s.status === 'PENDING').length || 0,
    unknown: services?.filter((s) => s.status === 'UNKNOWN').length || 0,
  };

  const statCards = [
    {
      title: 'Total Services',
      value: stats.total,
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Services UP',
      value: stats.up,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Services DOWN',
      value: stats.down,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Pending/Unknown',
      value: stats.pending + stats.unknown,
      icon: Clock,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Real-time overview of your infrastructure health.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`${card.bg} rounded-md p-2`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Recent Activity / Uptime Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-sm text-gray-500 italic">
            Recent activity logs and graphs will appear here in the next update.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
