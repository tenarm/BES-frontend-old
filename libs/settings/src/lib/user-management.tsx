import React, { useState, useEffect } from 'react';
import { Users, Shield, KeyRound, Power, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  Button, Badge, TabGroup, TabList, Tab, TabPanels, TabPanel, UpgradeGateOverlay 
} from '@bes/shared-ui';

import { UserData, RoleData, SessionData, APIKeyData, SubsidiaryData } from './types';
import { UsersListTab } from './components/users-list-tab';
import { UserDrawer } from './components/user-drawer';
import { UserSessionsModal } from './components/user-sessions-modal';
import { ResetPasswordModal } from './components/reset-password-modal';
import { RolesPermissionsTab } from './components/roles-permissions-tab';
import { RoleDrawer } from './components/role-drawer';
import { SSOConfigTab } from './components/sso-config-tab';
import { APIKeysTab } from './components/api-keys-tab';
import { APIKeyDrawer } from './components/api-key-drawer';

export const UserManagementPage: React.FC = () => {
  // --- Plan Tier Gating (Rule 2.3) ---
  const [activeTier, setActiveTier] = useState<'Basic' | 'Pro' | 'Premium'>(() => {
    const rawPlan = localStorage.getItem('bes_plan') || 'premium';
    return (rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1)) as 'Basic' | 'Pro' | 'Premium';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const raw = localStorage.getItem('bes_plan') || 'premium';
      setActiveTier((raw.charAt(0).toUpperCase() + raw.slice(1)) as 'Basic' | 'Pro' | 'Premium');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bes_plan_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bes_plan_changed', handleStorageChange);
    };
  }, []);

  const [showUpgradeGate, setShowUpgradeGate] = useState<string | null>(null);

  // --- Common States ---
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Controlled tab index state
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- Data States ---
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryData[]>([]);
  const [search, setSearch] = useState('');
  
  // Drawers and Selection
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userPassword, setUserPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // User password reset state
  const [resetPasswordUser, setResetPasswordUser] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // User sessions state
  const [sessionsUser, setSessionsUser] = useState<UserData | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Roles drawer
  const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

  // SSO configuration state
  const [ssoConfig, setSsoConfig] = useState({
    sso_enabled: false,
    provider: 'saml2',
    client_id: '',
    client_secret: '',
    authorization_endpoint: '',
    token_endpoint: '',
    userinfo_endpoint: ''
  });

  // API keys state
  const [apiKeys, setApiKeys] = useState<APIKeyData[]>([]);
  const [apiKeyDrawerOpen, setApiKeyDrawerOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpires, setNewKeyExpires] = useState('');
  const [plaintextKey, setPlaintextKey] = useState<string | null>(null);

  const token = localStorage.getItem('bes_token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // --- Toast Trigger Helper ---
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Fetch API Resources ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/v1/settings/users${q}`, { headers });
      if (res.ok) {
        const body = await res.json();
        setUsers(body.data);
      }
    } catch {
      showToast('error', 'Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/v1/settings/roles', { headers });
      if (res.ok) {
        const body = await res.json();
        setRoles(body.data);
      }
    } catch {
      showToast('error', 'Failed to fetch roles list.');
    }
  };

  const fetchSubsidiaries = async () => {
    try {
      const res = await fetch('/api/v1/settings/subsidiaries', { headers });
      if (res.ok) {
        const body = await res.json();
        setSubsidiaries(body.data);
      }
    } catch {
      // Fail-silent
    }
  };

  const fetchSSO = async () => {
    if (activeTier !== 'Premium') return;
    try {
      const res = await fetch('/api/v1/settings/sso', { headers });
      if (res.ok) {
        const body = await res.json();
        setSsoConfig(body.data);
      }
    } catch {
      // Ok if not initialized
    }
  };

  const fetchAPIKeys = async () => {
    setApiKeys([
      { id: '1', name: 'ERP Sync Engine', key_prefix: 'bes_live_a2f8...', created_at: '2026-05-15T12:00:00Z' }
    ]);
  };

  const fetchAllData = async () => {
    fetchSubsidiaries();
    if (selectedIndex === 0) {
      fetchUsers();
      fetchRoles();
    } else if (selectedIndex === 1) {
      fetchRoles();
    } else if (selectedIndex === 2) {
      fetchSSO();
    } else if (selectedIndex === 3) {
      fetchAPIKeys();
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedIndex, search]);

  // --- Tab Click Interception (Subscription gates) ---
  const handleTabChange = (index: number) => {
    if (index === 1 && activeTier === 'Basic') {
      showUpgradeGate('Custom Roles & Granular RBAC Permissions');
      return;
    }
    if (index === 2 && activeTier !== 'Premium') {
      showUpgradeGate('Single Sign-On (SSO) Integration');
      return;
    }
    if (index === 3 && activeTier === 'Basic') {
      showUpgradeGate('Developer API Keys');
      return;
    }
    setSelectedIndex(index);
  };

  // --- Save User ---
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFieldErrors({});

    // Strong password check per rules
    if (!selectedUser.id) {
      if (userPassword.length < 12) {
        setFieldErrors({ password: 'Password must be at least 12 characters long.' });
        return;
      }
      if (!/[A-Z]/.test(userPassword) || !/[a-z]/.test(userPassword) || !/[0-9]/.test(userPassword)) {
        setFieldErrors({ password: 'Password must include uppercase, lowercase, and numeric characters.' });
        return;
      }
    }

    try {
      let res;
      if (selectedUser.id) {
        res = await fetch(`/api/v1/settings/users/${selectedUser.id}?version_id=${selectedUser.version_id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(selectedUser)
        });
      } else {
        res = await fetch('/api/v1/settings/users', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...selectedUser,
            password: userPassword
          })
        });
      }

      const body = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          showToast('error', 'Concurrency Conflict: User record updated by another administrator.');
        } else {
          showToast('error', body.detail || 'Failed to save user.');
        }
      } else {
        showToast('success', `User '${selectedUser.username}' saved successfully.`);
        setUserDrawerOpen(false);
        setUserPassword('');
        fetchUsers();
      }
    } catch {
      showToast('error', 'Network failure.');
    }
  };

  // --- Toggle User Active Status ---
  const handleToggleUserStatus = async (user: UserData) => {
    try {
      const res = await fetch(`/api/v1/settings/users/${user.id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ is_active: !user.is_active })
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Status toggle rejected.');
      } else {
        showToast('success', `User successfully ${!user.is_active ? 'Activated' : 'Deactivated'}.`);
        fetchUsers();
      }
    } catch {
      showToast('error', 'Failed to toggle user status.');
    }
  };

  // --- Reset User Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    try {
      const res = await fetch(`/api/v1/settings/users/${resetPasswordUser.id}/password`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ new_password: newPassword })
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Password change failed.');
      } else {
        showToast('success', `Password reset successfully. Active sessions revoked.`);
        setResetPasswordUser(null);
        setNewPassword('');
      }
    } catch {
      showToast('error', 'Request failed.');
    }
  };

  // --- Fetch User Sessions ---
  const handleViewSessions = async (user: UserData) => {
    setSessionsUser(user);
    setLoadingSessions(true);
    try {
      const res = await fetch(`/api/v1/settings/users/${user.id}/sessions`, { headers });
      if (res.ok) {
        const body = await res.json();
        setSessions(body.data);
      }
    } catch {
      showToast('error', 'Failed to retrieve active sessions.');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!sessionsUser) return;
    try {
      const res = await fetch(`/api/v1/settings/users/${sessionsUser.id}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        showToast('success', 'Session revoked successfully.');
        handleViewSessions(sessionsUser);
      }
    } catch {
      showToast('error', 'Failed to revoke session.');
    }
  };

  // --- Save Role ---
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      let res;
      if (selectedRole.id) {
        res = await fetch(`/api/v1/settings/roles/${selectedRole.id}?version_id=${selectedRole.version_id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(selectedRole)
        });
      } else {
        res = await fetch('/api/v1/settings/roles', {
          method: 'POST',
          headers,
          body: JSON.stringify(selectedRole)
        });
      }

      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Failed to save role.');
      } else {
        showToast('success', `Role '${selectedRole.name}' saved successfully.`);
        setRoleDrawerOpen(false);
        fetchRoles();
      }
    } catch {
      showToast('error', 'Network failure.');
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this custom role?')) return;
    try {
      const res = await fetch(`/api/v1/settings/roles/${id}`, {
        method: 'DELETE',
        headers
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Failed to delete role.');
      } else {
        showToast('success', 'Role deleted successfully.');
        fetchRoles();
      }
    } catch {
      showToast('error', 'Failed to execute delete request.');
    }
  };

  // Permission matrix checkbox helper
  const handlePermissionToggle = (module: string, resource: string, action: string) => {
    if (!selectedRole) return;
    
    const nextPerms = { ...selectedRole.permissions };
    if (!nextPerms[module]) nextPerms[module] = {};
    if (!nextPerms[module][resource]) nextPerms[module][resource] = {};
    
    nextPerms[module][resource][action] = !nextPerms[module][resource][action];
    
    setSelectedRole({
      ...selectedRole,
      permissions: nextPerms
    });
  };

  // --- Save SSO ---
  const handleSaveSSO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/settings/sso', {
        method: 'POST',
        headers,
        body: JSON.stringify(ssoConfig)
      });
      if (res.ok) {
        showToast('success', 'SSO configuration updated successfully.');
        fetchSSO();
      } else {
        const body = await res.json();
        showToast('error', body.detail || 'Failed to save SSO settings.');
      }
    } catch {
      showToast('error', 'SSO update request failed.');
    }
  };

  // --- Generate API Key ---
  const handleGenerateAPIKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/settings/api-keys', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newKeyName,
          expires_at: newKeyExpires || null
        })
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Failed to generate token.');
      } else {
        showToast('success', 'API Key successfully generated.');
        setPlaintextKey(body.data.plaintext_key);
        fetchAPIKeys();
      }
    } catch {
      showToast('error', 'Request failed.');
    }
  };

  const handleRevokeAPIKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) return;
    try {
      const res = await fetch(`/api/v1/settings/api-keys/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        showToast('success', 'API Key permanently revoked.');
        fetchAPIKeys();
      }
    } catch {
      showToast('error', 'Revocation request failed.');
    }
  };

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)', position: 'relative', minHeight: '100vh' }}>
      
      {/* Toast notifications */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toast.type === 'success' ? '#059669' : '#dc2626',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--ui-spacing-lg)' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: 'var(--ui-text-xl)', 
            fontWeight: '700', 
            color: 'var(--ui-gray-900)', 
            margin: 0 
          }}>User Management & RBAC</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Configure user profiles, allowed subsidiaries roaming access, roles, and SSO credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button variant="secondary" onClick={fetchAllData} size="sm">
            <RefreshCw size={14} style={{ marginRight: 6 }} /> Refresh
          </Button>
        </div>
      </header>

      {/* Top-Level Tabs (No nested sidebars, direct matching to User requests) */}
      <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
        <TabList>
          <Tab><Users size={16} style={{ marginRight: 8 }} /> Users List</Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={16} /> Roles & Permissions
              {activeTier === 'Basic' && <CheckCircle2 size={12} />}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Power size={16} /> SSO Configuration
              {activeTier !== 'Premium' && <CheckCircle2 size={12} />}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <KeyRound size={16} /> API Keys
              {activeTier === 'Basic' && <CheckCircle2 size={12} />}
            </div>
          </Tab>
        </TabList>

        <TabPanels style={{ marginTop: '20px' }}>
          {/* Panel 1: Users */}
          <TabPanel>
            <UsersListTab 
              users={users} 
              roles={roles} 
              search={search} 
              setSearch={setSearch} 
              loading={loading}
              onOnboard={() => {
                setSelectedUser({
                  username: '', email: '', full_name: '', is_active: true, is_superuser: false,
                  allowed_subsidiary_ids: [], version_id: 1
                });
                setUserPassword('');
                setUserDrawerOpen(true);
              }}
              onEdit={(user) => {
                setSelectedUser(user);
                setUserPassword('');
                setUserDrawerOpen(true);
              }}
              onViewSessions={handleViewSessions}
              onResetPass={(user) => {
                setResetPasswordUser(user);
                setNewPassword('');
                setShowNewPassword(false);
              }}
              onToggleStatus={handleToggleUserStatus}
            />
          </TabPanel>

          {/* Panel 2: Roles */}
          <TabPanel>
            <RolesPermissionsTab 
              roles={roles}
              onAdd={() => {
                setSelectedRole({
                  name: '',
                  description: '',
                  permissions: {},
                  version_id: 1
                });
                setRoleDrawerOpen(true);
              }}
              onEditPermissions={(role) => {
                setSelectedRole(role);
                setRoleDrawerOpen(true);
              }}
              onDelete={handleDeleteRole}
            />
          </TabPanel>

          {/* Panel 3: SSO */}
          <TabPanel>
            <SSOConfigTab 
              ssoConfig={ssoConfig} 
              setSsoConfig={setSsoConfig} 
              onSave={handleSaveSSO} 
            />
          </TabPanel>

          {/* Panel 4: API Keys */}
          <TabPanel>
            <APIKeysTab 
              apiKeys={apiKeys} 
              onAdd={() => {
                setNewKeyName('');
                setNewKeyExpires('');
                setPlaintextKey(null);
                setApiKeyDrawerOpen(true);
              }} 
              onRevoke={handleRevokeAPIKey} 
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* --- Drawers & Modals --- */}

      <UserDrawer 
        isOpen={userDrawerOpen} 
        onClose={() => setUserDrawerOpen(false)} 
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        userPassword={userPassword}
        setUserPassword={setUserPassword}
        fieldErrors={fieldErrors}
        roles={roles}
        subsidiaries={subsidiaries}
        onSave={handleSaveUser}
      />

      <RoleDrawer 
        isOpen={roleDrawerOpen} 
        onClose={() => setRoleDrawerOpen(false)} 
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onPermissionToggle={handlePermissionToggle}
        onSave={handleSaveRole}
      />

      <APIKeyDrawer 
        isOpen={apiKeyDrawerOpen} 
        onClose={() => setApiKeyDrawerOpen(false)} 
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        newKeyExpires={newKeyExpires}
        setNewKeyExpires={setNewKeyExpires}
        plaintextKey={plaintextKey}
        onGenerate={handleGenerateAPIKey}
      />

      <UserSessionsModal 
        isOpen={!!sessionsUser} 
        onClose={() => setSessionsUser(null)} 
        sessionsUser={sessionsUser}
        sessions={sessions}
        loadingSessions={loadingSessions}
        onRevoke={handleRevokeSession}
      />

      <ResetPasswordModal 
        isOpen={!!resetPasswordUser} 
        onClose={() => setResetPasswordUser(null)} 
        resetPasswordUser={resetPasswordUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        onReset={handleResetPassword}
      />

      {/* --- Premium Upgrade Overlay --- */}
      {showUpgradeGate && (
        <UpgradeGateOverlay 
          moduleName={showUpgradeGate}
          requiredTier="Pro"
          onClose={() => setShowUpgradeGate(null)}
        />
      )}
    </div>
  );
};
