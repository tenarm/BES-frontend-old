import { create } from 'zustand';
import { checkPermission, NestedPermissions } from '@bes/shared-ui';

export interface User {
  id: string;
  username: string;
  full_name: string;
  is_superuser: boolean;
  permissions: NestedPermissions;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  hasPermission: (required: string) => boolean;
}

const API_BASE = '/api/v1';

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  token: localStorage.getItem('bes_token'),
  isAuthenticated: !!localStorage.getItem('bes_token'),
  isLoading: false,
  
  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!loginRes.ok) throw new Error('Login failed');
      const { access_token } = await loginRes.json();

      const userRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!userRes.ok) throw new Error('Failed to fetch user info');
      const userData = await userRes.json();

      localStorage.setItem('bes_token', access_token);
      set({ 
        token: access_token, 
        currentUser: userData, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('bes_token');
    set({ token: null, currentUser: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        get().logout();
        return;
      }

      const userData = await res.json();
      set({ currentUser: userData, isAuthenticated: true, isLoading: false });
    } catch (error) {
      get().logout();
      set({ isLoading: false });
    }
  },

  hasPermission: (required) => {
    const user = get().currentUser;
    if (!user) return false;
    if (user.is_superuser) return true;
    
    return checkPermission(user.permissions, required);
  }
}));
