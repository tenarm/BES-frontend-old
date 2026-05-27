import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './drawer.module.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: string;
  noScroll?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  style,
  size = 'md',
  maxWidth,
  noScroll = false
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Apply custom width overrides to the drawer element directly
  const drawerStyles: React.CSSProperties = {};
  if (maxWidth) {
    drawerStyles.maxWidth = maxWidth;
  }

  return ReactDOM.createPortal(
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} style={style} onClick={onClose}>
      <div 
        className={`${styles.drawer} ${styles[size]} ${isOpen ? styles.drawerOpen : ''}`} 
        style={drawerStyles} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={`${styles.body} ${noScroll ? styles.noScroll : ''}`}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
