import React from 'react';
import { useAuthStore } from '../store/auth-store';
import { MODULE_ICONS } from './app-config';
import { MODULE_NAMES, capitalize, setLicenseChecker, useProcessStore } from '@bes/shared-ui';
import { Package } from 'lucide-react';

const DISPLAY_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(MODULE_NAMES).map(([key, val]) => [val, key])
);

export function useShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Home');
  const [expandedModules, setExpandedModules] = React.useState<Record<string, boolean>>({});

  const { currentUser, isAuthenticated, isLoading, initialize, logout, activeModules } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Wire up the shared-ui license checker with Zustand activeModules state
  React.useEffect(() => {
    setLicenseChecker((moduleName: string) => {
      const active = useAuthStore.getState().activeModules;
      return active.includes(moduleName) || moduleName === 'settings' || moduleName === 'home';
    });
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Dynamically generate modules from permissions and licensing rules
  const modules = React.useMemo(() => {
    if (!isAuthenticated || !currentUser) return [];

    const items: Array<{
      name: string;
      icon: React.ReactNode;
      subItems: string[];
      isLocked: boolean;
    }> = [
      {
        name: 'Home',
        icon: MODULE_ICONS['home'],
        subItems: [],
        isLocked: false
      }
    ];

    // Standard list of modules in product catalog presentation order
    const allModulesList = [
      { key: 'sales', name: 'Sales' },
      { key: 'settings', name: 'Settings' }
    ];

    allModulesList.forEach(({ key, name }) => {
      const isLicensed = activeModules.includes(key) || key === 'settings';
      const userHasPermissions = currentUser.permissions[key] && Object.values(currentUser.permissions[key]).some(res => res.read);
      const isSuperUser = currentUser.is_superuser;

      // Render the module if user has rights, or if it is locked to prompt premium upsells (Rule 3)
      if (userHasPermissions || isSuperUser || !isLicensed) {
        const subItems = currentUser.permissions[key]
          ? Object.entries(currentUser.permissions[key])
              .filter(([_, actions]) => actions.read)
              .map(([resKey]) => capitalize(resKey))
          : [];

        items.push({
          name: MODULE_NAMES[key] || name,
          icon: MODULE_ICONS[key] || React.createElement(Package, { size: 20 }),
          subItems: isLicensed ? subItems : [], // Hide sub-items when locked
          isLocked: !isLicensed
        });
      }
    });

    return items;
  }, [currentUser, isAuthenticated, activeModules]);

  const toggleModule = (name: string) => {
    // Find if the clicked item is a top-level module or a sub-item
    let targetModule = modules.find(m => m.name === name);
    let parentModule = targetModule;
    
    if (!targetModule) {
      // It's a sub-item! Find its parent module
      parentModule = modules.find(m => m.subItems?.includes(name));
    }

    if (parentModule?.isLocked) {
      // Gated click intercepts navigation to trigger the Upgrade card
      setActiveItem(parentModule.name);
      return;
    }

    setActiveItem(name);

    // Load module-related process JSON files
    if (parentModule) {
      const moduleKey = DISPLAY_TO_KEY[parentModule.name];
      if (moduleKey) {
        useProcessStore.getState().loadModuleProcesses(moduleKey).catch((e) => {
          console.warn(`Failed to preload process definitions for module ${moduleKey}`, e);
        });
      }
    }

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

