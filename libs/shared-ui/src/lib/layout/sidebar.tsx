import React from 'react';
import styles from './sidebar.module.css';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  subItems?: string[];
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

          return (
            <div key={item.name} className={styles.group}>
              <div 
                className={`${styles.item} ${isActive && !isCollapsed ? styles.active : ''}`}
                onClick={() => onItemClick(item.name)}
                title={isCollapsed ? item.name : ''}
              >
                <span className={styles.icon}>{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className={styles.name}>{item.name}</span>
                    {item.subItems && (
                      <span className={styles.chevron}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {!isCollapsed && isExpanded && item.subItems && (
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
