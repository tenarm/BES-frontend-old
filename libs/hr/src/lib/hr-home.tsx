import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Button, Skeleton } from '@bes/shared-ui';

export const HrHomePage: React.FC = () => {
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
          }}>Human Resources & Payroll</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Manage employee data, attendance, leave, and payroll processing.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--ui-spacing-md)' }}>
          <Button variant="secondary" size="sm">
            Process Payroll
          </Button>
          <Button variant="primary" size="sm">
            Add Employee
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
            <p>Welcome to the HR module.</p>
            <div style={{ 
              marginTop: 'var(--ui-spacing-lg)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 'var(--ui-spacing-lg)'
            }}>
              {[
                { label: 'Active Employees', value: '42' },
                { label: 'On Leave Today', value: '3' },
                { label: 'Upcoming Birthdays', value: '2' },
                { label: 'Pending Approvals', value: '5' }
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: 'var(--ui-spacing-lg)',
                  border: '1px solid var(--ui-gray-100)',
                  borderRadius: 'var(--ui-radius-md)',
                  background: 'var(--ui-gray-50)',
                  boxShadow: 'var(--ui-shadow-sm)'
                }}>
                  <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                  <div style={{ fontSize: 'var(--ui-text-2xl)', fontWeight: '700', color: 'var(--ui-gray-900)' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
