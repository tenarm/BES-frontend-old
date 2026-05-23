import React, { useEffect, useState } from 'react';
import { useUserStore } from '../state/user-store';
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
  ErrorBoundary
} from '@bes/shared-ui';

// Tabs
import { UsersTab } from './tabs/UsersTab';
import { RolesTab } from './tabs/RolesTab';
import { SessionsTab } from './tabs/SessionsTab';
import { HistoryTab } from './tabs/HistoryTab';

// Drawers
import { UserInviteDrawer } from './drawers/UserInviteDrawer';
import { UserEditDrawer } from './drawers/UserEditDrawer';
import { RoleEditDrawer } from './drawers/RoleEditDrawer';

import styles from './user-management.module.css';

export const UserManagementPage: React.FC = () => {
  const {
    activeTabIndex,
    setActiveTab,
    licensedFeatures,
    loadLicensedFeatures
  } = useUserStore();

  const activeModules = useAuthStore((s) => s.activeModules) || [];
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    loadLicensedFeatures();
  }, [loadLicensedFeatures, activeModules]);

  // Real-time clock update (Fitts's Law + User feedback)
  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTier = () => {
    if (activeModules.includes('settings_premium')) return 'Premium';
    if (activeModules.includes('settings_pro')) return 'Pro';
    return 'Basic';
  };

  const currentTier = getTier();

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>User Management & RBAC</h2>
            <Badge variant={currentTier === 'Premium' ? 'success' : currentTier === 'Pro' ? 'info' : 'secondary'}>
              {currentTier} Edition
            </Badge>
          </div>
          <div className={styles.headerRight} style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-400)', display: 'flex', gap: '6px' }}>
            <span>System Time:</span>
            <strong style={{ color: 'var(--ui-gray-600)' }}>{timeStr}</strong>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <TabGroup selectedIndex={activeTabIndex} onChange={setActiveTab}>
          <TabList>
            <Tab>Users Directory</Tab>
            <Tab>
              Roles & Custom RBAC
              {!licensedFeatures.custom_rbac && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>
              Active Sessions
              {!licensedFeatures.session_revocation && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>Access Logs / History</Tab>
          </TabList>

          <TabPanels style={{ marginTop: 'var(--ui-spacing-md)' }}>
            {/* Tab 1: Users Directory */}
            <TabPanel>
              <UsersTab />
            </TabPanel>

            {/* Tab 2: Roles & Custom RBAC */}
            <TabPanel>
              <RolesTab />
            </TabPanel>

            {/* Tab 3: Active Sessions */}
            <TabPanel>
              <SessionsTab />
            </TabPanel>

            {/* Tab 4: Access Logs / History */}
            <TabPanel>
              <HistoryTab />
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Persistent Forms Drawers */}
        <UserInviteDrawer />
        <UserEditDrawer />
        <RoleEditDrawer />
      </div>
    </ErrorBoundary>
  );
};

export default UserManagementPage;
