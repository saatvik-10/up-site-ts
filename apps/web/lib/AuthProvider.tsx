// components/auth/AuthProvider.tsx
'use client';

import { useAuth } from './useAuthStore';
import { Spinner } from '@/components/ui/spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner className='h-20 w-20' />
      </div>
    );
  }

  return <>{children}</>;
}
