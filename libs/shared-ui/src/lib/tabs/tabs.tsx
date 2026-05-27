import React, { createContext, useContext, useState } from 'react';
import styles from './tabs.module.css';

interface TabContextProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

export interface TabGroupProps {
  children: React.ReactNode;
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
  fillHeight?: boolean;
}

export function TabGroup({ children, defaultIndex = 0, selectedIndex, onChange, className, fillHeight = false }: TabGroupProps) {
  const [localIndex, setLocalIndex] = useState(defaultIndex);
  const isControlled = selectedIndex !== undefined;
  const activeIndex = isControlled ? selectedIndex : localIndex;

  const setSelectedIndex = (index: number) => {
    if (!isControlled) {
      setLocalIndex(index);
    }
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <TabContext.Provider value={{ selectedIndex: activeIndex, setSelectedIndex }}>
      <div className={`${styles.tabGroup} ${fillHeight ? styles.fillHeight : ''} ${className || ''}`}>{children}</div>
    </TabContext.Provider>
  );
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div className={`${styles.tabList} ${className || ''}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { index } as any);
        }
        return child;
      })}
    </div>
  );
}

export interface TabProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  index?: number;
}

export function Tab({ children, className, disabled, index }: TabProps) {
  const context = useContext(TabContext);
  if (!context) throw new Error("Tab must be used within a TabGroup");

  const isSelected = context.selectedIndex === index;

  const handleClick = () => {
    if (!disabled && index !== undefined) {
      context.setSelectedIndex(index);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.tab} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''} ${className || ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export interface TabPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanels({ children, className }: TabPanelsProps) {
  return (
    <div className={`${styles.tabPanels} ${className || ''}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { index } as any);
        }
        return child;
      })}
    </div>
  );
}

export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function TabPanel({ children, className, index }: TabPanelProps) {
  const context = useContext(TabContext);
  if (!context) throw new Error("TabPanel must be used within a TabGroup");

  const isSelected = context.selectedIndex === index;

  if (!isSelected) return null;

  return (
    <div className={`${styles.tabPanel} ${className || ''}`}>
      {children}
    </div>
  );
}
