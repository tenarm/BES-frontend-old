import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../state/company-store';
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

// Tabs
import { ProfileTab } from './tabs/ProfileTab';
import { SubsidiariesTab } from './tabs/SubsidiariesTab';
import { FiscalTab } from './tabs/FiscalTab';
import { TaxProfilesTab } from './tabs/TaxProfilesTab';
import { SharingTab } from './tabs/SharingTab';
import { AuditLogTab } from './tabs/AuditLogTab';

// Drawers
import { SubsidiaryDrawer } from './drawers/SubsidiaryDrawer';
import { FiscalYearDrawer } from './drawers/FiscalYearDrawer';
import { TaxProfileDrawer } from './drawers/TaxProfileDrawer';
import { IntercompanyDrawer } from './drawers/IntercompanyDrawer';

import styles from './company-setup.module.css';

export const CompanySetupPage: React.FC = () => {
  const {
    activeTabIndex,
    licensedFeatures,
    setActiveTab,
    loadLicensedFeatures
  } = useCompanyStore();

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

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Company Settings</h2>
            <Badge variant={currentTier === 'Premium' ? 'success' : currentTier === 'Pro' ? 'info' : 'secondary'}>
              {currentTier} Edition
            </Badge>
          </div>
          <div className={styles.headerRight}>
            <span>System Time:</span>
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Tab Selection */}
        <TabGroup selectedIndex={activeTabIndex} onChange={handleTabChange}>
          <TabList>
            <Tab>Profile & Localization</Tab>
            <Tab>
              Subsidiaries & Hierarchy
              {!licensedFeatures.subsidiary_registry && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>
              Fiscal Calendars
              {!licensedFeatures.fiscal_calendar && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>
              Tax Profiles
              {!licensedFeatures.tax_profile && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>
              Sharing & Intercompany
              {!licensedFeatures.sharing_intercompany && <PremiumLockIndicator style={{ marginLeft: '6px' }} />}
            </Tab>
            <Tab>Audit Trail</Tab>
          </TabList>

          <TabPanels style={{ marginTop: 'var(--ui-spacing-md)' }}>
            {/* Tab 1: Profile */}
            <TabPanel>
              <ProfileTab />
            </TabPanel>

            {/* Tab 2: Subsidiaries */}
            <TabPanel>
              <div className={styles.tabLockedContainer}>
                {!licensedFeatures.subsidiary_registry && (
                  <UpgradeGateOverlay moduleName="Multi-Subsidiary Registry" requiredTier="Pro" />
                )}
                <div style={!licensedFeatures.subsidiary_registry ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  <SubsidiariesTab />
                </div>
              </div>
            </TabPanel>

            {/* Tab 3: Fiscal Calendars */}
            <TabPanel>
              <div className={styles.tabLockedContainer}>
                {!licensedFeatures.fiscal_calendar && (
                  <UpgradeGateOverlay moduleName="Fiscal Calendars & Posting Periods" requiredTier="Pro" />
                )}
                <div style={!licensedFeatures.fiscal_calendar ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  <FiscalTab />
                </div>
              </div>
            </TabPanel>

            {/* Tab 4: Tax Profiles */}
            <TabPanel>
              <div className={styles.tabLockedContainer}>
                {!licensedFeatures.tax_profile && (
                  <UpgradeGateOverlay moduleName="Tax & Regulatory Profiles" requiredTier="Pro" />
                )}
                <div style={!licensedFeatures.tax_profile ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  <TaxProfilesTab />
                </div>
              </div>
            </TabPanel>

            {/* Tab 5: Sharing & Intercompany */}
            <TabPanel>
              <div className={styles.tabLockedContainer}>
                {!licensedFeatures.sharing_intercompany && (
                  <UpgradeGateOverlay moduleName="Cross-Subsidiary Data Sharing" requiredTier="Premium" />
                )}
                <div style={!licensedFeatures.sharing_intercompany ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  <SharingTab />
                </div>
              </div>
            </TabPanel>

            {/* Tab 6: Audit Trail */}
            <TabPanel>
              <AuditLogTab />
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Global Drawers */}
        <SubsidiaryDrawer />
        <FiscalYearDrawer />
        <TaxProfileDrawer />
        <IntercompanyDrawer />
      </div>
    </ErrorBoundary>
  );
};

export default CompanySetupPage;
