import React, { useEffect, useState } from 'react';
import { useCustomerStore, Customer } from './store';
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
import {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Button,
  Input,
  Badge,
  Avatar
} from '@bes/shared-ui';
import styles from './customer-master.module.css';
import { CustomerDrawer } from './CustomerDrawer';

export const CustomerListTab: React.FC = () => {
  const {
    customers,
    totalCustomers,
    activeCustomers,
    creditHoldsCount,
    isLoading,
    fetchCustomers,
    selectCustomer
  } = useCustomerStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRowDoubleClick = (customer: Customer) => {
    selectCustomer(customer);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleRegisterClick = () => {
    selectCustomer(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    selectCustomer(null);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.primary_email && c.primary_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.tax_id && c.tax_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Customers</span>
          <span className={styles.metricVal}>{totalCustomers}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Active Accounts</span>
          <span className={styles.metricVal}>{activeCustomers}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Credit Holds</span>
          <span className={styles.metricVal} style={{ color: 'var(--ui-error)' }}>
            {creditHoldsCount}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.searchBar}>
        <Input
          placeholder="Search by Name, Email, or Tax ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <Button variant="primary" onClick={handleRegisterClick}>
          + Register Customer
        </Button>
      </div>

      {/* Directory Grid */}
      <Table>
        <THead>
          <TR>
            <TH style={{ width: '48px' }}></TH>
            <TH>Customer Name</TH>
            <TH>Tax ID</TH>
            <TH>Primary Email</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {isLoading ? (
            <TR>
              <TD colSpan={5} style={{ textAlign: 'center', padding: 'var(--ui-spacing-lg)' }}>
                Loading customer registry...
              </TD>
            </TR>
          ) : filteredCustomers.length === 0 ? (
            <TR>
              <TD colSpan={5}>
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateTitle}>No Customers Found</div>
                  <div className={styles.emptyStateText}>
                    Get started by registering your first customer account to begin transactions.
                  </div>
                  <Button variant="primary" onClick={handleRegisterClick} style={{ marginTop: 'var(--ui-spacing-sm)' }}>
                    + Register Customer
                  </Button>
                </div>
              </TD>
            </TR>
          ) : (
            filteredCustomers.map((customer) => (
              <TR 
                key={customer.id} 
                onClick={() => handleRowDoubleClick(customer)}
                style={{ cursor: 'pointer' }}
              >
                <TD>
                  <div className={styles.avatarCircle}>
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                </TD>
                <TD style={{ fontWeight: 'var(--ui-weight-semibold)' }}>{customer.name}</TD>
                <TD>{customer.tax_id || '—'}</TD>
                <TD>{customer.primary_email || '—'}</TD>
                <TD>
                  <span className={`${styles.statusChip} ${
                    customer.status === 'ACTIVE' 
                      ? styles.statusActive 
                      : customer.status === 'CREDIT_HOLD' 
                      ? styles.statusHold 
                      : styles.statusInactive
                  }`}>
                    {customer.status.replace('_', ' ')}
                  </span>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>

      {/* Details/Edit/Create SlideDrawer */}
      <CustomerDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        mode={drawerMode}
      />
    </div>
  );
};
