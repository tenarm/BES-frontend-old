import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button, Skeleton } from '@bes/shared-ui';

export const SettingsHomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--ui-spacing-lg)' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: 'var(--ui-text-xl)', 
            fontWeight: '700', 
            color: 'var(--ui-gray-900)', 
            margin: 0 
          }}>Settings & Administration</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Configure system-wide parameters, user roles, and company details.</p>
        </div>
        <Button variant="primary" size="sm">
          Save Changes
        </Button>
      </header>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: 'var(--ui-spacing-lg)'
      }}>
        <aside style={{ 
          background: 'var(--ui-white)', 
          borderRadius: 'var(--ui-radius-lg)', 
          border: '1px solid var(--ui-gray-200)', 
          padding: 'var(--ui-spacing-md)',
          height: 'fit-content'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              'General Settings',
              'Company Profile',
              'User Management',
              'Roles & Permissions',
              'Security & Logs',
              'Integrations',
              'Notifications'
            ].map((item, i) => (
              <div key={i} style={{
                padding: 'var(--ui-spacing-sm) var(--ui-spacing-md)',
                borderRadius: 'var(--ui-radius-md)',
                fontSize: 'var(--ui-text-sm)',
                fontWeight: i === 0 ? '600' : '500',
                background: i === 0 ? 'var(--ui-gray-100)' : 'transparent',
                color: i === 0 ? 'var(--ui-blue-600)' : 'var(--ui-gray-600)',
                cursor: 'pointer'
              }}>
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <main style={{ 
          background: 'var(--ui-white)', 
          borderRadius: 'var(--ui-radius-lg)', 
          border: '1px solid var(--ui-gray-200)', 
          padding: 'var(--ui-spacing-xl)',
          minHeight: '500px'
        }}>
          {loading ? (
            <Skeleton height="400px" />
          ) : (
            <div>
              <h3 style={{ fontSize: 'var(--ui-text-lg)', fontWeight: '600', marginBottom: 'var(--ui-spacing-lg)' }}>General Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
                {[
                  { label: 'System Name', value: 'BES Enterprise v1.0' },
                  { label: 'Default Currency', value: 'USD ($)' },
                  { label: 'Timezone', value: 'UTC (GMT+0)' },
                  { label: 'Date Format', value: 'YYYY-MM-DD' }
                ].map((field, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                    <label style={{ fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-600)' }}>{field.label}</label>
                    <div style={{ 
                      padding: 'var(--ui-spacing-sm) var(--ui-spacing-md)',
                      border: '1px solid var(--ui-gray-200)',
                      borderRadius: 'var(--ui-radius-md)',
                      fontSize: 'var(--ui-text-sm)',
                      background: 'var(--ui-gray-50)'
                    }}>{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
