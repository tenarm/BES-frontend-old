import { create } from 'zustand';
import { checkPermission, NestedPermissions } from '@tenarm/shared-ui';

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
  activeModules: string[];
  clientName: string;
  clientPlan: 'Basic' | 'Pro' | 'Premium';
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  hasPermission: (required: string) => boolean;
  setClientPlan: (plan: 'Basic' | 'Pro' | 'Premium') => void;
}

const API_BASE = '/api/v1';

const initializeModules = async (activeMods: string[]) => {
  // Dynamically initialize settings module based on bootstrap
  if (activeMods.includes('settings')) {
    const { initSettingsModule } = await import('../../../../libs/settings/src');
    initSettingsModule();
  }

  if (activeMods.includes('sales')) {
    const { initSellFlow } = await import('@tenarm/flows-sell');
    initSellFlow();

    const { initCustomersDataHub } = await import('@tenarm/data-hub-customers');
    initCustomersDataHub();

    const { initProductsDataHub } = await import('@tenarm/data-hub-products');
    initProductsDataHub();
  }

  if (activeMods.includes('supply_chain')) {
    const { initBuyFlow } = await import('@tenarm/flows-buy');
    initBuyFlow();
  }
  if (activeMods.includes('inventory')) {
    const { initStockFlow } = await import('@tenarm/flows-stock');
    initStockFlow();
  }
  /*
  // To add other modules back in the future, uncomment these:
  if (activeMods.includes('finance')) {
    const { initMoneyFlow } = await import('@tenarm/flows-money');
    initMoneyFlow();
  }
  if (activeMods.includes('hr')) {
    const { initPeopleFlow } = await import('@tenarm/flows-people');
    initPeopleFlow();
  }
  */
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  token: localStorage.getItem('bes_token'),
  isAuthenticated: !!localStorage.getItem('bes_token'),
  isLoading: false,
  activeModules: [],
  clientName: '',
  clientPlan: 'Premium',
  
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

      // Fetch bootstrap metadata instead of auth/me to load licensed extensions
      const bootstrapRes = await fetch(`${API_BASE}/bootstrap`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!bootstrapRes.ok) throw new Error('Failed to fetch bootstrap info');
      const bootstrapData = await bootstrapRes.json();
      const boot = bootstrapData.data;

      // Map bootstrap data to User object
      const mappedUser: User = {
        id: boot.user_id,
        username: boot.username,
        full_name: boot.username, // Fallback since bootstrap returns username
        is_superuser: boot.username === 'admin',
        permissions: boot.permissions || {}
      };

      const activeMods = boot.active_modules || [];
      await initializeModules(activeMods);

      const bootPlanRaw = boot.plan || 'premium';
      const clientPlan = (bootPlanRaw.charAt(0).toUpperCase() + bootPlanRaw.slice(1)) as 'Basic' | 'Pro' | 'Premium';

      localStorage.setItem('bes_token', access_token);
      localStorage.setItem('bes_plan', bootPlanRaw);
      set({ 
        token: access_token, 
        currentUser: mappedUser, 
        activeModules: activeMods,
        clientName: boot.client_name || '',
        clientPlan,
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
    localStorage.removeItem('bes_plan');
    set({ token: null, currentUser: null, isAuthenticated: false, activeModules: [], clientName: '', clientPlan: 'Premium' });
  },

  initialize: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/bootstrap`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        get().logout();
        return;
      }

      const bootstrapData = await res.json();
      const boot = bootstrapData.data;

      // Map bootstrap data to User object
      const mappedUser: User = {
        id: boot.user_id,
        username: boot.username,
        full_name: boot.username,
        is_superuser: boot.username === 'admin',
        permissions: boot.permissions || {}
      };

      const activeMods = boot.active_modules || [];
      await initializeModules(activeMods);

      const bootPlanRaw = boot.plan || 'premium';
      const clientPlan = (bootPlanRaw.charAt(0).toUpperCase() + bootPlanRaw.slice(1)) as 'Basic' | 'Pro' | 'Premium';

      localStorage.setItem('bes_plan', bootPlanRaw);

      set({ 
        currentUser: mappedUser, 
        activeModules: activeMods,
        clientName: boot.client_name || '',
        clientPlan,
        isAuthenticated: true, 
        isLoading: false 
      });
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
  },

  setClientPlan: (plan) => {
    localStorage.setItem('bes_plan', plan.toLowerCase());
    set({ clientPlan: plan });
    window.dispatchEvent(new Event('bes_plan_changed'));
  }
}));

