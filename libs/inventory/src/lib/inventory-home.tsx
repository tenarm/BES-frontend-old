import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Button, Skeleton } from '@bes/shared-ui';

export const InventoryHomePage: React.FC = () => {
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
          }}>Inventory & Warehouse</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Manage stock levels, warehouse locations, and goods movements.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--ui-spacing-md)' }}>
          <Button variant="secondary" size="sm">
            Receive Goods
          </Button>
          <Button variant="primary" size="sm">
            New Item
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
            <p>Welcome to the Inventory module.</p>
            <div style={{ 
              marginTop: 'var(--ui-spacing-lg)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--ui-spacing-lg)'
            }}>
              {/* Quick stats placeholders */}
              {[
                { label: 'Low Stock Items', value: '12' },
                { label: 'Pending Receipts', value: '5' },
                { label: 'Total Value', value: '$124,500' }
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: 'var(--ui-spacing-md)',
                  border: '1px solid var(--ui-gray-100)',
                  borderRadius: 'var(--ui-radius-md)',
                  background: 'var(--ui-gray-50)'
                }}>
                  <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', marginBottom: '4px' }}>{stat.label}</div>
                  <div style={{ fontSize: 'var(--ui-text-lg)', fontWeight: '600' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
