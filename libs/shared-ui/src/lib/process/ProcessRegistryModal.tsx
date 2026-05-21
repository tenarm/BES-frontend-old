import React from 'react';
import { useProcessStore } from './process-store';
import { ComponentRegistry } from '../registry';

export function ProcessRegistryModal() {
  const {
    activeModalComponent,
    activeModalStepId,
    closeApprovalModal,
    addEvent,
  } = useProcessStore();

  if (!activeModalComponent) return null;

  // Resolve the component dynamically from the central phonebook
  const RegisteredComponent = ComponentRegistry.get(activeModalComponent);

  const handleComplete = (data?: Record<string, unknown>) => {
    closeApprovalModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Layer 1: Highest priority overlay
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '520px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'Inter, system-ui, sans-serif',
          animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            Cross-Module Pipeline Action Gate
          </h3>
          <button
            onClick={closeApprovalModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Dynamic Registered Component Shell */}
        <div style={{ minHeight: '120px' }}>
          <React.Suspense
            fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Loading operational view...</span>
              </div>
            }
          >
            {RegisteredComponent ? (
              <RegisteredComponent onComplete={handleComplete} onClose={closeApprovalModal} />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #e2e8f0', borderRadius: '8px' }}>
                <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
                  Registry Error: "{activeModalComponent}" not resolved.
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                  Ensure this component is static-registered or lazy-loaded inside the Shell registry on boot.
                </p>
              </div>
            )}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
