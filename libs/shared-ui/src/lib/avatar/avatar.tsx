import React from 'react';
import styles from './avatar.module.css';

export interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', color }) => {
  return (
    <div 
      className={`${styles.avatar} ${styles[size]}`} 
      style={{ backgroundColor: color || 'var(--wp-accent)' }}
    >
      {initials}
    </div>
  );
};
