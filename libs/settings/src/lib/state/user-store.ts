import { create } from 'zustand';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
import {
  User,
  UserInvitation,
  UserUpdatePayload,
  Role,
  RoleCreate,
  RoleUpdate,
  RefreshSession
} from '../user-management/types';
import * as api from '../user-management/api';
import { ConflictError } from '../company-setup/types';
import { ConcurrencyConflictError } from '../company-setup/api';

interface UserManagementState {
  // --- Data State ---
  users: User[];
  roles: Role[];
  sessions: RefreshSession[];
  
  // --- UI State ---
  activeTabIndex: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  drawerEntity: 'userInvite' | 'userEdit' | 'roleEdit' | null;
  drawerMode: 'create' | 'edit';
  selectedEntityId: string | null;
  conflictError: ConflictError | null;
  error: string | null;

  // --- Licensing ---
  licensedFeatures: Record<string, boolean>;

  // --- Actions ---
  setActiveTab: (index: number) => void;
  openDrawer: (entity: 'userInvite' | 'userEdit' | 'roleEdit', mode: 'create' | 'edit', id?: string | null) => void;
  closeDrawer: () => void;
  clearConflict: () => void;
  clearError: () => void;

  // --- Async Data Actions ---
  loadUsers: () => Promise<void>;
  inviteUser: (email: string, roleId: string) => Promise<void>;
  updateUser: (id: string, data: UserUpdatePayload) => Promise<void>;
  loadRoles: () => Promise<void>;
  createRole: (data: RoleCreate) => Promise<void>;
  updateRole: (id: string, data: RoleUpdate) => Promise<void>;
  loadSessions: (userId: string) => Promise<void>;
  revokeSession: (tokenId: string) => Promise<void>;
  offboardUser: (userId: string) => Promise<void>;
  loadLicensedFeatures: () => void;
}

export const useUserStore = create<UserManagementState>((set, get) => ({
  // --- Initial Data State ---
  users: [],
  roles: [],
  sessions: [],

  // --- Initial UI State ---
  activeTabIndex: 0,
  isLoading: false,
  isDrawerOpen: false,
  drawerEntity: null,
  drawerMode: 'create',
  selectedEntityId: null,
  conflictError: null,
  error: null,

  // --- Initial Licensing State ---
  licensedFeatures: {
    custom_rbac: false,
    subsidiary_scoping: false,
    session_revocation: false
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
  loadUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.fetchUsers();
      set({ users: res.data || [], isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load user directory.', isLoading: false });
    }
  },

  inviteUser: async (email, roleId) => {
    set({ isLoading: true, error: null });
    try {
      await api.inviteUser(email, roleId);
      // Re-load user directory to show invitation statuses
      await get().loadUsers();
      set({ isDrawerOpen: false, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to dispatch user invitation.', isLoading: false });
      throw e;
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null, conflictError: null });
    try {
      const currentUser = get().users.find(u => u.id === id);
      const updated = await api.updateUser(id, {
        ...data,
        version_id: currentUser?.version_id || data.version_id
      });
      set((state) => ({
        users: state.users.map(u => u.id === id ? updated : u),
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ isLoading: false });
      if (e instanceof ConcurrencyConflictError) {
        set({
          conflictError: {
            local_changes: data,
            server_version: e.conflictData?.server_version || e.conflictData || {},
            field_diffs: e.conflictData?.field_diffs || Object.keys(data)
          }
        });
      } else {
        set({ error: e.message || 'Failed to update user parameters.' });
      }
      throw e;
    }
  },

  loadRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const roles = await api.fetchRoles();
      set({ roles, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to retrieve RBAC roles.', isLoading: false });
    }
  },

  createRole: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await api.createRole(data);
      set((state) => ({
        roles: [...state.roles, created],
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to create custom role.', isLoading: false });
      throw e;
    }
  },

  updateRole: async (id, data) => {
    set({ isLoading: true, error: null, conflictError: null });
    try {
      const currentRole = get().roles.find(r => r.id === id);
      const updated = await api.updateRole(id, {
        ...data,
        version_id: currentRole?.version_id || data.version_id
      });
      set((state) => ({
        roles: state.roles.map(r => r.id === id ? updated : r),
        isDrawerOpen: false,
        isLoading: false
      }));
    } catch (e: any) {
      set({ isLoading: false });
      if (e instanceof ConcurrencyConflictError) {
        set({
          conflictError: {
            local_changes: data,
            server_version: e.conflictData?.server_version || e.conflictData || {},
            field_diffs: e.conflictData?.field_diffs || Object.keys(data)
          }
        });
      } else {
        set({ error: e.message || 'Failed to update custom role.' });
      }
      throw e;
    }
  },

  loadSessions: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await api.fetchSessions(userId);
      set({ sessions, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch user active sessions.', isLoading: false });
    }
  },

  revokeSession: async (tokenId) => {
    set({ isLoading: true, error: null });
    try {
      await api.revokeSession(tokenId);
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== tokenId),
        isLoading: false
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to revoke token session.', isLoading: false });
      throw e;
    }
  },

  offboardUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await api.offboardUser(userId);
      await get().loadUsers();
      set({ isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to execute deprovisioning.', isLoading: false });
      throw e;
    }
  },

  loadLicensedFeatures: () => {
    const authStore = useAuthStore.getState();
    const activeModules = authStore.activeModules || [];
    const isSuperUser = authStore.currentUser?.is_superuser || false;

    // Feature gates mappings matching 3-backend-plan.md:
    // Basic: directory, predefined roles (always true)
    // Pro/Premium: custom_rbac, subsidiary_scoping, session_revocation
    const custom_rbac = isSuperUser || activeModules.includes('settings_pro') || activeModules.includes('settings_premium') || activeModules.includes('custom_rbac');
    const subsidiary_scoping = isSuperUser || activeModules.includes('settings_pro') || activeModules.includes('settings_premium') || activeModules.includes('subsidiary_scoping');
    const session_revocation = isSuperUser || activeModules.includes('settings_pro') || activeModules.includes('settings_premium') || activeModules.includes('session_revocation');

    set({
      licensedFeatures: {
        custom_rbac,
        subsidiary_scoping,
        session_revocation
      }
    });
  }
}));
