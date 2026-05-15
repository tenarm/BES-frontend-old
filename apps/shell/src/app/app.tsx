import React from 'react';
import { Hexagon } from 'lucide-react';
import {
  Button,
  ComponentRegistry,
  ErrorBoundary,
  ShellLayout,
  Sidebar
} from '@bes/shared-ui';

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

    console.log("Active Component: ", ComponentRegistry, activeItem);

    const registryKey = `Route_${activeItem}`;
    console.log("Registry Key: ", registryKey);
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
        <ErrorBoundary>
          <React.Suspense fallback={<ModuleLoadingView />}>
            {ActiveComponent}
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </ShellLayout>
  );
}

// --- Full Screen Loading State ---
const LoadingView = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
    <div className="loading-spinner" style={{ width: 40, height: 40, border: '3px solid var(--ui-gray-100)', borderTopColor: 'var(--ui-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: 'var(--ui-gray-500)', fontWeight: 500 }}>Initializing Session...</span>
  </div>
);

// --- Module Loading State (Subtle) ---
const ModuleLoadingView = () => (
  <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ height: '32px', width: '200px', background: 'var(--ui-gray-100)', borderRadius: '6px', animation: 'pulse 1.5s infinite ease-in-out' }} />
    <div style={{ height: '200px', width: '100%', background: 'var(--ui-gray-50)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }} />
    <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
  </div>
);
// --- Login Form ---
const LoginView = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const login = useAuthStore((s) => s.login);
  const isDev = import.meta.env.DEV;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await login('admin', 'admin123');
    } catch (err) {
      setError('Dev login failed. Ensure backend is running with DEBUG=true.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: 'linear-gradient(135deg, #f8f9fd 0%, #e8ecf4 100%)'
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 8px 32px rgba(22, 40, 103, 0.08)',
        width: '100%', maxWidth: 400, textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <Hexagon size={48} color="var(--ui-primary)" fill="var(--ui-primary)" fillOpacity={0.15} />
          <h2 style={{ margin: '12px 0 4px', fontSize: '1.5rem', color: 'var(--ui-gray-900)' }}>
            BES Factory
          </h2>
          <p style={{ color: 'var(--ui-gray-500)', margin: 0, fontSize: '0.875rem' }}>
            Sign in to your workspace
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            id="login-username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            autoComplete="username"
            style={{
              padding: '12px 16px', borderRadius: 8, border: '1px solid var(--ui-gray-200)',
              fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
              width: '100%', boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--ui-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--ui-gray-200)'}
          />
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              padding: '12px 16px', borderRadius: 8, border: '1px solid var(--ui-gray-200)',
              fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
              width: '100%', boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--ui-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--ui-gray-200)'}
          />

          {error && (
            <div style={{
              background: '#fef2f2', color: '#dc2626', borderRadius: 8,
              padding: '10px 14px', fontSize: '0.8rem', textAlign: 'left'
            }}>
              {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 16px', borderRadius: 8, border: 'none',
              background: 'var(--ui-primary)', color: 'white',
              fontSize: '0.9rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1, transition: 'opacity 0.2s'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Dev-only quick login */}
        {isDev && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--ui-gray-100)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--ui-gray-400)', margin: '0 0 8px' }}>
              Development Only
            </p>
            <button
              id="dev-quick-login"
              onClick={handleDevLogin}
              disabled={isSubmitting}
              style={{
                padding: '8px 16px', borderRadius: 6,
                border: '1px dashed var(--ui-gray-300)',
                background: 'transparent', color: 'var(--ui-gray-500)',
                fontSize: '0.8rem', cursor: 'pointer'
              }}
            >
              Quick Login (admin/admin123)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
