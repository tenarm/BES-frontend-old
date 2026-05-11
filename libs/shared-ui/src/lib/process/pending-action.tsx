import React from 'react';
import styles from './pending-action.module.css';

export interface PendingActionProps {
  /** The step label (e.g., "Manager Approval Required"). */
  label: string;
  /** Who the action is waiting on (e.g., "Sales Manager"). */
  waitingOn?: string;
  /** Deadline or additional context. */
  meta?: string;
  /** Button label for the action (only shown if the user can act). */
  actionLabel?: string;
  /** Called when the user clicks the action button. */
  onAction?: () => void;
  /** Whether this is an approval (amber) or info (blue) variant. */
  variant?: 'approval' | 'info';
  /** Extra class name. */
  className?: string;
}

/**
 * <PendingAction>
 *
 * A notification card rendered inline on entity detail pages
 * when a workflow step requires human intervention.
 *
 * Approval variant: Amber gradient — "This needs your signature"
 * Info variant: Blue gradient — "This step is in progress"
 */
export function PendingAction({
  label,
  waitingOn,
  meta,
  actionLabel,
  onAction,
  variant = 'approval',
  className,
}: PendingActionProps) {
  return (
    <div className={`${styles.root} ${variant === 'info' ? styles.rootInfo : ''} ${className || ''}`}>
      <div className={styles.icon}>
        {variant === 'approval' ? '⏳' : 'ℹ'}
      </div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.meta}>
          {waitingOn && <>Waiting on <strong>{waitingOn}</strong></>}
          {meta && <>{waitingOn ? ' · ' : ''}{meta}</>}
        </div>
      </div>
      {actionLabel && onAction && (
        <button className={styles.actionBtn} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
