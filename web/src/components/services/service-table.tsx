'use client';

import { Service } from '@/types/service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export const ServiceTable = ({ services, onEdit, onDelete }: ServiceTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-6 py-4 font-semibold text-gray-900">Service</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Category</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Latency</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Last Checked</th>
            <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {services.map((service) => (
            <tr key={service.id} className="group hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{service.name}</span>
                  <a 
                    href={service.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                  >
                    {service.url} <ExternalLink size={10} />
                  </a>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-100">
                  {service.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <Badge status={service.status} />
                  {service.status === 'DOWN' && service.rawStatus && (
                    <span className="text-[10px] text-red-500 font-medium">
                      {service.rawStatus === 404 && '⚠️ Misconfigured (404)'}
                      {(service.rawStatus === 401 || service.rawStatus === 403) && '🔒 Auth Required'}
                      {service.rawStatus >= 500 && '🔥 Server Error'}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`font-mono text-xs ${service.latency && service.latency > 500 ? 'text-amber-600' : 'text-gray-600'}`}>
                  {service.latency ? `${service.latency}ms` : '-'}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500">
                {service.lastChecked 
                  ? `${formatDistanceToNow(new Date(service.lastChecked))} ago`
                  : 'Never'}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-blue-600"
                    onClick={() => onEdit(service)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                    onClick={() => onDelete(service.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                No services found. Add your first service to start monitoring.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
