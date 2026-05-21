import React from 'react';
import styles from './sidebar.module.css';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';

export interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  subItems?: string[];
  isLocked?: boolean;
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
  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.items}>
        {items.map((item) => {
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
              
              {!isCollapsed && isExpanded && !isLocked && item.subItems && (
                <ul className={styles.subList}>
                  {item.subItems.map(sub => (
                    <li 
                      key={sub} 
                      className={`${styles.subItem} ${activeItem === sub ? styles.active : ''}`}
                      onClick={() => onItemClick(sub)}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

