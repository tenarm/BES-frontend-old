import React from 'react';
import { Drawer, Button, Input } from '@bes/shared-ui';
import { UserData, RoleData, SubsidiaryData } from '../types';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UserData | null;
  setSelectedUser: (user: UserData) => void;
  userPassword: string;
  setUserPassword: (pass: string) => void;
  fieldErrors: Record<string, string>;
  roles: RoleData[];
  subsidiaries: SubsidiaryData[];
  onSave: (e: React.FormEvent) => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  isOpen,
  onClose,
  selectedUser,
  setSelectedUser,
  userPassword,
  setUserPassword,
  fieldErrors,
  roles,
  subsidiaries,
  onSave,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedUser?.id ? "Edit Operator profile" : "Onboard New Operator"}
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Register Operator</Button>
        </div>
      }
    >
      {selectedUser && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input 
            label="Username" 
            value={selectedUser.username}
            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            required
            disabled={!!selectedUser.id}
          />
          <Input 
            label="Full Name" 
            value={selectedUser.full_name}
            onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
            required
          />
          <Input 
            label="Email Address" 
            value={selectedUser.email}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            required
          />
          
          {!selectedUser.id && (
            <Input 
              label="Password (min 12 chars, upper, lower, digit)" 
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              error={fieldErrors.password}
              required
            />
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Security Access Role</label>
            <select 
              value={selectedUser.role_id || ''} 
              onChange={(e) => setSelectedUser({ ...selectedUser, role_id: e.target.value || undefined })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--ui-gray-300)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">Select Security Role...</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name} ({r.description})</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Primary Corporate Subsidiary</label>
            <select 
              value={selectedUser.primary_subsidiary_id || ''} 
              onChange={(e) => setSelectedUser({ ...selectedUser, primary_subsidiary_id: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--ui-gray-300)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">Select Primary Branch...</option>
              {subsidiaries.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Allowed Subsidiaries (Roaming Access)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 150, overflowY: 'auto', border: '1px solid var(--ui-gray-200)', borderRadius: 8, padding: 12 }}>
              {subsidiaries.map((s) => {
                const checked = selectedUser.allowed_subsidiary_ids?.includes(s.id!);
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="checkbox" 
                      id={`sub_check_${s.id}`} 
                      checked={checked}
                      onChange={() => {
                        const nextIds = checked 
                          ? selectedUser.allowed_subsidiary_ids.filter(id => id !== s.id)
                          : [...(selectedUser.allowed_subsidiary_ids || []), s.id!];
                        setSelectedUser({ ...selectedUser, allowed_subsidiary_ids: nextIds });
                      }}
                    />
                    <label htmlFor={`sub_check_${s.id}`} style={{ fontSize: '0.85rem' }}>{s.name}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      )}
    </Drawer>
  );
};
