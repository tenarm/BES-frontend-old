import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Move, Send, Bot, Zap } from 'lucide-react';

interface AIFloatingWindowProps {
  onClose: () => void;
}

export const AIFloatingWindow: React.FC<AIFloatingWindowProps> = ({ onClose }) => {
  // Store window position in state. Initial position: bottom right area.
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 620 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Keep window within bounds when resizing window
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 560;
        return {
          x: Math.max(20, Math.min(prev.x, maxX)),
          y: Math.max(20, Math.min(prev.y, maxY)),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only allow dragging from the header or the move icon
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    
    // Capture pointer to handle movement outside the element bounds
    const el = windowRef.current;
    if (el) {
      el.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    // Clamp inside viewport
    const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 380);
    const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 500);
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    const el = windowRef.current;
    if (el) {
      el.releasePointerCapture(e.pointerId);
    }
  };

  // Mock chat actions
  const suggestions = [
    "Summarize current view",
    "Generate report draft",
    "Optimize workflow steps"
  ];

  return (
    <div
      ref={windowRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '380px',
        height: '500px',
        zIndex: 9985, // Positioned beneath dynamic approval modals (9999) and process pipeline (9990), above drawers (9980)
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        borderRadius: '16px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(99, 102, 241, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif",
        overflow: 'hidden',
        pointerEvents: 'auto', // Allow interaction with the window
        userSelect: 'none',
        touchAction: 'none', // Prevents default scrolling while dragging
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease-in-out'
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .drag-handle {
          cursor: move;
        }
        .action-chip:hover {
          background: rgba(99, 102, 241, 0.08) !important;
          border-color: rgba(99, 102, 241, 0.3) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Premium Header/Drag Handle */}
      <div
        className="drag-handle"
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '10px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
          }}>
            <Bot size={18} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>BES AI Copilot</span>
              <span style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                color: '#4f46e5',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '8px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>PRO</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ready to assist</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div 
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'move',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Drag to position"
          >
            <Move size={15} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '6px',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
              e.currentTarget.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Conversation Body */}
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflowY: 'auto',
        background: 'rgba(255, 255, 255, 0.3)'
      }}>
        {/* Assistant Welcome Message Bubble */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            flexShrink: 0
          }}>
            <Bot size={15} color="#6366f1" />
          </div>
          <div style={{
            background: 'white',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '12px',
            borderTopLeftRadius: '2px',
            padding: '12px 14px',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: '#334155',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            maxWidth: '85%'
          }}>
            Welcome to the AI Copilot placeholder! I will soon be connected to the BES workflow intelligence engine.
            <div style={{ marginTop: '8px', color: '#64748b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={12} color="#8b5cf6" />
              <span>Features will be unlocked in later phases.</span>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginLeft: '4px' }}>Suggested tasks:</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map((text, idx) => (
              <button
                key={idx}
                className="action-chip"
                style={{
                  textAlign: 'left',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Sparkles size={12} color="#6366f1" />
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Footer Area */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(226, 232, 240, 0.6)',
        background: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '4px 6px 4px 12px',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
        }}>
          <input
            type="text"
            disabled
            placeholder="Ask AI anything... (disabled)"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#94a3b8',
              background: 'transparent',
              padding: '6px 0'
            }}
          />
          <button
            disabled
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'not-allowed'
            }}
          >
            <Send size={14} />
          </button>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.65rem',
          color: '#94a3b8',
          padding: '0 4px'
        }}>
          <span>Press Enter to send</span>
          <span>Powered by BES AI Core</span>
        </div>
      </div>
    </div>
  );
};
