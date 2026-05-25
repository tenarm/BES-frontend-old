import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../state/user-store';
import { useAuthStore } from '../../../../../../apps/shell/src/store/auth-store';
import { 
  Table, 
  THead, 
  TBody, 
  TR, 
  TH, 
  TD, 
  Button, 
  UpgradeGateOverlay,
  PremiumLockIndicator,
  FeedbackAlert
} from '@bes/shared-ui';
import { LogOut, Monitor, Tablet, Smartphone, ShieldCheck } from 'lucide-react';
import styles from '../user-management.module.css';

export const SessionsTab: React.FC = () => {
  const {
    users,
    sessions,
    isLoading,
    loadUsers,
    loadSessions,
    revokeSession,
    licensedFeatures,
    loadLicensedFeatures,
    error,
    clearError
  } = useUserStore();

  const currentLoggedInUser = useAuthStore(s => s.currentUser);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    loadLicensedFeatures();
  }, [loadUsers, loadLicensedFeatures]);

  // Set default selected user to current user once users load
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      const defaultUser = currentLoggedInUser ? users.find(u => u.id === currentLoggedInUser.id) : users[0];
      const targetId = defaultUser ? defaultUser.id : users[0].id;
      setSelectedUserId(targetId);
      loadSessions(targetId);
    }
  }, [users, selectedUserId, currentLoggedInUser, loadSessions]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    clearError();
    if (userId) {
      loadSessions(userId);
    }
  };

  const handleRevoke = async (tokenId: string) => {
    if (!window.confirm('Are you sure you want to terminate this active user session? The user will be immediately logged out.')) {
      return;
    }
    setRevokingId(tokenId);
    try {
      await revokeSession(tokenId);
    } catch (err) {
      console.error(err);
    } finally {
      setRevokingId(null);
    }
  };

  const getDeviceIcon = (deviceStr: string) => {
    const str = deviceStr.toLowerCase();
    if (str.includes('phone') || str.includes('mobile')) return <Smartphone size={16} />;
    if (str.includes('ipad') || str.includes('tablet')) return <Tablet size={16} />;
    return <Monitor size={16} />;
  };

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      {!licensedFeatures.session_revocation && (
        <UpgradeGateOverlay moduleName="Active Session Revocation & Monitor" requiredTier="Pro" />
      )}

      <div style={!licensedFeatures.session_revocation ? { opacity: 0.35, pointerEvents: 'none' } : {}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
          {/* Header & User Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--ui-text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ui-gray-500)', margin: 0 }}>
                Active Sessions Control
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-400)' }}>
                Terminate active device tokens and revoke system authentication state
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'var(--ui-text-xs)', fontWeight: 600, color: 'var(--ui-gray-700)', textTransform: 'uppercase' }}>Select User:</span>
              <select
                className={styles.select}
                value={selectedUserId}
                onChange={handleUserChange}
                style={{ width: '220px', padding: '6px 12px', fontSize: 'var(--ui-text-xs)' }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <FeedbackAlert variant="error" title="Session Termination Failure">
              {error}
            </FeedbackAlert>
          )}

          {/* Sessions Table */}
          <Table>
            <THead>
              <TR>
                <TH style={{ width: '40px' }}></TH>
                <TH>Device / Browser</TH>
                <TH>IP Location Address</TH>
                <TH>Session Expiration Time</TH>
                <TH style={{ width: '150px', textAlign: 'right' }}>Security Actions</TH>
              </TR>
            </THead>
            <TBody>
              {sessions.length === 0 ? (
                <TR>
                  <TD colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ui-gray-400)' }}>
                    {isLoading ? 'Loading active tokens...' : 'No active sessions tracked for this user account.'}
                  </TD>
                </TR>
              ) : (
                sessions.map((session, index) => {
                  const isCurrent = selectedUserId === currentLoggedInUser?.id && index === 0; // First session is mock active
                  const deviceLabel = index === 0 ? 'Chrome Browser (Mac OS)' : index === 1 ? 'Safari Mobile (iOS)' : 'Firefox Browser (Linux)';
                  const ipAddress = index === 0 ? '192.168.1.15 (Office)' : index === 1 ? '172.56.21.90 (Mobile ISP)' : '10.0.4.120 (AWS VPN)';

                  return (
                    <TR key={session.id}>
                      <TD>{getDeviceIcon(deviceLabel)}</TD>
                      <TD>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--ui-gray-900)', fontSize: 'var(--ui-text-sm)' }}>
                            {deviceLabel}
                          </strong>
                          {isCurrent && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ui-green-600)', fontWeight: 600 }}>
                              <ShieldCheck size={10} /> Active Connection
                            </span>
                          )}
                        </div>
                      </TD>
                      <TD>
                        <span style={{ fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-600)', fontFamily: 'monospace' }}>
                          {ipAddress}
                        </span>
                      </TD>
                      <TD>
                        <span style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)' }}>
                          {new Date(session.expires_at).toLocaleString()}
                        </span>
                      </TD>
                      <TD style={{ textAlign: 'right' }}>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleRevoke(session.id)}
                          disabled={isCurrent || revokingId === session.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderColor: isCurrent ? 'var(--ui-gray-200)' : 'var(--ui-red-200)',
                            color: isCurrent ? 'var(--ui-gray-400)' : 'var(--ui-red-600)'
                          }}
                          title={isCurrent ? "You cannot terminate your active session connection" : "Log user out"}
                        >
                          <LogOut size={12} /> {revokingId === session.id ? 'Revoking...' : 'Terminate'}
                        </Button>
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
