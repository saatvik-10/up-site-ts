'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const route = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
        withCredentials: true,
      });

      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signOut = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/sign-out`,
        {},
        {
          withCredentials: true,
        }
      );

      setIsAuthenticated(false);

      toast.success('Signed out successfully!');

      route.push('/');
    } catch {
      toast.error('Error signing out!');
    }
  };

  return { isAuthenticated, isLoading, signOut };
};
