import React, { useState } from 'react';
import {
  Layers,
  Component,
  Type,
  MousePointerClick,
  FormInput,
  Bell,
  Tag,
  LayoutDashboard,
  UserCircle,
  PanelRight,
  Cpu,
  Table2,
  Sparkles,
  Box,
  BookOpen,
  Lock,
  Folder,
} from 'lucide-react';
import { ShellLayout, Sidebar } from '@bes/shared-ui';

// Showcases
import { ButtonShowcase } from './components/ButtonShowcase';
import { InputShowcase } from './components/InputShowcase';
import { AlertShowcase } from './components/AlertShowcase';
import { BadgeShowcase } from './components/BadgeShowcase';
import { CardShowcase } from './components/CardShowcase';
import { AvatarShowcase } from './components/AvatarShowcase';
import { DrawerShowcase } from './components/DrawerShowcase';
import { TypographyShowcase } from './components/TypographyShowcase';
import { TableShowcase } from './components/TableShowcase';
import { SkeletonShowcase } from './components/SkeletonShowcase';
import { UpgradeGateShowcase } from './components/UpgradeGateShowcase';
import { TabsShowcase } from './components/TabsShowcase';

// ─── Nav Items ────────────────────────────────────────────────────────────────

const COMPONENT_ITEMS = [
  'Typography',
  'Button',
  'Input',
  'Alert',
  'Badge',
  'Card',
  'Avatar',
  'Drawer',
  'Table',
  'Skeleton',
  'Tabs',
];

const PATTERN_ITEMS = [
  'Upgrade Gate',
];

// ─── Home / Overview Page ─────────────────────────────────────────────────────

const HomeShowcase = ({ onNavigate }: { onNavigate: (item: string) => void }) => {
  const components = [
    { name: 'Typography', icon: <Type size={20} />, desc: 'Type scale, tokens, and text styles', color: '#6366f1' },
    { name: 'Button', icon: <MousePointerClick size={20} />, desc: 'Actions with variants, sizes, states', color: '#0ea5e9' },
    { name: 'Input', icon: <FormInput size={20} />, desc: 'Text fields, labels, errors', color: '#10b981' },
    { name: 'Alert', icon: <Bell size={20} />, desc: 'Info, success, warning, error messages', color: '#f59e0b' },
    { name: 'Badge', icon: <Tag size={20} />, desc: 'Status labels and counts', color: '#ef4444' },
    { name: 'Card', icon: <LayoutDashboard size={20} />, desc: 'Flexible content containers', color: '#8b5cf6' },
    { name: 'Avatar', icon: <UserCircle size={20} />, desc: 'User identity & avatar stacks', color: '#ec4899' },
    { name: 'Drawer', icon: <PanelRight size={20} />, desc: 'Slide-in panels for forms and details', color: '#14b8a6' },
    { name: 'Table', icon: <Table2 size={20} />, desc: 'Data tables with badges and selection', color: '#f97316' },
    { name: 'Skeleton', icon: <Box size={20} />, desc: 'Loading placeholder animations', color: '#64748b' },
    { name: 'Tabs', icon: <Folder size={20} />, desc: 'Compound tabs layout components', color: '#8b5cf6' },
    { name: 'Upgrade Gate', icon: <Lock size={20} />, desc: 'Subscription gating overlay', color: '#dc2626' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a5f 100%)',
        borderRadius: '16px',
        padding: '48px 40px',
        marginBottom: '40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '280px', height: '280px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px',
          padding: '5px 14px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          color: '#94a3b8',
          marginBottom: '20px',
        }}>
          <Sparkles size={12} />
          BES Design System · @bes/shared-ui
        </div>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15 }}>
          UI Component Showcase
        </h1>
        <p style={{ margin: '0 0 28px 0', color: '#94a3b8', fontSize: '1.05rem', maxWidth: '560px', lineHeight: 1.65 }}>
          An interactive reference for all <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 8px', borderRadius: '5px', color: '#e2e8f0' }}>@bes/shared-ui</code> components — live demos, prop tables, and copy-ready code snippets.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: '12 Components', icon: <Component size={14} /> },
            { label: 'Design Tokens', icon: <Type size={14} /> },
            { label: 'Live Demos', icon: <MousePointerClick size={14} /> },
            { label: 'Code Snippets', icon: <BookOpen size={14} /> },
          ].map(({ label, icon }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              color: '#cbd5e1',
            }}>
              {icon} {label}
            </div>
          ))}
        </div>
      </div>

      {/* Component Grid */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ui-gray-700)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={18} color="var(--ui-primary)" />
        All Components
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
        {components.map(({ name, icon, desc, color }) => (
          <button
            key={name}
            onClick={() => onNavigate(name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '20px',
              background: 'white',
              border: '1px solid var(--ui-gray-200)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = 'var(--ui-gray-200)';
            }}
          >
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '10px',
              background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '4px' }}>{name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ui-gray-400)', lineHeight: 1.4 }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export function App() {
  const [activeItem, setActiveItem] = useState('Home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Components: true,
    Patterns: true,
  });

  const items = [
    {
      name: 'Home',
      icon: <Component size={20} />,
      subItems: [],
      isLocked: false,
    },
    {
      name: 'Components',
      icon: <Layers size={20} />,
      subItems: COMPONENT_ITEMS,
      isLocked: false,
    },
    {
      name: 'Patterns',
      icon: <Cpu size={20} />,
      subItems: PATTERN_ITEMS,
      isLocked: false,
    },
  ];

  const handleItemClick = (name: string) => {
    if (name === 'Components' || name === 'Patterns') {
      setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
    } else {
      setActiveItem(name);
    }
  };

  const renderActiveComponent = () => {
    if (activeItem === 'Home') return <HomeShowcase onNavigate={setActiveItem} />;
    switch (activeItem) {
      case 'Typography': return <TypographyShowcase />;
      case 'Button': return <ButtonShowcase />;
      case 'Input': return <InputShowcase />;
      case 'Alert': return <AlertShowcase />;
      case 'Badge': return <BadgeShowcase />;
      case 'Card': return <CardShowcase />;
      case 'Avatar': return <AvatarShowcase />;
      case 'Drawer': return <DrawerShowcase />;
      case 'Table': return <TableShowcase />;
      case 'Skeleton': return <SkeletonShowcase />;
      case 'Tabs': return <TabsShowcase />;
      case 'Upgrade Gate': return <UpgradeGateShowcase />;
      default: return (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--ui-gray-400)' }}>
          <Component size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--ui-gray-600)' }}>Coming Soon</h3>
          <p style={{ margin: 0 }}>This showcase is not yet available.</p>
        </div>
      );
    }
  };

  return (
    <ShellLayout
      header={
        <header style={{
          height: '60px',
          backgroundColor: 'white',
          borderBottom: '1px solid var(--ui-gray-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Component size={16} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ui-gray-900)', margin: 0, lineHeight: 1 }}>
                UI Showcase
              </h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--ui-gray-400)', margin: 0 }}>@bes/shared-ui</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              padding: '4px 12px',
              borderRadius: '20px',
            }}>
              BES Design System
            </div>
          </div>
        </header>
      }
      sidebar={
        <Sidebar
          items={items}
          isCollapsed={isSidebarCollapsed}
          expandedItems={expandedItems}
          onItemClick={handleItemClick}
          activeItem={activeItem}
        />
      }
    >
      <div style={{ padding: '32px', maxWidth: '1040px', margin: '0 auto', minHeight: '100%' }}>
        {renderActiveComponent()}
      </div>
    </ShellLayout>
  );
}

export default App;
