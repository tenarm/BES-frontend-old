import React from 'react';
import styles from './sidebar.module.css';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';

export interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  subItems?: string[];
  isLocked?: boolean;
  section?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  isCollapsed: boolean;
  expandedItems: Record<string, boolean>;
  onItemClick: (name: string) => void;
  activeItem?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  items, 
  isCollapsed, 
  expandedItems, 
  onItemClick,
  activeItem 
}) => {
  // Group items by section
  const sections = items.reduce((acc, item) => {
    const section = item.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  // Define order of sections
  const sectionOrder = ['default', 'WORKFLOWS', 'MODULES', 'DATA HUB', 'SYSTEM'];

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.items}>
        {sectionOrder.map((sectionKey, index) => {
          const sectionItems = sections[sectionKey];
          if (!sectionItems || sectionItems.length === 0) return null;

          return (
            <React.Fragment key={sectionKey}>
              {sectionKey !== 'default' && !isCollapsed && (
                <>
                  {index > 0 && <div className={styles.sectionDivider} />}
                  <div className={styles.sectionHeader}>{sectionKey}</div>
                </>
              )}
              {sectionKey !== 'default' && isCollapsed && index > 0 && (
                <div className={styles.sectionDivider} style={{ margin: '8px 12px' }} />
              )}
              
              {sectionItems.map((item) => {
                const isExpanded = expandedItems[item.name];
                const isActive = activeItem === item.name;
                const isLocked = item.isLocked;

                return (
                  <div key={item.name} className={`${styles.group} ${isLocked ? styles.lockedGroup : ''}`}>
                    <div 
                      className={`${styles.item} ${isActive && !isCollapsed ? styles.active : ''} ${isLocked ? styles.lockedItem : ''}`}
                      onClick={() => onItemClick(item.name)}
                      title={isCollapsed ? (isLocked ? `${item.name} (🔒 Locked)` : item.name) : ''}
                    >
                      <span className={styles.icon}>{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className={styles.name}>{item.name}</span>
                          {isLocked ? (
                            <span className={styles.lockIcon} title="Premium Upgrade Required">
                              <Lock size={14} />
                            </span>
                          ) : item.subItems && item.subItems.length > 0 ? (
                            <span className={styles.chevron}>
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                    
                    {!isCollapsed && isExpanded && !isLocked && item.subItems && item.subItems.length > 0 && (
                      <ul className={styles.subList}>
                        {item.subItems.map(sub => (
                          <li 
                            key={sub} 
                            className={`${styles.subItem} ${activeItem === sub ? styles.active : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick(sub);
                            }}
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
