import React from 'react';
import { Timeline, useActivityStream } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const AuditLogTab: React.FC = () => {
  const { entries, isConnected, error } = useActivityStream({ module: 'settings' });

  return (
    <div className={styles.sectionCard} style={{ minHeight: '350px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-sm)' }}>
        <div>
          <h3 className={styles.sectionTitle} style={{ borderBottom: 'none', margin: 0 }}>System Configuration Audit Trail</h3>
          <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px' }}>
            Real-time chronological log of system-wide setup adjustments and metadata writes.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-xs)' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isConnected ? 'var(--ui-success)' : 'var(--ui-error)',
              display: 'inline-block'
            }}
          />
          <span className={styles.label} style={{ fontSize: '11px', fontWeight: 'var(--ui-weight-medium)' }}>
            {isConnected ? 'LIVE SYNCED' : error || 'DISCONNECTED'}
          </span>
        </div>
      </div>

      <Timeline data={null} entries={entries} />
    </div>
  );
};
