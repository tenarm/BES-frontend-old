import React from 'react';
import { Menu, Search, Settings, Hexagon } from 'lucide-react';
import { Button, Input, Avatar } from '@erp/shared-ui';
import { Header } from './layout/header';

interface AppHeaderProps {
  toggleSidebar: () => void;
  currentUser: any;
  logout: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar, currentUser, logout }) => {
  return (
    <Header
      left={
        <>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu size={24} />
          </Button>
          <div className="logo">
            <Hexagon className="logo-icon" size={24} color="var(--ui-primary)" fill="var(--ui-primary)" fillOpacity={0.2} />
            <span className="logo-text">ERP Factory</span>
          </div>
        </>
      }
      center={
        <Input
          placeholder="Search ERP modules..."
          icon={<Search size={18} />}
          className="search-input"
        />
      }
      right={
        <>
          <div style={{ textAlign: 'right', marginRight: 12 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ui-gray-900)' }}>{currentUser?.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ui-gray-500)' }}>@{currentUser?.username}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} title="Sign Out">
            <Settings size={20} />
          </Button>
          <Avatar initials={currentUser?.username?.charAt(0).toUpperCase() || "U"} color="var(--ui-primary)" />
        </>
      }
    />
  );
};
