import React, { useState } from 'react';
import { Layers, Component, Type, LayoutTemplate, ShieldAlert, BadgeInfo, PanelLeftClose, SquarePlay, ListTree, Table2 } from 'lucide-react';
import { ShellLayout, Sidebar } from '@erp/shared-ui';

// Showcases
import { ButtonShowcase } from './components/ButtonShowcase';
import { InputShowcase } from './components/InputShowcase';
import { AlertShowcase } from './components/AlertShowcase';
import { BadgeShowcase } from './components/BadgeShowcase';
import { CardShowcase } from './components/CardShowcase';
import { AvatarShowcase } from './components/AvatarShowcase';
import { DrawerShowcase } from './components/DrawerShowcase';
import { TypographyShowcase } from './components/TypographyShowcase';
import { ProcessShowcase } from './components/ProcessShowcase';
import { TableShowcase } from './components/TableShowcase';

export function App() {
  const [activeItem, setActiveItem] = useState('Typography');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ Components: true, Layout: true });

  const items = [
    {
      name: 'Components',
      icon: <Layers size={20} />,
      subItems: ['Typography', 'Button', 'Input', 'Alert', 'Badge', 'Card', 'Avatar', 'Drawer', 'Table', 'Process']
    }
  ];

  const handleItemClick = (name: string) => {
    if (name === 'Components' || name === 'Layout') {
      setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
    } else {
      setActiveItem(name);
    }
  };

  const renderActiveComponent = () => {
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
      case 'Process': return <ProcessShowcase />;
      default: return <div>Select a component</div>;
    }
  };

  return (
    <ShellLayout
      header={
        <header style={{ 
          height: '60px', 
          backgroundColor: '#fff', 
          borderBottom: '1px solid var(--ui-gray-200)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ui-gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Component size={24} color="var(--ui-primary)" />
            UI Component Showcase
          </h1>
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
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
        {renderActiveComponent()}
      </div>
    </ShellLayout>
  );
}

export default App;
