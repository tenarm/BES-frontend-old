import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../state/user-store';
import { SlideOutDrawer, Input, Button, FeedbackAlert } from '@bes/shared-ui';
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

export const RoleEditDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerEntity,
    drawerMode,
    selectedEntityId,
    roles,
    conflictError,
    error,
    createRole,
    updateRole,
    closeDrawer,
    clearConflict,
    clearError
  } = useUserStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  // Accordion collapsed state for settings permissions
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');

  const isOpen = isDrawerOpen && drawerEntity === 'roleEdit';

  useEffect(() => {
    if (isOpen) {
      clearConflict();
      clearError();
      setNameError('');
      
      if (drawerMode === 'edit' && selectedEntityId) {
        const selected = roles.find(r => r.id === selectedEntityId);
        if (selected) {
          setName(selected.name);
          setDescription(selected.description || '');
          
          // Flatten standard nested dict permissions into single flat keys: e.g. settings:company_setup:read
          const flatPerms: Record<string, boolean> = {};
          if (selected.permissions && typeof selected.permissions === 'object') {
            Object.entries(selected.permissions).forEach(([modKey, modVal]: [string, any]) => {
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
          setPermissions(flatPerms);
        }
      } else {
        setName('');
        setDescription('');
        setPermissions({});
      }
    }
  }, [isOpen, drawerMode, selectedEntityId, roles, clearConflict, clearError]);

  const handlePermissionChange = (resKey: string, actKey: string, checked: boolean) => {
    const key = `settings:${resKey}:${actKey}`;
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleOverwriteSubmit = async (e: React.FormEvent) => {
    handleSubmit(e, true);
  };

  const handleSubmit = async (e: React.FormEvent, overwrite = false) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Role name is required.');
      return;
    }
    setNameError('');

    setIsSubmitting(true);
    try {
      // Package flat permissions back into standard nested structure
      const nestedPerms: Record<string, any> = { settings: {} };
      Object.entries(permissions).forEach(([permKey, isChecked]) => {
        if (isChecked) {
          const [mod, res, act] = permKey.split(':');
          if (!nestedPerms[mod]) nestedPerms[mod] = {};
          if (!nestedPerms[mod][res]) nestedPerms[mod][res] = {};
          nestedPerms[mod][res][act] = true;
        }
      });

      const dataToSubmit = {
        name,
        description,
        permissions: nestedPerms
      };

      if (drawerMode === 'create') {
        await createRole(dataToSubmit);
      } else if (selectedEntityId) {
        const currentRole = roles.find(r => r.id === selectedEntityId);
        await updateRole(selectedEntityId, {
          ...dataToSubmit,
          version_id: overwrite && conflictError ? conflictError.server_version.version_id : currentRole?.version_id
        } as any);
      }
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
        {drawerMode === 'create' ? 'Create Custom Role' : 'Save Changes'}
      </Button>
    </div>
  );

  const drawerTitle = drawerMode === 'create' ? 'Create Custom Role' : 'Edit Custom Role';

  return (
    <SlideOutDrawer isOpen={isOpen} onClose={closeDrawer} title={drawerTitle} footer={footer}>
      <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        {conflictError && (
          <div className={styles.selfLockoutAlert} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--ui-spacing-sm)' }}>
            <strong>Concurrency Conflict Detected!</strong>
            <p style={{ margin: 0, fontSize: 'var(--ui-text-xs)' }}>
              Another administrator has modified this role. Click "Overwrite" to apply your changes using the latest server version, or "Cancel" to discard.
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
          label="Role Name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError('');
          }}
          error={nameError}
          placeholder="e.g. Sales Auditor"
          disabled={isSubmitting || drawerMode === 'edit'}
          required
        />

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Role Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the operations of this custom security role..."
            disabled={isSubmitting}
          />
        </div>

        {/* Accordion chunked matrix (Miller's Law - Settings Module contains at most 8 sub-resources) */}
        <div className={styles.accordion}>
          <div className={styles.accordionHeader} onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
            <span>Settings Module Permissions (🔒 Basic Gated)</span>
            <span>{isAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {isAccordionOpen && (
            <div className={styles.accordionContent}>
              {SYSTEM_RESOURCES.map((res) => {
                const readKey = `settings:${res.key}:read`;
                const writeKey = `settings:${res.key}:write`;
                const isReadChecked = !!permissions[readKey];
                const isWriteChecked = !!permissions[writeKey];

                return (
                  <div key={res.key} className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>{res.name}</span>
                    <div style={{ display: 'flex', gap: 'var(--ui-spacing-md)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--ui-text-xs)' }}>
                        <input
                          type="checkbox"
                          checked={isReadChecked}
                          onChange={(e) => handlePermissionChange(res.key, 'read', e.target.checked)}
                          disabled={isSubmitting}
                        />
                        Read
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--ui-text-xs)' }}>
                        <input
                          type="checkbox"
                          checked={isWriteChecked}
                          onChange={(e) => handlePermissionChange(res.key, 'write', e.target.checked)}
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
      </form>
    </SlideOutDrawer>
  );
};
