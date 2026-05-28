import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from './button/button';

interface UpgradeGateOverlayProps {
  moduleName: string;
  requiredTier?: 'Pro' | 'Premium';
  onClose?: () => void;
}

export const UpgradeGateOverlay: React.FC<UpgradeGateOverlayProps> = ({ 
  moduleName, 
  requiredTier = 'Pro', 
  onClose 
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(248, 250, 252, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      zIndex: 100,
      padding: '24px',
      animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--wp-stone-200)',
        boxShadow: '0 20px 40px rgba(22, 40, 103, 0.08)',
        padding: '40px',
        maxWidth: '460px',
        width: '100%',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Animated Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          color: 'var(--wp-primary)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          marginBottom: '20px'
        }}>
          <Sparkles size={14} /> Premium Feature
        </div>

        {/* Feature Lock Title */}
        <h3 style={{ 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          margin: '0 0 12px 0', 
          color: 'var(--wp-stone-900)' 
        }}>
          Unlock {moduleName}
        </h3>

        {/* Plan Value Description */}
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'var(--wp-stone-500)', 
          margin: '0 0 28px 0', 
          lineHeight: 1.6,
          padding: '0 10px'
        }}>
          This capability is included in the premium <strong>{requiredTier} Plan</strong>. Upgrading grants your team access to advanced automation, dynamic workflows, and comprehensive double-entry accounting ledgers.
        </p>

        {/* Plan Highlights Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          textAlign: 'left',
          background: 'var(--wp-stone-50)',
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '32px',
          border: '1px solid var(--wp-stone-100)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--wp-stone-700)' }}>
            <ShieldCheck size={16} color="var(--wp-primary)" />
            <span>Full multi-tenant ledger & system security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--wp-stone-700)' }}>
            <Zap size={16} color="var(--wp-primary)" />
            <span>Automated workflow triggers & sequences</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--wp-stone-700)' }}>
            <Sparkles size={16} color="var(--wp-primary)" />
            <span>Advanced business intelligence & reporting</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {onClose && (
            <button 
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid var(--wp-stone-200)',
                background: 'white',
                color: 'var(--wp-stone-600)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--wp-stone-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Dismiss
            </button>
          )}
          <button 
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--wp-primary)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Upgrade Plan <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
