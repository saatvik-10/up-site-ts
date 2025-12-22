'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/useAuthStore';
import { Spinner } from '@/components/ui/spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner className='h-20 w-20' />
      </div>
    );
  }

  return <>{children}</>;
}
