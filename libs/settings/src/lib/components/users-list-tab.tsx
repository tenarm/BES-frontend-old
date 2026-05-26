import React from 'react';
import { Card, Button, Skeleton, Table, Badge } from '@bes/shared-ui';
import { Search, Plus } from 'lucide-react';
import { UserData, RoleData } from '../types';

interface UsersListTabProps {
  users: UserData[];
  roles: RoleData[];
  search: string;
  setSearch: (search: string) => void;
  loading: boolean;
  onOnboard: () => void;
  onEdit: (user: UserData) => void;
  onViewSessions: (user: UserData) => void;
  onResetPass: (user: UserData) => void;
  onToggleStatus: (user: UserData) => void;
}

export const UsersListTab: React.FC<UsersListTabProps> = ({
  users,
  roles,
  search,
  setSearch,
  loading,
  onOnboard,
  onEdit,
  onViewSessions,
  onResetPass,
  onToggleStatus,
}) => {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ui-gray-400)' }} />
          <input 
            type="text" 
            placeholder="Search users by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              border: '1px solid var(--ui-gray-300)',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <Button variant="primary" onClick={onOnboard}>
          <Plus size={16} style={{ marginRight: 6 }} /> Onboard User
        </Button>
      </div>

      {loading ? (
        <Skeleton count={5} height={40} />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Active Role</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Security Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ui-gray-500)' }}>
                  No user accounts found matching query.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                  <td>@{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge variant="info">
                      {roles.find(r => r.id === u.role_id)?.name || (u.is_superuser ? 'Superuser' : 'No Role Assigned')}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={u.is_active ? 'success' : 'warning'}>
                      {u.is_active ? 'Active' : 'Locked'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <Button variant="secondary" size="sm" onClick={() => onEdit(u)}>
                        Edit profile
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => onViewSessions(u)}>
                        Sessions
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => onResetPass(u)}>
                        Reset pass
                      </Button>
                      <Button 
                        variant={u.is_active ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => onToggleStatus(u)}
                      >
                        {u.is_active ? 'Lock' : 'Unlock'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Card>
  );
};
