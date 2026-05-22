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
    </div>
  );
};
