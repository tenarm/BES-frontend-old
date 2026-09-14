import React from 'react';
import { ComponentRegistry } from '@bes/shared-ui';

export function Dashboard() {
  const registeredWidgets = ComponentRegistry.getAll();
  const widgetNames = Object.keys(registeredWidgets).filter(name => name.startsWith('Widget_'));

  return (
    <div style={{ fontFamily: 'var(--wp-font-body)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--wp-primary) 0%, var(--wp-primary-active) 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        boxShadow: '0 10px 25px -5px rgba(28, 25, 23, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(224, 122, 95, 0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wp-accent)', letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>
          Business Execution System Dashboard
        </span>
        <h1 style={{ margin: '8px 0 12px 0', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'var(--wp-font-display)' }}>
          Welcome Back
        </h1>
        <p style={{ margin: 0, color: 'var(--wp-stone-300)', fontSize: '14px', maxWidth: '600px', lineHeight: 1.5 }}>
          Your flow-centric workspace. Start a workflow, review pending tasks, or browse your data hub.
        </p>
      </div>

      {/* My Tasks placeholder */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--wp-stone-900)', fontFamily: 'var(--wp-font-display)', margin: '0 0 12px 0' }}>
          My Tasks
        </h2>
        <div style={{
          border: '2px dashed var(--wp-stone-200)',
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--wp-stone-500)',
          background: 'var(--wp-surface-base)'
        }}>
          <span style={{ fontSize: '24px' }}>📋</span>
          <h3 style={{ margin: '12px 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--wp-stone-700)' }}>No Pending Tasks</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--wp-stone-400)' }}>Tasks from active flows will appear here when they need your attention.</p>
        </div>
      </div>

      {/* Widgets */}
      {widgetNames.length > 0 && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--wp-stone-900)', fontFamily: 'var(--wp-font-display)', margin: '0 0 12px 0' }}>
            Metrics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {widgetNames.map((widgetName) => {
              const WidgetComponent = registeredWidgets[widgetName];
              return (
                <div key={widgetName} style={{
                  background: 'var(--wp-surface-card)',
                  border: '1px solid var(--wp-stone-200)',
                  borderRadius: '12px',
                  boxShadow: 'var(--wp-shadow-sm)',
                  padding: '20px'
                }}>
                  <WidgetComponent />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
