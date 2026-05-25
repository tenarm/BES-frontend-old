import React, { useEffect, useState } from 'react';
import { Timeline } from '@bes/shared-ui';
import type { AuditEntry } from 'libs/shared-ui/src/lib/process/process-types';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import styles from '../user-management.module.css';

export const HistoryTab: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAuditHistory = () => {
    setIsRefreshing(true);
    // Simulate API fetch delay for audit trail logs
    setTimeout(() => {
      const mockHistory: AuditEntry[] = [
        {
          id: 'aud-001',
          action: 'EVENT',
          module: 'settings',
          description: 'Initiated workspace deprovisioning & offboarding pipeline for user developer@company.com',
          actor_name: 'admin',
          actor_type: 'user',
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
          correlation_id: 'corr-offb-4491',
          changes: {
            triggered_event: 'USER_OFFBOARDED',
            field_changes: [
              { field: 'is_active', old: 'true', new: 'false' },
              { field: 'active_sessions', old: '3 sessions', new: '0 sessions (Revoked)' }
            ]
          }
        },
        {
          id: 'aud-002',
          action: 'DELETE',
          module: 'settings',
          description: 'Terminated active device JWT session token for user accountant@company.com',
          actor_name: 'admin',
          actor_type: 'user',
          created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          correlation_id: 'corr-se-3312',
          changes: {
            triggered_event: 'USER_SESSION_REVOKED',
            field_changes: [
              { field: 'session_id', old: 'token_acct_88', new: 'revoked' }
            ]
          }
        },
        {
          id: 'aud-003',
          action: 'UPDATE',
          module: 'settings',
          description: 'Modified security role assignment and scoping for user controller@company.com',
          actor_name: 'admin',
          actor_type: 'user',
          created_at: new Date(Date.now() - 1000 * 60 * 1440 * 1.5).toISOString(), // 1.5 days ago
          correlation_id: 'corr-role-9921',
          changes: {
            triggered_event: 'USER_ROLE_CHANGED',
            field_changes: [
              { field: 'role_id', old: 'Standard User', new: 'Finance Controller' },
              { field: 'allowed_subsidiary_ids', old: 'Unrestricted', new: '2 Entities (Acme UK, Acme USA)' }
            ]
          }
        },
        {
          id: 'aud-004',
          action: 'CREATE',
          module: 'settings',
          description: 'Sent registration invitation token link to new employee engineer@company.com',
          actor_name: 'admin',
          actor_type: 'user',
          created_at: new Date(Date.now() - 1000 * 60 * 1440 * 3).toISOString(), // 3 days ago
          correlation_id: 'corr-inv-0021',
          changes: {
            triggered_event: 'USER_INVITED',
            field_changes: [
              { field: 'invite_email', old: 'none', new: 'engineer@company.com' },
              { field: 'role_id', old: 'none', new: 'Standard User' }
            ]
          }
        },
        {
          id: 'aud-005',
          action: 'STATUS_CHANGE',
          module: 'settings',
          description: 'User manager@company.com completed workspace registration activation',
          actor_name: 'System Engine',
          actor_type: 'system',
          created_at: new Date(Date.now() - 1000 * 60 * 1440 * 5).toISOString(), // 5 days ago
          correlation_id: 'corr-act-8822',
          changes: {
            field_changes: [
              { field: 'is_active', old: 'false (Pending)', new: 'true (Active)' }
            ]
          }
        }
      ];
      setEntries(mockHistory);
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    loadAuditHistory();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      {/* Header with Refresh button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div>
          <h3 style={{ fontSize: 'var(--ui-text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ui-gray-500)', margin: 0 }}>
            Audit Trail & Activity Log
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-400)' }}>
            Immutable historical record of access controls and profile updates (Basic Level Audits)
          </p>
        </div>
        <button
          type="button"
          onClick={loadAuditHistory}
          disabled={isRefreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'white',
            border: '1px solid var(--ui-gray-200)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: 'var(--ui-text-xs)',
            color: 'var(--ui-gray-600)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-gray-50)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <RefreshCw size={12} className={isRefreshing ? 'spin-animation' : ''} />
          {isRefreshing ? 'Syncing...' : 'Refresh Trails'}
        </button>

        <style>{`
          .spin-animation {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Renders the Timeline component directly */}
      <div style={{ background: 'white', border: '1px solid var(--ui-gray-200)', borderRadius: '12px', padding: '24px' }}>
        <Timeline entries={entries} data={null} />
      </div>
    </div>
  );
};
