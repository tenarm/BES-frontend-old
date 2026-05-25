import React, { useEffect } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { Button, Card, Skeleton } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const SharingTab: React.FC = () => {
  const {
    sharingRules,
    intercompanyAccounts,
    subsidiaries,
    isLoading,
    loadSharingRules,
    saveSharingRules,
    loadIntercompanyAccounts,
    loadSubsidiaries,
    openDrawer
  } = useCompanyStore();

  useEffect(() => {
    loadSharingRules();
    loadIntercompanyAccounts();
    loadSubsidiaries();
  }, [loadSharingRules, loadIntercompanyAccounts, loadSubsidiaries]);

  const handleToggleSharing = async (entityType: 'CUSTOMER' | 'VENDOR' | 'ITEM', currentShared: boolean) => {
    const updatedRules = sharingRules.map((rule) =>
      rule.entity_type === entityType
        ? { ...rule, is_globally_shared: !currentShared }
        : rule
    );
    try {
      await saveSharingRules(updatedRules);
    } catch (e) {
      console.error('Failed to update sharing rules', e);
    }
  };

  const getSubName = (id: string) => {
    const sub = subsidiaries.find(s => s.id === id);
    return sub ? sub.name : id;
  };

  const handleAddMapping = () => {
    openDrawer('intercompany', 'create');
  };

  const customerRule = sharingRules.find(r => r.entity_type === 'CUSTOMER');
  const vendorRule = sharingRules.find(r => r.entity_type === 'VENDOR');
  const itemRule = sharingRules.find(r => r.entity_type === 'ITEM');

  if (isLoading && sharingRules.length === 0) {
    return (
      <div className={styles.sectionCard}>
        <Skeleton width="180px" height="24px" />
        <Skeleton height="140px" />
        <Skeleton height="180px" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      {/* Master Data Sharing Card */}
      <Card title="Master Data Sharing Rules" subtitle="Configure whether data records are isolated per subsidiary or shared globally.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)', marginTop: 'var(--ui-spacing-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ui-gray-100)', paddingBottom: 'var(--ui-spacing-sm)' }}>
            <div>
              <strong style={{ fontSize: 'var(--ui-text-base)', color: 'var(--ui-gray-800)' }}>Customer Master Sharing</strong>
              <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px', color: 'var(--ui-gray-500)' }}>
                When enabled, all subsidiaries share a single Customer master database.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-sm)' }}>
              <span className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase', color: customerRule?.is_globally_shared ? 'var(--ui-success)' : 'var(--ui-gray-400)' }}>
                {customerRule?.is_globally_shared ? 'Globally Shared' : 'Isolated List'}
              </span>
              <input
                type="checkbox"
                checked={customerRule?.is_globally_shared || false}
                onChange={() => handleToggleSharing('CUSTOMER', customerRule?.is_globally_shared || false)}
                style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ui-gray-100)', paddingBottom: 'var(--ui-spacing-sm)' }}>
            <div>
              <strong style={{ fontSize: 'var(--ui-text-base)', color: 'var(--ui-gray-800)' }}>Vendor Master Sharing</strong>
              <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px', color: 'var(--ui-gray-500)' }}>
                When enabled, suppliers and vendor nodes are visible across all ledgers.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-sm)' }}>
              <span className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase', color: vendorRule?.is_globally_shared ? 'var(--ui-success)' : 'var(--ui-gray-400)' }}>
                {vendorRule?.is_globally_shared ? 'Globally Shared' : 'Isolated List'}
              </span>
              <input
                type="checkbox"
                checked={vendorRule?.is_globally_shared || false}
                onChange={() => handleToggleSharing('VENDOR', vendorRule?.is_globally_shared || false)}
                style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 'var(--ui-text-base)', color: 'var(--ui-gray-800)' }}>Item Master Sharing</strong>
              <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px', color: 'var(--ui-gray-500)' }}>
                When enabled, products, service items, and material SKUs are standardized globally.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-sm)' }}>
              <span className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase', color: itemRule?.is_globally_shared ? 'var(--ui-success)' : 'var(--ui-gray-400)' }}>
                {itemRule?.is_globally_shared ? 'Globally Shared' : 'Isolated List'}
              </span>
              <input
                type="checkbox"
                checked={itemRule?.is_globally_shared || false}
                onChange={() => handleToggleSharing('ITEM', itemRule?.is_globally_shared || false)}
                style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Intercompany Balancing Card */}
      <div className={styles.sectionCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-xs)' }}>
          <div>
            <h3 className={styles.sectionTitle} style={{ borderBottom: 'none', margin: 0 }}>Intercompany Accounts</h3>
            <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px' }}>
              Map due-to / due-from G/L accounts to balance intercompany transactions.
            </p>
          </div>
          <Button size="sm" onClick={handleAddMapping}>
            ✚ Add Account Map
          </Button>
        </div>

        {intercompanyAccounts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>No Intercompany Accounts Mapped</div>
            <div className={styles.emptyStateText}>
              Balanced ledger journals require mapping of due-to and due-from G/L control accounts between operating subsidiaries.
            </div>
            <Button size="sm" onClick={handleAddMapping}>
              Map First Accounts Pair
            </Button>
          </div>
        ) : (
          <table className={styles.compactTable}>
            <thead>
              <tr>
                <th>From Subsidiary</th>
                <th>To Subsidiary</th>
                <th>Due-To Account</th>
                <th>Due-From Account</th>
              </tr>
            </thead>
            <tbody>
              {intercompanyAccounts.map((ica) => (
                <tr key={ica.id} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 'var(--ui-weight-semibold)', color: 'var(--ui-primary)' }}>
                    {getSubName(ica.from_subsidiary_id)}
                  </td>
                  <td style={{ fontWeight: 'var(--ui-weight-semibold)', color: 'var(--ui-primary)' }}>
                    {getSubName(ica.to_subsidiary_id)}
                  </td>
                  <td style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '12px' }}>
                    {ica.due_to_account_id}
                  </td>
                  <td style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '12px' }}>
                    {ica.due_from_account_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
