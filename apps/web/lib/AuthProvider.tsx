// components/auth/AuthProvider.tsx
'use client';

import { useAuth } from './useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // spinner later
  }

  return <>{children}</>;
}
