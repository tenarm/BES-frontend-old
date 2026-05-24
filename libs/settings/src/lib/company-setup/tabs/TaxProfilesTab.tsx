import React, { useEffect } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { Button, Skeleton } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const TaxProfilesTab: React.FC = () => {
  const {
    taxProfiles,
    subsidiaries,
    isLoading,
    loadTaxProfiles,
    loadSubsidiaries,
    openDrawer
  } = useCompanyStore();

  useEffect(() => {
    loadTaxProfiles();
    loadSubsidiaries();
  }, [loadTaxProfiles, loadSubsidiaries]);

  const handleAddNew = () => {
    openDrawer('taxProfile', 'create');
  };

  const getSubsidiaryName = (id: string) => {
    const sub = subsidiaries.find(s => s.id === id);
    return sub ? sub.name : id;
  };

  if (isLoading && taxProfiles.length === 0) {
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
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-xs)' }}>
        <div>
          <h3 className={styles.sectionTitle} style={{ borderBottom: 'none', margin: 0 }}>Tax Profiles</h3>
          <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px' }}>
            Map tax jurisdictions and registration numbers across registered subsidiaries.
          </p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          ✚ Add Tax Profile
        </Button>
      </div>

      {taxProfiles.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No Tax Profiles Defined</div>
          <div className={styles.emptyStateText}>
            Configure regional VAT, GST, or Sales Tax jurisdictions and associate default rates with your subsidiaries.
          </div>
          <Button size="sm" onClick={handleAddNew}>
            Setup First Tax Profile
          </Button>
        </div>
      ) : (
        <table className={styles.compactTable}>
          <thead>
            <tr>
              <th>Subsidiary</th>
              <th>Tax Authority</th>
              <th>Registration Number</th>
              <th>Default Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {taxProfiles.map((tp) => (
              <tr key={tp.id} style={{ cursor: 'default' }}>
                <td style={{ fontWeight: 'var(--ui-weight-semibold)', color: 'var(--ui-primary)' }}>
                  {getSubsidiaryName(tp.subsidiary_id)}
                </td>
                <td>{tp.tax_authority}</td>
                <td style={{ fontFamily: 'var(--ui-font-mono)' }}>{tp.tax_registration_number}</td>
                <td style={{ fontFamily: 'var(--ui-font-mono)', fontWeight: 'var(--ui-weight-medium)' }}>
                  {(tp.default_tax_rate * 100).toFixed(4)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
