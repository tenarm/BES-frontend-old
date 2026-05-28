import React from 'react';
import { useAuthStore } from '../store/auth-store';
import { SIDEBAR_ICONS } from './app-config';
import { FLOW_NAMES, FLOW_TIERS, DATA_HUB_NAMES, SYSTEM_NAMES, capitalize, setLicenseChecker } from '@tenarm/shared-ui';
import { Package } from 'lucide-react';

export function useShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Home');
  const [expandedModules, setExpandedModules] = React.useState<Record<string, boolean>>({});

  const { currentUser, isAuthenticated, isLoading, initialize, logout, activeModules, clientPlan } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Wire up the shared-ui license checker
  React.useEffect(() => {
    setLicenseChecker((moduleName: string) => {
      const active = useAuthStore.getState().activeModules;
      return active.includes(moduleName) || moduleName === 'settings' || moduleName === 'home';
    });
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Build the flow-centric sidebar structure
  const modules = React.useMemo(() => {
    if (!isAuthenticated || !currentUser) return [];

    const items: Array<{
      name: string;
      icon: React.ReactNode;
      subItems: string[];
      isLocked: boolean;
      section?: string;
    }> = [
      {
        name: 'Home',
        icon: SIDEBAR_ICONS['home'],
        subItems: [],
        isLocked: false,
      },
      {
        name: 'My Tasks',
        icon: SIDEBAR_ICONS['home'], // Will get a dedicated icon later
        subItems: [],
        isLocked: false,
      },
    ];

    // WORKFLOWS section
    const planTier = clientPlan.toLowerCase();
    const tierRank: Record<string, number> = { basic: 1, pro: 2, premium: 3 };
    const userTierRank = tierRank[planTier] || 3;

    Object.entries(FLOW_NAMES).forEach(([key, displayName]) => {
      const flowTier = FLOW_TIERS[key] || 'basic';
      const flowTierRank = tierRank[flowTier] || 1;
      const isLocked = flowTierRank > userTierRank;

      items.push({
        name: displayName,
        icon: SIDEBAR_ICONS[key] || React.createElement(Package, { size: 20 }),
        subItems: [],
        isLocked,
        section: 'WORKFLOWS',
      });
    });

    // DATA HUB section
    Object.entries(DATA_HUB_NAMES).forEach(([key, displayName]) => {
      items.push({
        name: displayName,
        icon: SIDEBAR_ICONS[key] || React.createElement(Package, { size: 20 }),
        subItems: [],
        isLocked: false,
        section: 'DATA HUB',
      });
    });

    // SYSTEM section
    items.push({
      name: 'Settings',
      icon: SIDEBAR_ICONS['settings'],
      subItems: [],
      isLocked: false,
      section: 'SYSTEM',
    });

    return items;
  }, [currentUser, isAuthenticated, clientPlan]);

  const toggleModule = (name: string) => {
    const targetModule = modules.find(m => m.name === name);

    if (targetModule?.isLocked) {
      setActiveItem(targetModule.name);
      return;
    }

    setActiveItem(name);

    const isTopLevel = modules.some(m => m.name === name && m.subItems && m.subItems.length > 0);

    if (isTopLevel) {
      if (isSidebarCollapsed) setIsSidebarCollapsed(false);
      setExpandedModules(prev => ({ ...prev, [name]: isSidebarCollapsed ? true : !prev[name] }));
    }
  };

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeItem,
    setActiveItem,
    expandedModules,
    modules,
    currentUser,
    isAuthenticated,
    isLoading,
    logout,
    toggleSidebar,
    toggleModule
  };
}
