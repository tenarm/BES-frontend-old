import React from 'react';
import { useAuthStore } from '../store/auth-store';
import { MODULE_ICONS, MODULE_NAMES, capitalize } from './app-config';
import { Package } from 'lucide-react';

export function useShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Home');
  const [expandedModules, setExpandedModules] = React.useState<Record<string, boolean>>({});

  const { currentUser, isAuthenticated, isLoading, initialize, logout } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Dynamically generate modules from permissions
  const modules = React.useMemo(() => {
    if (!isAuthenticated || !currentUser) return [];

    const items = [
      {
        name: 'Home',
        icon: MODULE_ICONS['home'],
        subItems: []
      }
    ];

    Object.entries(currentUser.permissions).forEach(([modKey, resources]) => {
      const hasReadAccess = Object.values(resources).some(res => res.read);

      if (hasReadAccess) {
        items.push({
          name: MODULE_NAMES[modKey] || capitalize(modKey),
          icon: MODULE_ICONS[modKey] || React.createElement(Package, { size: 20 }),
          subItems: Object.entries(resources)
            .filter(([_, actions]) => actions.read)
            .map(([resKey]) => capitalize(resKey))
        });
      }
    });

    return items;
  }, [currentUser, isAuthenticated]);

  const toggleModule = (name: string) => {
    setActiveItem(name);
    const isTopLevel = modules.some(m => m.name === name && m.subItems.length > 0);

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
