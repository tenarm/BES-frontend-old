import React, { useEffect } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { Button, Badge, Skeleton } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const SubsidiariesTab: React.FC = () => {
  const {
    subsidiaries,
    isLoading,
    loadSubsidiaries,
    openDrawer
  } = useCompanyStore();

  useEffect(() => {
    loadSubsidiaries();
  }, [loadSubsidiaries]);

  const handleRowClick = (id: string) => {
    openDrawer('subsidiary', 'edit', id);
  };

  const handleAddNew = () => {
    openDrawer('subsidiary', 'create');
  };

  if (isLoading && subsidiaries.length === 0) {
    return (
      <div className={styles.sectionCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-md)' }}>
          <Skeleton width="180px" height="24px" />
          <Skeleton width="120px" height="32px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-sm)' }}>
          <Skeleton height="36px" />
          <Skeleton height="36px" />
          <Skeleton height="36px" />
          <Skeleton height="36px" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-xs)' }}>
        <div>
          <h3 className={styles.sectionTitle} style={{ borderBottom: 'none', margin: 0 }}>Registered Entities</h3>
          <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px' }}>
            Manage sister companies, domestic branches, or international subsidiaries.
          </p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          ✚ Add Subsidiary
        </Button>
      </div>

      {subsidiaries.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No Subsidiaries Configured</div>
          <div className={styles.emptyStateText}>
            Structure your corporate group registry by adding domestic or international subsidiaries to unlock hierarchical mapping.
          </div>
          <Button size="sm" onClick={handleAddNew}>
            Register First Subsidiary
          </Button>
        </div>
      ) : (
        <table className={styles.compactTable}>
          <thead>
            <tr>
              <th>Entity ID</th>
              <th>Name</th>
              <th>Legal Name</th>
              <th>Country</th>
              <th>Currency</th>
              <th>Tax ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subsidiaries.map((sub) => (
              <tr key={sub.id} onClick={() => handleRowClick(sub.id)}>
                <td style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '11px', color: 'var(--ui-gray-500)' }}>
                  {sub.id.substring(0, 8)}...
                </td>
                <td style={{ fontWeight: 'var(--ui-weight-semibold)', color: 'var(--ui-primary)' }}>
                  {sub.name}
                </td>
                <td>{sub.legal_name}</td>
                <td>{sub.country_code}</td>
                <td>
                  <Badge variant="info">{sub.currency_code}</Badge>
                </td>
                <td style={{ fontFamily: 'var(--ui-font-mono)' }}>{sub.tax_id || '—'}</td>
                <td>
                  <span className={`${styles.statusChip} ${sub.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
