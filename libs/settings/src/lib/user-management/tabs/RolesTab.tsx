import React, { useEffect } from 'react';
import { useUserStore } from '../../state/user-store';
import { 
  Table, 
  THead, 
  TBody, 
  TR, 
  TH, 
  TD, 
  Badge, 
  Button, 
  UpgradeGateOverlay,
  PremiumLockIndicator
} from '@bes/shared-ui';
import { Plus, Shield, Edit } from 'lucide-react';
import styles from '../user-management.module.css';

export const RolesTab: React.FC = () => {
  const {
    roles,
    isLoading,
    loadRoles,
    openDrawer,
    licensedFeatures,
    loadLicensedFeatures
  } = useUserStore();

  useEffect(() => {
    loadRoles();
    loadLicensedFeatures();
  }, [loadRoles, loadLicensedFeatures]);

  const handleEditRole = (roleId: string) => {
    openDrawer('roleEdit', 'edit', roleId);
  };

  const countPermissions = (perms: Record<string, any>) => {
    let count = 0;
    if (!perms || typeof perms !== 'object') return 0;
    Object.values(perms).forEach((moduleVal: any) => {
      if (moduleVal && typeof moduleVal === 'object') {
        Object.values(moduleVal).forEach((resourceVal: any) => {
          if (resourceVal && typeof resourceVal === 'object') {
            Object.values(resourceVal).forEach((actVal) => {
              if (actVal === true) count++;
            });
          }
        });
      }
    });
    return count;
  };

  // Predefined/standard roles that are seeded in the DB
  const STANDARD_ROLE_NAMES = ['Administrator', 'Standard User', 'CFO', 'Finance Controller', 'Accountant'];

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      {!licensedFeatures.custom_rbac && (
        <UpgradeGateOverlay moduleName="Custom RBAC Roles Matrix" requiredTier="Pro" />
      )}

      <div style={!licensedFeatures.custom_rbac ? { opacity: 0.35, pointerEvents: 'none' } : {}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
          {/* Grid Action Header */}
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 'var(--ui-text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ui-gray-500)', margin: 0 }}>
                Security Roles
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-400)' }}>
                System-defined and custom security privilege profiles
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openDrawer('roleEdit', 'create')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Create Custom Role
            </Button>
          </div>

          {/* Roles Table */}
          <Table>
            <THead>
              <TR>
                <TH>Role Name</TH>
                <TH>Description</TH>
                <TH>Type</TH>
                <TH>Permissions Allowed</TH>
                <TH style={{ width: '80px', textAlign: 'right' }}>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {roles.length === 0 ? (
                <TR>
                  <TD colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ui-gray-400)' }}>
                    No security roles found.
                  </TD>
                </TR>
              ) : (
                roles.map((role) => {
                  const isStandard = STANDARD_ROLE_NAMES.includes(role.name);
                  const permsCount = countPermissions(role.permissions);

                  return (
                    <TR key={role.id} onClick={() => !isStandard && handleEditRole(role.id)}>
                      <TD>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Shield size={16} color={isStandard ? 'var(--ui-gray-400)' : 'var(--ui-primary)'} />
                          <strong style={{ color: 'var(--ui-gray-900)', fontSize: 'var(--ui-text-sm)' }}>
                            {role.name}
                          </strong>
                        </div>
                      </TD>
                      <TD>
                        <span style={{ fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-600)' }}>
                          {role.description || 'No description provided.'}
                        </span>
                      </TD>
                      <TD>
                        <Badge variant={isStandard ? 'secondary' : 'info'}>
                          {isStandard ? 'Standard' : 'Custom'}
                        </Badge>
                      </TD>
                      <TD>
                        <Badge variant="success">
                          {isStandard ? 'Full / Seeding Mapped' : `${permsCount} privileges`}
                        </Badge>
                      </TD>
                      <TD onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                        {!isStandard && (
                          <button
                            type="button"
                            onClick={() => handleEditRole(role.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--ui-gray-500)',
                              padding: '6px',
                              borderRadius: '4px',
                            }}
                            title="Edit permissions matrix"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                      </TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
