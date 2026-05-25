import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  PremiumLockIndicator,
  UpgradeGateOverlay,
  ErrorBoundary
} from '@bes/shared-ui';

import { CustomerListTab } from './CustomerListTab';
import { CreditCollectionTab } from './CreditCollectionTab';
import { CustomerGroupingTab } from './CustomerGroupingTab';

import styles from './customer-master.module.css';

export const CustomerMaster: React.FC = () => {
  const activeModules = useAuthStore((s) => s.activeModules) || [];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [timeStr, setTimeStr] = useState('');

  // Clock utility
  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const hasCreditManagement = activeModules.includes('sales_pro') || activeModules.includes('sales_premium');
  const hasCustomerGrouping = activeModules.includes('sales_pro') || activeModules.includes('sales_premium');

  const getTier = () => {
    if (activeModules.includes('sales_premium')) return 'Premium';
    if (activeModules.includes('sales_pro')) return 'Pro';
    return 'Basic';
  };

  const currentTier = getTier();

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Customer Master Registry</h2>
            <Badge variant={currentTier === 'Premium' ? 'success' : currentTier === 'Pro' ? 'info' : 'secondary'}>
              {currentTier} Edition
            </Badge>
          </div>
          <div className={styles.headerRight}>
            <span>System Time:</span>
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <TabGroup selectedIndex={activeTabIndex} onChange={setActiveTabIndex}>
          <TabList>
            <Tab>Customer List</Tab>
            <Tab>
              Credit & Collections
              {!hasCreditManagement && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>
              Customer Groupings
              {!hasCustomerGrouping && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
          </TabList>

          <TabPanels style={{ marginTop: 'var(--ui-spacing-md)' }}>
            {/* Tab 1: Customer List */}
            <TabPanel>
              <CustomerListTab />
            </TabPanel>

            {/* Tab 2: Credit Registry */}
            <TabPanel>
              <div className={styles.tabLockedContainer}>
                {!hasCreditManagement && (
                  <UpgradeGateOverlay moduleName="Credit Limits & Holds Control" requiredTier="Pro" />
                )}
                <div style={!hasCreditManagement ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  <CreditCollectionTab />
                </div>
              </div>
            </TabPanel>

            {/* Tab 3: Groupings */}
            <TabPanel>
              <div className={styles.tabLockedContainer}>
                {!hasCustomerGrouping && (
                  <UpgradeGateOverlay moduleName="Advanced Customer Groupings" requiredTier="Pro" />
                )}
                <div style={!hasCustomerGrouping ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  <CustomerGroupingTab />
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerMaster;
