'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';

interface ServiceFormProps {
  initialData?: Service | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ServiceForm = ({ initialData, onSubmit, isLoading }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        url: initialData.url,
        category: initialData.category,
      });
    } else {
      setFormData({ name: '', url: '', category: '' });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Service Name</label>
        <input
          type="text"
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. API Gateway"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Service URL</label>
        <input
          type="url"
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="https://api.example.com/health"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Infrastructure, Database"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>
      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Service' : 'Add Service'}
        </Button>
      </div>
    </form>
  );
};
