'use client';

import axios from 'axios';
import { useEffect } from "react";
import { toast } from 'sonner';
import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: true,

  setAuthenticated: (value) => set({ isAuthenticated: value, isLoading: false }),

  checkAuth: async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
        withCredentials: true,
      });
      set({ isAuthenticated: true, isLoading: false })
    } catch {
      set({ isAuthenticated: false, isLoading: false })
    }
  },

  signOut: async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/sign-out`,
        {},
        {
          withCredentials: true,
        }
      );
      set({ isAuthenticated: false, isLoading: false });
      toast.success('Signed out successfully!');
    } catch {
      toast.error('Error signing out!');
    }
  }
}))


export const useAuth = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated, isLoading };
};