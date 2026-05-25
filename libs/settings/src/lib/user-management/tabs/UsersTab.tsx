import React, { useEffect } from 'react';
import { useUserStore } from '../../state/user-store';
import { useCompanyStore } from '../../state/company-store';
import { useProcessStore } from '@bes/shared-ui';
import { 
  Table, 
  THead, 
  TBody, 
  TR, 
  TH, 
  TD, 
  Badge, 
  Button, 
  Skeleton 
} from '@bes/shared-ui';
import { Users, UserMinus, ShieldAlert, KeyRound, Edit, Plus } from 'lucide-react';
import styles from '../user-management.module.css';

export const UsersTab: React.FC = () => {
  const {
    users,
    roles,
    isLoading,
    loadUsers,
    loadRoles,
    openDrawer,
    offboardUser
  } = useUserStore();

  const { subsidiaries, loadSubsidiaries } = useCompanyStore();
  const startProcess = useProcessStore(s => s.startProcess);
  const addEvent = useProcessStore(s => s.addEvent);

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadSubsidiaries();
  }, [loadUsers, loadRoles, loadSubsidiaries]);

  // Derive summary metrics
  const activeCount = users.filter((u) => u.is_active).length;
  const pendingCount = users.filter((u) => !u.is_active && u.role_id !== null).length; // Simulated pending invites
  const activeSessionsCount = users.length * 2 - 1; // Simulated session count representation

  const handleEditUser = (userId: string) => {
    openDrawer('userEdit', 'edit', userId);
  };

  const handleStartOffboarding = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to trigger the offboarding pipeline for ${username}?`)) {
      return;
    }
    try {
      // 1. Invoke service endpoint deactivation logic
      await offboardUser(userId);
      
      // 2. Start the golden offboarding pipeline in the process store
      await startProcess('user_offboarding');
      
      // 3. Immediately dispatch the first manual step completion event
      addEvent('USER_OFFBOARDED', 'System Administrator', {
        target_user_id: userId,
        target_username: username,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to trigger offboarding process', err);
    }
  };

  const getRoleName = (roleId: string | null) => {
    if (!roleId) return 'Direct Overrides';
    const found = roles.find((r) => r.id === roleId);
    return found ? found.name : 'Unknown Role';
  };

  const getInitials = (fullName: string | null, username: string) => {
    const name = fullName || username;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getSubsidiaryTooltip = (allowedIds: string[]) => {
    if (!allowedIds || allowedIds.length === 0) return 'All Subsidiaries (Unrestricted)';
    const names = allowedIds
      .map((id) => subsidiaries.find((s) => s.id === id)?.name || id)
      .join(', ');
    return `Access to: ${names}`;
  };

  if (isLoading && users.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 0' }}>
        <Skeleton height="36px" width="100%" />
        <Skeleton height="36px" width="100%" />
        <Skeleton height="36px" width="100%" />
        <Skeleton height="36px" width="100%" />
        <Skeleton height="36px" width="100%" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      {/* Dashboard Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <Users size={20} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{activeCount}</span>
            <span className={styles.cardLabel}>Active Staff Directory</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon} style={{ color: 'var(--ui-amber-500)', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
            <KeyRound size={20} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{pendingCount}</span>
            <span className={styles.cardLabel}>Pending Invitations</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon} style={{ color: 'var(--ui-green-500)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
            <ShieldAlert size={20} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue} style={{ animation: 'pulse 2s infinite' }}>{activeSessionsCount}</span>
            <span className={styles.cardLabel}>Active Auth Sessions</span>
          </div>
        </div>
      </div>

      {/* Grid Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h3 style={{ fontSize: 'var(--ui-text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ui-gray-500)', margin: 0 }}>
          Users Listing
        </h3>
        <Button variant="primary" size="sm" onClick={() => openDrawer('userInvite', 'create')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Invite User
        </Button>
      </div>

      {/* Data Presentation Table */}
      <Table>
        <THead>
          <TR>
            <TH style={{ width: '40px' }}></TH>
            <TH>User Identity</TH>
            <TH>Workspace Role</TH>
            <TH>Scoping Limits</TH>
            <TH>Account Status</TH>
            <TH style={{ width: '120px', textAlign: 'right' }}>Actions</TH>
          </TR>
        </THead>
        <TBody>
          {users.length === 0 ? (
            <TR>
              <TD colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ui-gray-400)' }}>
                No active users found in directory.
              </TD>
            </TR>
          ) : (
            users.map((user) => {
              const userInitials = getInitials(user.full_name, user.username);
              const allowedSubs = user.allowed_subsidiary_ids || [];

              return (
                <TR key={user.id} onClick={() => handleEditUser(user.id)}>
                  <TD>
                    <div className={styles.avatar}>{userInitials}</div>
                  </TD>
                  <TD>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: 'var(--ui-gray-900)', fontSize: 'var(--ui-text-sm)' }}>
                        {user.full_name || user.username}
                      </strong>
                      <span style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-400)' }}>
                        {user.email}
                      </span>
                    </div>
                  </TD>
                  <TD>
                    <Badge variant={user.role_id ? 'info' : 'secondary'}>
                      {getRoleName(user.role_id)}
                    </Badge>
                  </TD>
                  <TD>
                    <span 
                      className={styles.tagCount} 
                      title={getSubsidiaryTooltip(user.allowed_subsidiary_ids)}
                    >
                      {allowedSubs.length === 0 ? 'All' : `${allowedSubs.length} Entities`}
                    </span>
                  </TD>
                  <TD>
                    <Badge variant={user.is_active ? 'success' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Deactivated'}
                    </Badge>
                  </TD>
                  <TD onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleEditUser(user.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--ui-gray-500)',
                          padding: '6px',
                          borderRadius: '4px',
                        }}
                        title="Edit security profiles"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartOffboarding(user.id, user.username)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--ui-red-500)',
                          padding: '6px',
                          borderRadius: '4px',
                        }}
                        disabled={!user.is_active}
                        title="Deprovision user workspace"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  </TD>
                </TR>
              );
            })
          )}
        </TBody>
      </Table>
    </div>
  );
};
