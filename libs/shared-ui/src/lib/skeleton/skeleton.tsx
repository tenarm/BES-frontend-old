import React from 'react';
import styles from './skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, className, style }) => {
  return (
    <div 
      className={`${styles.skeleton} ${className || ''}`}
      style={{ 
        width: width || '100%', 
        height: height || '1rem',
        ...style 
      }} 
    />
  );
};
