import React from 'react';
import { Card, Button, Table } from '@bes/shared-ui';
import { Plus, Trash2 } from 'lucide-react';
import { RoleData } from '../types';

interface RolesPermissionsTabProps {
  roles: RoleData[];
  onAdd: () => void;
  onEditPermissions: (role: RoleData) => void;
  onDelete: (id: string) => void;
}

export const RolesPermissionsTab: React.FC<RolesPermissionsTabProps> = ({
  roles,
  onAdd,
  onEditPermissions,
  onDelete,
}) => {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Custom Security Roles</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)', marginTop: 4 }}>Configure granular permissions matrix mapping for authorization checks.</p>
        </div>
        <Button variant="primary" onClick={onAdd}>
          <Plus size={16} style={{ marginRight: 6 }} /> Create Custom Role
        </Button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td style={{ fontWeight: 600 }}>{r.name}</td>
              <td style={{ color: 'var(--ui-gray-600)' }}>{r.description || 'No description provided.'}</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onEditPermissions(r)}
                  >
                    Permissions Matrix
                  </Button>
                  {!['admin', 'manager', 'staff'].includes(r.name) && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => onDelete(r.id!)}
                    >
                      <Trash2 size={14} style={{ color: '#dc2626' }} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};
