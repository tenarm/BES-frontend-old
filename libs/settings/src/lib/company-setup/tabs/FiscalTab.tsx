import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../state/company-store';
import { Button, Badge, Skeleton, useProcessStore } from '@bes/shared-ui';
import styles from '../company-setup.module.css';

export const FiscalTab: React.FC = () => {
  const {
    fiscalYears,
    postingPeriods,
    isLoading,
    loadFiscalYears,
    loadPostingPeriods,
    lockPostingPeriod,
    openDrawer
  } = useCompanyStore();

  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);

  useEffect(() => {
    loadFiscalYears();
  }, [loadFiscalYears]);

  // Auto-select first fiscal year on load
  useEffect(() => {
    if (fiscalYears.length > 0 && !selectedYearId) {
      setSelectedYearId(fiscalYears[0].id);
    }
  }, [fiscalYears, selectedYearId]);

  useEffect(() => {
    if (selectedYearId) {
      loadPostingPeriods(selectedYearId);
    }
  }, [selectedYearId, loadPostingPeriods]);

  const handleYearClick = (id: string) => {
    setSelectedYearId(id);
  };

  const handleAddNewYear = () => {
    openDrawer('fiscalYear', 'create');
  };

  const handleLockPeriod = async (periodId: string) => {
    try {
      await lockPostingPeriod(periodId);
      
      // Trigger the standard Period Close Process Pipeline to show visual transparency panel (Fitts's Law + User feedback)
      const procStore = useProcessStore.getState();
      await procStore.startProcess('PERIOD_CLOSE_APPROVAL');
      procStore.setRightPanelOpen(true);
    } catch (e) {
      console.error('Failed to trigger period lock pipeline', e);
    }
  };

  const activePeriods = selectedYearId ? postingPeriods[selectedYearId] || [] : [];

  if (isLoading && fiscalYears.length === 0) {
    return (
      <div className={styles.sectionCard}>
        <Skeleton width="180px" height="24px" />
        <Skeleton height="120px" />
        <Skeleton height="180px" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      {/* Fiscal Calendars Card */}
      <div className={styles.sectionCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-xs)' }}>
          <div>
            <h3 className={styles.sectionTitle} style={{ borderBottom: 'none', margin: 0 }}>Fiscal Calendars</h3>
            <p className={styles.label} style={{ fontWeight: 'normal', marginTop: '2px' }}>
              Define company fiscal boundaries and operational accounting years.
            </p>
          </div>
          <Button size="sm" onClick={handleAddNewYear}>
            ✚ Add Fiscal Year
          </Button>
        </div>

        {fiscalYears.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>No Fiscal Calendars Registered</div>
            <div className={styles.emptyStateText}>
              Register a new corporate fiscal cycle to structure sub-ledger periods and monthly journals.
            </div>
            <Button size="sm" onClick={handleAddNewYear}>
              Setup First Fiscal Calendar
            </Button>
          </div>
        ) : (
          <table className={styles.compactTable}>
            <thead>
              <tr>
                <th>Calendar Year</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fiscalYears.map((fy) => (
                <tr
                  key={fy.id}
                  onClick={() => handleYearClick(fy.id)}
                  style={selectedYearId === fy.id ? { background: 'var(--ui-primary-light)' } : {}}
                >
                  <td style={{ fontWeight: 'var(--ui-weight-semibold)', color: 'var(--ui-primary)' }}>
                    {fy.name}
                  </td>
                  <td>{fy.start_date}</td>
                  <td>{fy.end_date}</td>
                  <td>
                    <span className={`${styles.statusChip} ${fy.status === 'ACTIVE' ? styles.statusActive : styles.statusLocked}`}>
                      {fy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Posting Periods Card */}
      {selectedYearId && (
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>
            Accounting Posting Periods for {fiscalYears.find((y) => y.id === selectedYearId)?.name || 'Selected Year'}
          </h3>
          {activePeriods.length === 0 ? (
            <div style={{ padding: 'var(--ui-spacing-lg)', textAlign: 'center', color: 'var(--ui-gray-500)' }}>
              No posting periods generated for this fiscal year.
            </div>
          ) : (
            <table className={styles.compactTable}>
              <thead>
                <tr>
                  <th>Period Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Locked Date</th>
                  <th>Closed By</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activePeriods.map((p) => (
                  <tr key={p.id} style={{ cursor: 'default' }}>
                    <td style={{ fontWeight: 'var(--ui-weight-medium)' }}>{p.name}</td>
                    <td>{p.start_date}</td>
                    <td>{p.end_date}</td>
                    <td>{p.locked_at ? new Date(p.locked_at).toLocaleDateString() : '—'}</td>
                    <td>{p.locked_by || '—'}</td>
                    <td>
                      <span className={`${styles.statusChip} ${
                        p.status === 'OPEN' ? styles.statusOpen :
                        p.status === 'LOCKED' ? styles.statusInactive :
                        styles.statusClosing
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {p.status === 'OPEN' && (
                        <Button size="sm" variant="outline" onClick={() => handleLockPeriod(p.id)}>
                          Lock Period
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
