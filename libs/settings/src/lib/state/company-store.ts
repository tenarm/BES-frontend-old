import { create } from 'zustand';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
import {
  CompanyProfile,
  Subsidiary,
  SubsidiaryCreate,
  FiscalYear,
  FiscalYearCreate,
  PostingPeriod,
  TaxProfile,
  TaxProfileCreate,
  SharingRule,
  IntercompanyAccount,
  IntercompanyAccountCreate,
  ConflictError
} from '../company-setup/types';
import * as api from '../company-setup/api';

interface CompanySetupState {
  // --- Data State ---
  profile: CompanyProfile | null;
  subsidiaries: Subsidiary[];
  fiscalYears: FiscalYear[];
  postingPeriods: Record<string, PostingPeriod[]>; // keyed by fiscalYearId
  taxProfiles: TaxProfile[];
  sharingRules: SharingRule[];
  intercompanyAccounts: IntercompanyAccount[];

  // --- UI State ---
  activeTabIndex: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  drawerMode: 'create' | 'edit';
  drawerEntity: 'subsidiary' | 'taxProfile' | 'fiscalYear' | 'intercompany' | null;
  selectedEntityId: string | null;
  conflictError: ConflictError | null;
  error: string | null;

  // --- Sub-feature licensing ---
  licensedFeatures: Record<string, boolean>;

  // --- Actions ---
  setActiveTab: (index: number) => void;
  openDrawer: (entity: 'subsidiary' | 'taxProfile' | 'fiscalYear' | 'intercompany', mode: 'create' | 'edit', id?: string | null) => void;
  closeDrawer: () => void;
  clearConflict: () => void;
  clearError: () => void;

  // --- Async Data Actions ---
  loadProfile: () => Promise<void>;
  saveProfile: (data: Partial<CompanyProfile>) => Promise<void>;
  loadSubsidiaries: () => Promise<void>;
  createSubsidiary: (data: SubsidiaryCreate) => Promise<void>;
  updateSubsidiary: (id: string, data: Partial<Subsidiary> & { version_id?: string }) => Promise<void>;
  deleteSubsidiary: (id: string) => Promise<void>;
  loadFiscalYears: () => Promise<void>;
  createFiscalYear: (data: FiscalYearCreate) => Promise<void>;
  loadPostingPeriods: (fiscalYearId: string) => Promise<void>;
  lockPostingPeriod: (periodId: string) => Promise<void>;
  loadTaxProfiles: () => Promise<void>;
  createTaxProfile: (data: TaxProfileCreate) => Promise<void>;
  loadSharingRules: () => Promise<void>;
  saveSharingRules: (data: SharingRule[]) => Promise<void>;
  loadIntercompanyAccounts: () => Promise<void>;
  createIntercompanyAccount: (data: IntercompanyAccountCreate) => Promise<void>;
  loadLicensedFeatures: () => void;
}

