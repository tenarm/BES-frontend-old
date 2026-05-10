import React from 'react';
import { Hexagon } from 'lucide-react';
import {
  ShellLayout,
  Sidebar,
  Button,
  ComponentRegistry
} from '@erp/shared-ui';

import { useAuthStore } from '../store/auth-store';
import { Dashboard } from './dashboard';
import { useShell } from './use-shell';
import { AppHeader } from './app-header';

export function App() {
  const {
    isSidebarCollapsed,
    activeItem,
    expandedModules,
    modules,
    currentUser,
    isAuthenticated,
    isLoading,
    logout,
    toggleSidebar,
    toggleModule
  } = useShell();

  const ActiveComponent = React.useMemo(() => {
    if (activeItem === 'Home') return <Dashboard />;

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

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <ShellLayout
      header={
        <AppHeader 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser} 
          logout={logout} 
        />
      }
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
        {ActiveComponent}
      </div>
    </ShellLayout>
  );
}

// --- Sub-components for Auth/Loading States ---

const LoadingView = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
    <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid var(--ui-gray-100)', borderTopColor: 'var(--ui-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: 'var(--ui-gray-500)', fontWeight: 500 }}>Initializing Session...</span>
  </div>
);

const LoginView = () => (
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

export default App;
