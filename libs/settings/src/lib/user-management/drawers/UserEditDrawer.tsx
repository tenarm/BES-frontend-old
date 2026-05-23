import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../state/user-store';
import { useCompanyStore } from '../../state/company-store';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert, PremiumLockIndicator } from '@bes/shared-ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../user-management.module.css';

const SYSTEM_RESOURCES = [
  { key: 'company_setup', name: 'Company Setup' },
  { key: 'user_management', name: 'User Management' },
  { key: 'module_toggle', name: 'Module Toggle' },
  { key: 'workflow_config', name: 'Workflow Config' },
  { key: 'notification_rules', name: 'Notification Rules' },
  { key: 'number_series', name: 'Number Series' },
  { key: 'email_templates', name: 'Email Templates' },
  { key: 'audit_log', name: 'Audit Log' }
];

export const UserEditDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    drawerMode,
    selectedEntityId,
    users,
    roles,
    conflictError,
    error,
    updateUser,
    loadRoles,
    closeDrawer,
    clearConflict,
    clearError,
    licensedFeatures
  } = useUserStore();

  const { subsidiaries, loadSubsidiaries } = useCompanyStore();
  const currentLoggedInUser = useAuthStore(s => s.currentUser);

  const [fullName, setFullName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [allowedSubsidiaries, setAllowedSubsidiaries] = useState<string[]>([]);
  const [customPermissions, setCustomPermissions] = useState<Record<string, boolean>>({});

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isDrawerOpen && drawerEntity === 'userEdit';
  const isEditingSelf = selectedEntityId === currentLoggedInUser?.id;

  useEffect(() => {
    if (isOpen) {
      loadRoles();
      loadSubsidiaries();
      clearConflict();
      clearError();

      if (drawerMode === 'edit' && selectedEntityId) {
        const selected = users.find(u => u.id === selectedEntityId);
        if (selected) {
          setFullName(selected.full_name || '');
          setRoleId(selected.role_id || '');
          setIsActive(selected.is_active);
          setAllowedSubsidiaries(selected.allowed_subsidiary_ids || []);
          
          // Flatten standard nested dict custom permissions
          const flatPerms: Record<string, boolean> = {};
          if (selected.custom_permissions && typeof selected.custom_permissions === 'object') {
            Object.entries(selected.custom_permissions).forEach(([modKey, modVal]: [string, any]) => {
              if (modVal && typeof modVal === 'object') {
                Object.entries(modVal).forEach(([resKey, resVal]: [string, any]) => {
                  if (resVal && typeof resVal === 'object') {
                    Object.entries(resVal).forEach(([actKey, actVal]) => {
                      if (actVal === true) {
                        flatPerms[`${modKey}:${resKey}:${actKey}`] = true;
                      }
                    });
                  }
                });
              }
            });
          }
          setCustomPermissions(flatPerms);
        }
      }
    }
  }, [isOpen, drawerMode, selectedEntityId, users, loadRoles, loadSubsidiaries, clearConflict, clearError]);

  const handleSubsidiaryToggle = (subId: string, checked: boolean) => {
    if (!licensedFeatures.subsidiary_scoping) return;
    setAllowedSubsidiaries(prev =>
      checked ? [...prev, subId] : prev.filter(id => id !== subId)
    );
  };

  const handlePermissionToggle = (resKey: string, actKey: string, checked: boolean) => {
    if (!licensedFeatures.custom_rbac) return;
    const key = `settings:${resKey}:${actKey}`;
    setCustomPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleOverwriteSubmit = async (e: React.FormEvent) => {
    handleSubmit(e, true);
  };

  const handleSubmit = async (e: React.FormEvent, overwrite = false) => {
    e.preventDefault();
    if (!selectedEntityId) return;

    setIsSubmitting(true);
    try {
      // Package flat permissions back into standard nested structure
      const nestedPerms: Record<string, any> = { settings: {} };
      Object.entries(customPermissions).forEach(([permKey, isChecked]) => {
        if (isChecked) {
          const [mod, res, act] = permKey.split(':');
          if (!nestedPerms[mod]) nestedPerms[mod] = {};
          if (!nestedPerms[mod][res]) nestedPerms[mod][res] = {};
          nestedPerms[mod][res][act] = true;
        }
      });

      const selected = users.find(u => u.id === selectedEntityId);
      const dataToSubmit = {
        full_name: fullName || null,
        role_id: roleId || null,
        is_active: isEditingSelf ? true : isActive, // Self lockout protection
        allowed_subsidiary_ids: licensedFeatures.subsidiary_scoping ? allowedSubsidiaries : undefined,
        custom_permissions: licensedFeatures.custom_rbac ? nestedPerms : undefined,
        version_id: overwrite && conflictError ? conflictError.server_version.version_id : selected?.version_id
      };

      await updateUser(selectedEntityId, dataToSubmit as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)' }}>
      <Button variant="outline" type="button" onClick={closeDrawer} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e, false)} isLoading={isSubmitting}>
        Save Changes
      </Button>
    </div>
  );

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title="User Profile Security" footer={footer}>
      <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        
        {isEditingSelf && (
          <div className={styles.selfLockoutAlert}>
            ⚠️ <strong>Self-Lockout Protection:</strong> You cannot deactivate or revoke your own active administrator account.
          </div>
        )}

        {conflictError && (
          <div className={styles.selfLockoutAlert} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--ui-spacing-sm)' }}>
            <strong>Concurrency Conflict Detected!</strong>
            <p style={{ margin: 0, fontSize: 'var(--ui-text-xs)' }}>
              Another administrator has saved changes to this user's profile. Please review the server's version and click Overwrite to apply your changes.
            </p>
            <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)', marginTop: 'var(--ui-spacing-xs)' }}>
              <Button size="sm" variant="primary" onClick={handleOverwriteSubmit}>
                Overwrite Server
              </Button>
              <Button size="sm" variant="outline" onClick={closeDrawer}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {error && (
          <FeedbackAlert variant="error" title="Action Failed">
            {error}
          </FeedbackAlert>
        )}

        <Input
          label="Full Profile Name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. John Doe"
          disabled={isSubmitting}
        />

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Workspace Security Role</label>
          <select
            className={styles.select}
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            disabled={isSubmitting || roles.length === 0}
          >
            <option value="">[None - Defer to Direct Overrides]</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subsidiary Access Scoping Grid (Guarded) */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Subsidiary Scoping Limits
            {!licensedFeatures.subsidiary_scoping && <PremiumLockIndicator />}
          </label>
          <div style={{
            border: '1px solid var(--ui-gray-200)',
            borderRadius: '8px',
            padding: '12px',
            background: licensedFeatures.subsidiary_scoping ? 'white' : 'var(--ui-gray-100)',
            opacity: licensedFeatures.subsidiary_scoping ? 1 : 0.6,
            maxHeight: '160px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {subsidiaries.length === 0 ? (
              <span style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-400)' }}>No subsidiaries registered</span>
            ) : (
              subsidiaries.map((sub) => (
                <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ui-text-sm)', cursor: licensedFeatures.subsidiary_scoping ? 'pointer' : 'not-allowed' }}>
                  <input
                    type="checkbox"
                    checked={allowedSubsidiaries.includes(sub.id)}
                    onChange={(e) => handleSubsidiaryToggle(sub.id, e.target.checked)}
                    disabled={isSubmitting || !licensedFeatures.subsidiary_scoping}
                  />
                  {sub.name} ({sub.currency_code})
                </label>
              ))
            )}
          </div>
        </div>

        {/* Direct Overrides Accordion (Guarded) */}
        <div className={styles.accordion} style={{ opacity: licensedFeatures.custom_rbac ? 1 : 0.6 }}>
          <div className={styles.accordionHeader} onClick={() => licensedFeatures.custom_rbac && setIsAccordionOpen(!isAccordionOpen)} style={{ cursor: licensedFeatures.custom_rbac ? 'pointer' : 'not-allowed' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Direct Permission Overrides
              {!licensedFeatures.custom_rbac && <PremiumLockIndicator />}
            </span>
            <span>{isAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {isAccordionOpen && licensedFeatures.custom_rbac && (
            <div className={styles.accordionContent}>
              {SYSTEM_RESOURCES.map((res) => {
                const readKey = `settings:${res.key}:read`;
                const writeKey = `settings:${res.key}:write`;
                const isReadChecked = !!customPermissions[readKey];
                const isWriteChecked = !!customPermissions[writeKey];

                return (
                  <div key={res.key} className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>{res.name}</span>
                    <div style={{ display: 'flex', gap: 'var(--ui-spacing-md)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--ui-text-xs)' }}>
                        <input
                          type="checkbox"
                          checked={isReadChecked}
                          onChange={(e) => handlePermissionToggle(res.key, 'read', e.target.checked)}
                          disabled={isSubmitting}
                        />
                        Read
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--ui-text-xs)' }}>
                        <input
                          type="checkbox"
                          checked={isWriteChecked}
                          onChange={(e) => handlePermissionToggle(res.key, 'write', e.target.checked)}
                          disabled={isSubmitting}
                        />
                        Write
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Active State Toggler */}
        {!isEditingSelf && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-sm)', padding: 'var(--ui-spacing-xs) 0' }}>
            <input
              type="checkbox"
              id="user-status-toggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="user-status-toggle" className={styles.formLabel} style={{ cursor: 'pointer', select: 'none', margin: 0 }}>
              User Account is Active (Enabled for active logins)
            </label>
          </div>
        )}
      </form>
    </SlideOutDrawer>
  );
};
