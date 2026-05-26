import React from 'react';
import { Drawer, Button, Input } from '@bes/shared-ui';
import { RoleData } from '../types';

interface RoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: RoleData | null;
  setSelectedRole: (role: RoleData) => void;
  onPermissionToggle: (module: string, resource: string, action: string) => void;
  onSave: (e: React.FormEvent) => void;
}

const PERMISSION_MATRIX_SPEC = {
  sales: ['customer_master'],
  inventory: ['item_master', 'warehouse_location', 'goods_receipt', 'goods_issue'],
  settings: ['company_setup', 'user_management', 'module_toggle', 'notification_rules', 'workflow_config'],
  finance: ['coa', 'gl_entries', 'tax_profile', 'accounts_payable', 'accounts_receivable']
};

export const RoleDrawer: React.FC<RoleDrawerProps> = ({
  isOpen,
  onClose,
  selectedRole,
  setSelectedRole,
  onPermissionToggle,
  onSave,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedRole?.id ? `Permissions Matrix: ${selectedRole.name}` : "Create Custom Role"}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Save Role & Matrix</Button>
        </div>
      }
    >
      {selectedRole && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input 
            label="Role Name" 
            value={selectedRole.name} 
            onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
            required
            disabled={!!selectedRole.id && ['admin', 'manager', 'staff'].includes(selectedRole.name)}
          />
          <Input 
            label="Role Description" 
            value={selectedRole.description} 
            onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
          />

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 12px 0' }}>Granular Access Control Matrix</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(PERMISSION_MATRIX_SPEC).map(([module, resources]) => (
                <div key={module} style={{ border: '1px solid var(--ui-gray-200)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ui-primary)', marginBottom: 8 }}>
                    {module} Module
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {resources.map((res) => (
                      <div key={res} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ui-gray-700)', fontWeight: 600 }}>{res.replace('_', ' ')}</span>
                        
                        {['read', 'write', 'delete'].map((action) => {
                          const isChecked = !!selectedRole.permissions[module]?.[res]?.[action];
                          return (
                            <label key={action} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => onPermissionToggle(module, res, action)}
                              />
                              {action}
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </Drawer>
  );
};
