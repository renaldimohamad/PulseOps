'use client';

import { useRealtimeSynchronization } from '@/hooks/use-realtime-sync';

export const RealtimeSync = () => {
  useRealtimeSynchronization();
  return null;
};
