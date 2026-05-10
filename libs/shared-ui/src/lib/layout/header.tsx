import React from 'react';
import styles from './header.module.css';

export interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ left, center, right }) => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>{left}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
};
