import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { Button, Skeleton } from '@bes/shared-ui';

export const SupplyChainHomePage: React.FC = () => {
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
          }}>Supply Chain Management</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Manage suppliers, purchase requisitions, and end-to-end procurement.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--ui-spacing-md)' }}>
          <Button variant="secondary" size="sm">
            New Requisition
          </Button>
          <Button variant="primary" size="sm">
            Add Supplier
          </Button>
        </div>
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
            <p>Welcome to the Supply Chain module.</p>
            <div style={{ 
              marginTop: 'var(--ui-spacing-lg)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--ui-spacing-lg)'
            }}>
              {[
                { label: 'Pending POs', value: '8', color: 'var(--ui-blue-500)' },
                { label: 'Active Suppliers', value: '24', color: 'var(--ui-green-500)' },
                { label: 'Requisitions to Review', value: '3', color: 'var(--ui-orange-500)' },
                { label: 'On-Time Delivery Rate', value: '94%', color: 'var(--ui-purple-500)' }
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: 'var(--ui-spacing-lg)',
                  border: '1px solid var(--ui-gray-100)',
                  borderRadius: 'var(--ui-radius-lg)',
                  background: 'var(--ui-white)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: 'var(--ui-text-3xl)', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
