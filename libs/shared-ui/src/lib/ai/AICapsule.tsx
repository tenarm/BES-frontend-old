import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AIFloatingWindow } from './AIFloatingWindow';

export const AICapsule: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Capsule Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9998, // Placed just below the AIFloatingWindow (9999)
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '30px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.2), 0 8px 10px -6px rgba(99, 102, 241, 0.1)',
          cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#4f46e5',
          outline: 'none',
          userSelect: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: 'capsulePulse 3s infinite alternate'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
          e.currentTarget.style.boxShadow = '0 12px 30px -5px rgba(99, 102, 241, 0.35), 0 8px 12px -6px rgba(99, 102, 241, 0.15)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.2), 0 8px 10px -6px rgba(99, 102, 241, 0.1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.75)';
        }}
      >
        <style>{`
          @keyframes capsulePulse {
            0% {
              box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 8px 10px -6px rgba(99, 102, 241, 0.08);
            }
            100% {
              box-shadow: 0 10px 30px -3px rgba(139, 92, 246, 0.3), 0 8px 12px -5px rgba(99, 102, 241, 0.12);
              border-color: rgba(139, 92, 246, 0.4);
            }
          }
        `}</style>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '50%',
          padding: '4px',
          color: 'white',
          boxShadow: '0 2px 5px rgba(99, 102, 241, 0.3)'
        }}>
          <Sparkles size={12} />
        </div>
        <span>AI Copilot</span>
        {isOpen && (
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'inline-block',
            marginLeft: '2px'
          }} />
        )}
      </button>

      {/* Draggable AI Window */}
      {isOpen && (
        <AIFloatingWindow onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};
