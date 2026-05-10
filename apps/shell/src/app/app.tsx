import React from 'react';
import { useAuthStore } from '../store/auth-store';
import { Dashboard } from './dashboard';
import {
  Menu,
  Search,
  Settings,
  ShoppingCart,
  CircleDollarSign,
  Package,
  Users,
  Hexagon,
  Home
} from 'lucide-react';
import {
  ShellLayout,
  Header,
  Sidebar,
  Button,
  Input,
  Avatar,
  ComponentRegistry
} from '@erp/shared-ui';

// Map module keys to Icons
const MODULE_ICONS: Record<string, React.ReactNode> = {
  home: <Home size={20} />,
  sales: <ShoppingCart size={20} />,
  finance: <CircleDollarSign size={20} />,
  inventory: <Package size={20} />,
  hr: <Users size={20} />
};

// Map module keys to Display Names
const MODULE_NAMES: Record<string, string> = {
  sales: 'Sales & Distribution',
  hr: 'HR & Payroll'
};

const RESOURCE_NAMES: Record<string, string> = {
  coa: 'COA'
};

const capitalize = (s: string) => RESOURCE_NAMES[s] || (s.charAt(0).toUpperCase() + s.slice(1));

export function App() {
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

    // 1. Always start with Home
    const items = [
      {
        name: 'Home',
        icon: MODULE_ICONS['home'],
        subItems: []
      }
    ];

    // 2. Iterate through permissions to find modules and resources
    Object.entries(currentUser.permissions).forEach(([modKey, resources]) => {
      // Check if user has read access to at least one resource in this module
      const hasReadAccess = Object.values(resources).some(res => res.read);

      if (hasReadAccess) {
        items.push({
          name: MODULE_NAMES[modKey] || capitalize(modKey),
          icon: MODULE_ICONS[modKey] || <Package size={20} />,
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

    // Find if the clicked item is a top-level module to toggle expansion
    const isTopLevel = modules.some(m => m.name === name && m.subItems.length > 0);

    if (isTopLevel) {
      if (isSidebarCollapsed) setIsSidebarCollapsed(false);
      setExpandedModules(prev => ({ ...prev, [name]: isSidebarCollapsed ? true : !prev[name] }));
    }
  };

  const ActiveComponent = React.useMemo(() => {
    if (activeItem === 'Home') return <Dashboard />;

    // Simple mapping for now
    const registryKey = `Route_${activeItem}Main`;
    const Component = ComponentRegistry.get(registryKey);

    if (Component) return <Component />;

    return (
      <div style={{ padding: 10, textAlign: 'center', color: 'var(--ui-gray-400)' }}>
        <h3>Module "{activeItem}" is coming soon</h3>
        <p>This module has been authorized but not yet implemented.</p>
      </div>
    );
  }, [activeItem]);

  if (!isAuthenticated && !isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 20 }}>
        <Hexagon size={64} color="var(--ui-primary)" />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px 0' }}>ERP Factory</h2>
          <p style={{ color: 'var(--ui-gray-500)', margin: 0 }}>Please sign in to access your dashboard</p>
        </div>
        <Button onClick={() => useAuthStore.getState().login('admin', 'admin123')}>
          Login as Admin (admin/admin123)
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid var(--ui-gray-100)', borderTopColor: 'var(--ui-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'var(--ui-gray-500)', fontWeight: 500 }}>Initializing Session...</span>
      </div>
    );
  }

  const header = (
    <Header
      left={
        <>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu size={24} />
          </Button>
          <div className="logo">
            <Hexagon className="logo-icon" size={24} color="var(--ui-primary)" fill="var(--ui-primary)" fillOpacity={0.2} />
            <span className="logo-text">ERP Factory</span>
          </div>
        </>
      }
      center={
        <Input
          placeholder="Search ERP modules..."
          icon={<Search size={18} />}
          className="search-input"
        />
      }
      right={
        <>
          <div style={{ textAlign: 'right', marginRight: 12 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ui-gray-900)' }}>{currentUser?.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ui-gray-500)' }}>@{currentUser?.username}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} title="Sign Out">
            <Settings size={20} />
          </Button>
          <Avatar initials={currentUser?.username?.charAt(0).toUpperCase() || "U"} color="var(--ui-primary)" />
        </>
      }
    />
  );

  const title = activeItem === 'Home' ? 'System Overview' : `${activeItem} ${activeItem.includes('&') ? 'Home' : ''}`;

  return (
    <ShellLayout
      header={header}
      sidebar={
        <Sidebar
          items={modules}
          isCollapsed={isSidebarCollapsed}
          expandedItems={expandedModules}
          onItemClick={toggleModule}
          activeItem={activeItem}
        />
      }
    >
      <div className="main-content">
        <div className="content-header">
          <h2>{title}</h2>
        </div>
        {ActiveComponent}
      </div>
    </ShellLayout>
  );
}

export default App;
