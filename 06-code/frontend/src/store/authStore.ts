import { create } from 'zustand';

export interface AuthUser {
  id?: number;
  email?: string;
  full_name?: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user?: AuthUser | null) => void;
  clearSession: () => void;
}

const TOKEN_STORAGE_KEY = 'portal_convocatorias_token';

export const useAuthStore = create<AuthState>((set) => ({
  token: window.localStorage.getItem(TOKEN_STORAGE_KEY),
  user: null,
  setSession: (token, user = null) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    set({ token, user });
  },
  clearSession: () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ token: null, user: null });
  },
}));
