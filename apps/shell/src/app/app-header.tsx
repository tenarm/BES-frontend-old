import React from 'react';
import { Menu, Search, Settings, Hexagon } from 'lucide-react';
import { Button, Input, Avatar, Header, NotificationBell } from '@bes/shared-ui';

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
            <Hexagon className="logo-icon" size={24} color="var(--wp-primary)" fill="var(--wp-primary)" fillOpacity={0.2} />
            <span className="logo-text">Business Execution System</span>
          </div>
        </>
      }
      center={
        <Input
          placeholder="Search..."
          icon={<Search size={18} />}
          className="search-input"
        />
      }
      right={
        <>
          <NotificationBell />
          <div style={{ textAlign: 'right', marginRight: 12, marginLeft: 12 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--wp-stone-900)' }}>{currentUser?.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--wp-stone-500)' }}>@{currentUser?.username}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} title="Sign Out">
            <Settings size={20} />
          </Button>
          <Avatar initials={currentUser?.username?.charAt(0).toUpperCase() || "U"} color="var(--wp-primary)" />
        </>
      }
    />
  );
};
