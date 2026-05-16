// libs/finance/src/lib/finance-home.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';
import { Button, Skeleton } from '@bes/shared-ui';

export const FinanceHomePage: React.FC = () => {
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
          }}>Finance</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Manage your financial records and transactions.</p>
        </div>
        <Button variant="primary" size="sm">
          New Record
        </Button>
      </header>

      <div style={{ 
        background: 'var(--ui-white)', 
        borderRadius: 'var(--ui-radius-lg)', 
        border: '1px solid var(--ui-gray-200)', 
        padding: 'var(--ui-spacing-xl)',
        minHeight: '400px'
      }}>
        {loading ? (
          <Skeleton height="300px" />
        ) : (
          <div>
            <p>Welcome to the Finance module.</p>
          </div>
        )}
      </div>
    </div>
  );
};
