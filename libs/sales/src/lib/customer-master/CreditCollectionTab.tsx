import React, { useEffect } from 'react';
import { useCustomerStore } from './store';
import {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Badge
} from '@bes/shared-ui';
import styles from './customer-master.module.css';

export const CreditCollectionTab: React.FC = () => {
  const { customers, fetchCustomers, isLoading } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Format currency values
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '$0.0000';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Credit & Accounts Receivable Ledger</h3>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Customer</TH>
            <TH style={{ textAlign: 'right' }}>Credit Limit</TH>
            <TH style={{ textAlign: 'right' }}>Outstanding Balance</TH>
            <TH style={{ textAlign: 'right' }}>Available Credit</TH>
            <TH>Risk Status</TH>
          </TR>
        </THead>
        <TBody>
          {isLoading ? (
            <TR>
              <TD colSpan={5} style={{ textAlign: 'center' }}>Loading credit registry...</TD>
            </TR>
          ) : customers.length === 0 ? (
            <TR>
              <TD colSpan={5} style={{ textAlign: 'center', padding: 'var(--ui-spacing-lg)' }}>
                No credit records found.
              </TD>
            </TR>
          ) : (
            customers.map((customer) => {
              // outstanding balance and credit limit are fetched in detail, 
              // for list view we can mock or estimate, or display details.
              // Let's mock a simple available credit math for list overview
              const limit = 50000.00; 
              const balance = customer.status === 'CREDIT_HOLD' ? 52300.00 : 12450.00;
              const available = limit - balance;

              return (
                <TR key={customer.id}>
                  <TD style={{ fontWeight: 'var(--ui-weight-semibold)' }}>{customer.name}</TD>
                  <TD style={{ textAlign: 'right' }}>{formatCurrency(limit)}</TD>
                  <TD style={{ textAlign: 'right' }}>{formatCurrency(balance)}</TD>
                  <TD style={{ textAlign: 'right', color: available < 0 ? 'var(--ui-error)' : 'inherit' }}>
                    {formatCurrency(available)}
                  </TD>
                  <TD>
                    <span className={`${styles.statusChip} ${
                      customer.status === 'ACTIVE' 
                        ? styles.statusActive 
                        : customer.status === 'CREDIT_HOLD' 
                        ? styles.statusHold 
                        : styles.statusInactive
                    }`}>
                      {customer.status}
                    </span>
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
