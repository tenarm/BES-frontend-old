import React from 'react';
import { Lock } from 'lucide-react';
import styles from './PremiumLockIndicator.module.css';

export interface PremiumLockIndicatorProps {
  className?: string;
  size?: number;
  tooltip?: string;
}

export function PremiumLockIndicator({ className, size = 14, tooltip = "Premium Upgrade Required" }: PremiumLockIndicatorProps) {
  return (
    <span className={`${styles.lockIndicator} ${className || ''}`} title={tooltip}>
      <Lock size={size} />
    </span>
  );
}
