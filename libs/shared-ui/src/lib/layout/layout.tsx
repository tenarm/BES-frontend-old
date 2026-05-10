import React from 'react';
import styles from './layout.module.css';

export interface ShellLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
}

export const ShellLayout: React.FC<ShellLayoutProps> = ({ children, header, sidebar }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        {header}
      </header>
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          {sidebar}
        </aside>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};
