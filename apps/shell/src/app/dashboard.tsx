import React from 'react';
import { ComponentRegistry, useProcessStore } from '@bes/shared-ui';

export function Dashboard() {
  const registeredWidgets = ComponentRegistry.getAll();
  const widgetNames = Object.keys(registeredWidgets).filter(name => name.startsWith('Widget_'));

  const { startProcess, setRightPanelOpen, failProcess } = useProcessStore();

  const handleStartGLSync = () => {
    startProcess('GL_ENTRY_CREATION');
  };



  const handleStartFailSafe = () => {
    startProcess('GL_ENTRY_CREATION');
    setTimeout(() => {
      failProcess(
        'Database Write Deadlock Encountered',
        'PostgreSQL Transaction aborted: Serialization deadlock detected during Chart of Accounts balance sync. Exception code: [ERR_COA_SYNC_DEADLOCK_4001]. No financial data was committed, all ledger changes rolled back safely.'
      );
    }, 1400);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Operations Control Center
        </span>
        <h1 style={{ margin: '8px 0 12px 0', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Business Execution & Orchestration
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', maxWidth: '600px', lineHeight: 1.5 }}>
          Welcome back to the BES core executive dashboard. Monitor cross-module process pipelines, manage real-time Server-Sent Events, and review transaction ledgers instantly.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Side: Core Module Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Active Module Widgets</span>
            <span style={{ fontSize: '11px', background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
              {widgetNames.length} Loaded
            </span>
          </h2>

          {widgetNames.length === 0 ? (
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#64748b',
              background: '#f8fafc'
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <h3 style={{ margin: '12px 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#334155' }}>No Widgets Registered</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Widgets from active modules will mount dynamically here once modules are initialized.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {widgetNames.map((widgetName) => {
                const WidgetComponent = registeredWidgets[widgetName];
                return (
                  <div key={widgetName} style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    padding: '20px'
                  }}>
                    <WidgetComponent />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Process transparency pipelines controller */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px -2px rgba(148, 163, 184, 0.12)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              Workflow Orchestrator
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              Simulate backend Server-Sent Event (SSE) execution chains and test real-time stepper visualizations.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

          {/* Trigger Card 1: GL Sync */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                ⚡ INSTANT SYNC
              </span>
              <span style={{ fontSize: '13px' }}>💨</span>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>General Ledger Sync</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                Simulate an immediate accounting transaction posting that auto-triggers down-stream Chart of Accounts adjustments.
              </p>
            </div>
            <button
              onClick={handleStartGLSync}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.15)',
              }}
            >
              Proceed: Synchronize GL Ledger →
            </button>
          </div>



          {/* Trigger Card 3: Fail-Safe Ledger Sync */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                ⚠️ TECHNICAL FAIL-SAFE
              </span>
              <span style={{ fontSize: '13px' }}>🚨</span>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Fail-Safe Ledger Sync</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                Start a ledger sync that intentionally encounters a transaction deadlock halfway, demonstrating fail-safe rollback log displays.
              </p>
            </div>
            <button
              onClick={handleStartFailSafe}
              style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(225, 29, 72, 0.15)',
              }}
            >
              Execute Fail-Safe Transaction ⚡
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