export const useCompanyStore = create<CompanySetupState>((set, get) => ({
  // --- Initial Data State ---
  profile: null,
  subsidiaries: [],
  fiscalYears: [],
  postingPeriods: {},
  taxProfiles: [],
  sharingRules: [],
  intercompanyAccounts: [],

  // --- Initial UI State ---
  activeTabIndex: 0,
  isLoading: false,
  isDrawerOpen: false,
  drawerMode: 'create',
  drawerEntity: null,
  selectedEntityId: null,
  conflictError: null,
  error: null,

  // --- Initial Licensing State ---
  licensedFeatures: {
    subsidiary_registry: false,
    fiscal_calendar: false,
    tax_profile: false,
    sharing_intercompany: false
  },

  // --- Standard Actions ---
  setActiveTab: (index) => set({ activeTabIndex: index }),
  
  openDrawer: (entity, mode, id = null) => set({
    drawerEntity: entity,
    drawerMode: mode,
    selectedEntityId: id,
    isDrawerOpen: true,
    conflictError: null,
    error: null
  }),

  closeDrawer: () => set({
    isDrawerOpen: false,
    drawerEntity: null,
    selectedEntityId: null,
    conflictError: null,
    error: null
  }),

  clearConflict: () => set({ conflictError: null }),
  clearError: () => set({ error: null }),

  // --- Async Data Actions ---
  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await api.fetchProfile();
      set({ profile, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load company profile', isLoading: false });
    }
  },

  saveProfile: async (data) => {
    set({ isLoading: true, error: null, conflictError: null });
    try {
      const currentProfile = get().profile;
      // Include current version_id for optimistic locking
      const updated = await api.updateProfile({
        ...data,
        version_id: currentProfile?.version_id
      });
      set({ profile: updated, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false });
      if (e instanceof api.ConcurrencyConflictError) {
        set({
          conflictError: {
            local_changes: data,
            server_version: e.conflictData?.server_version || e.conflictData || {},
            field_diffs: e.conflictData?.field_diffs || Object.keys(data)
          }
        });
      } else {
        set({ error: e.message || 'Failed to save profile' });
      }
      throw e;
    }
  },

  loadSubsidiaries: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.fetchSubsidiaries();
      set({ subsidiaries: res.data || [], isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load subsidiaries', isLoading: false });
    }
  },

  createSubsidiary: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await api.createSubsidiary(data);
      set((state) => ({
        subsidiaries: [...state.subsidiaries, created],
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to create subsidiary', isLoading: false });
      throw e;
    }
  },

  updateSubsidiary: async (id, data) => {
    set({ isLoading: true, error: null, conflictError: null });
    try {
      const currentSub = get().subsidiaries.find(s => s.id === id);
      const updated = await api.updateSubsidiary(id, {
        ...data,
        version_id: (currentSub as any)?.version_id
      });
      set((state) => ({
        subsidiaries: state.subsidiaries.map(s => s.id === id ? updated : s),
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ isLoading: false });
      if (e instanceof api.ConcurrencyConflictError) {
        set({
          conflictError: {
            local_changes: data,
            server_version: e.conflictData?.server_version || e.conflictData || {},
            field_diffs: e.conflictData?.field_diffs || Object.keys(data)
          }
        });
      } else {
        set({ error: e.message || 'Failed to update subsidiary' });
      }
      throw e;
    }
  },

  deleteSubsidiary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteSubsidiary(id);
      set((state) => ({
        subsidiaries: state.subsidiaries.filter(s => s.id !== id),
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to delete subsidiary', isLoading: false });
      throw e;
    }
  },

  loadFiscalYears: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.fetchFiscalYears();
      set({ fiscalYears: res.data || [], isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load fiscal calendars', isLoading: false });
    }
  },

  createFiscalYear: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await api.createFiscalYear(data);
      set((state) => ({
        fiscalYears: [...state.fiscalYears, created],
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to create fiscal calendar', isLoading: false });
      throw e;
    }
  },

  loadPostingPeriods: async (fiscalYearId) => {
    set({ isLoading: true, error: null });
    try {
      const periods = await api.fetchPostingPeriods(fiscalYearId);
      set((state) => ({
        postingPeriods: {
          ...state.postingPeriods,
          [fiscalYearId]: periods
        },
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to load posting periods', isLoading: false });
    }
  },

  lockPostingPeriod: async (periodId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPeriod = await api.lockPostingPeriod(periodId);
      set((state) => {
        const fyId = updatedPeriod.fiscal_year_id;
        const currentPeriods = state.postingPeriods[fyId] || [];
        return {
          postingPeriods: {
            ...state.postingPeriods,
            [fyId]: currentPeriods.map(p => p.id === periodId ? updatedPeriod : p)
          },
          isLoading: false
        };
      });
    } catch (e: any) {
      set({ error: e.message || 'Failed to lock posting period', isLoading: false });
      throw e;
    }
  },

  loadTaxProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.fetchTaxProfiles();
      set({ taxProfiles: res.data || [], isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load tax profiles', isLoading: false });
    }
  },

  createTaxProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await api.createTaxProfile(data);
      set((state) => ({
        taxProfiles: [...state.taxProfiles, created],
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to create tax profile', isLoading: false });
      throw e;
    }
  },

  loadSharingRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const sharingRules = await api.fetchSharingRules();
      set({ sharingRules, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load sharing rules', isLoading: false });
    }
  },

  saveSharingRules: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await api.updateSharingRules(data);
      set({ sharingRules: updated, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to save sharing rules', isLoading: false });
      throw e;
    }
  },

  loadIntercompanyAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const intercompanyAccounts = await api.fetchIntercompanyAccounts();
      set({ intercompanyAccounts, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load intercompany accounts', isLoading: false });
    }
  },

  createIntercompanyAccount: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await api.createIntercompanyAccount(data);
      set((state) => ({
        intercompanyAccounts: [...state.intercompanyAccounts, created],
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to map intercompany accounts', isLoading: false });
      throw e;
    }
  },

  loadLicensedFeatures: () => {
    const authStore = useAuthStore.getState();
    const activeModules = authStore.activeModules || [];
    const isSuperUser = authStore.currentUser?.is_superuser || false;

    // Feature gating mappings matching functionalities mapping:
    // Basic: profile, audit log (always true)
    // Pro: subsidiary_registry, fiscal_calendar, tax_profile
    // Premium: sharing_intercompany
    const subsidiary_registry = isSuperUser || activeModules.includes('settings_pro') || activeModules.includes('settings_premium') || activeModules.includes('subsidiary_registry');
    const fiscal_calendar = isSuperUser || activeModules.includes('settings_pro') || activeModules.includes('settings_premium') || activeModules.includes('fiscal_calendar');
    const tax_profile = isSuperUser || activeModules.includes('settings_pro') || activeModules.includes('settings_premium') || activeModules.includes('tax_profile');
    const sharing_intercompany = isSuperUser || activeModules.includes('settings_premium') || activeModules.includes('sharing_intercompany');

    set({
      licensedFeatures: {
        subsidiary_registry,
        fiscal_calendar,
        tax_profile,
        sharing_intercompany
      }
    });
  }
}));
