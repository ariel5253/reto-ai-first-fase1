import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id?: number;
  email?: string;
  full_name?: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setSession: (token: string, user?: AuthUser | null) => void;
  clearToken: () => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: true }),
      setSession: (token, user = null) => set({ token, user, isAuthenticated: true }),
      clearToken: () => set({ token: null, user: null, isAuthenticated: false }),
      clearSession: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-token',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
        }
      },
    },
  ),
);
