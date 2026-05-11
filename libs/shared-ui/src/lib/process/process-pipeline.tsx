import React from 'react';
import styles from './process-pipeline.module.css';
import type { ProcessDefinition, ProcessEvent } from './process-types';
import {
  resolveProcessState,
  statusLabel,
  stepTypeIcon,
  getProgressSummary,
} from './process-engine';

export interface ProcessPipelineProps {
  definition: ProcessDefinition;
  events: ProcessEvent[];
  currentUserRoles?: string[];
  onStepAction?: (stepId: string, apiEndpoint: string, method?: string) => void;
  entityId?: string;
  className?: string;
}

/**
 * <ProcessPipeline>
 *
 * A premium horizontal workflow tracker with:
 * - Gradient-filled status icons (green=done, blue=active, amber=approval, gray=pending)
 * - Animated pulse on active/waiting steps
 * - Smooth progress bar
 * - Inline approval buttons for eligible roles
 * - Connected node topology with status-aware connectors
 */
export function ProcessPipeline({
  definition,
  events,
  currentUserRoles = [],
  onStepAction,
  entityId,
  className,
}: ProcessPipelineProps) {
  const resolvedSteps = resolveProcessState(definition, events);
  const progress = getProgressSummary(resolvedSteps);
  const isDone = progress.completed === progress.total;

  return (
    <div className={`${styles.root} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.processLabel}>{definition.label}</span>
        <span className={`${styles.progressBadge} ${isDone ? styles.progressBadgeDone : styles.progressBadgeActive}`}>
          {isDone ? '✓ Complete' : `${progress.completed}/${progress.total} steps`}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress.percent}%` }} />
      </div>

      {/* Pipeline nodes */}
      <div className={styles.pipeline}>
        {resolvedSteps.map((step, idx) => {
          const isLast = idx === resolvedSteps.length - 1;
          const canApprove =
            step.status === 'waiting_approval' &&
            step.requiredRole &&
            currentUserRoles.includes(step.requiredRole);

          return (
            <React.Fragment key={step.id}>
              <div className={`${styles.node} ${styles[`node_${step.status}`]}`}>
                <div className={styles.iconBubble}>
                  {step.status === 'completed' ? (
                    <svg viewBox="0 0 16 16" fill="none" className={styles.checkIcon}>
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.status === 'waiting_approval' ? (
                    <svg viewBox="0 0 16 16" fill="none" className={styles.waitIcon}>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : step.status === 'active' ? (
                    <svg viewBox="0 0 16 16" fill="currentColor" className={styles.activeIcon}>
                      <circle cx="8" cy="8" r="3" />
                    </svg>
                  ) : (
                    <span className={styles.stepIcon}>{stepTypeIcon(step)}</span>
                  )}
                </div>

                <div className={styles.nodeContent}>
                  <span className={styles.nodeLabel}>{step.label}</span>
                  <span className={`${styles.nodeStatus} ${styles[`status_${step.status}`]}`}>
                    {statusLabel(step.status)}
                  </span>

                  {step.status === 'completed' && step.completedBy && (
                    <span className={styles.nodeMeta}>
                      {step.completedBy}
                      {step.completedAt && (<> · {formatTime(step.completedAt)}</>)}
                    </span>
                  )}

                  {step.status === 'waiting_approval' && !canApprove && step.requiredRole && (
                    <span className={styles.waitingOn}>
                      Waiting on {formatRole(step.requiredRole)}
                    </span>
                  )}

                  {canApprove && step.action && (
                    <button
                      className={styles.approveBtn}
                      onClick={() => onStepAction?.(step.id, step.action!.apiEndpoint, step.action!.method)}
                    >
                      {step.action.label}
                    </button>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className={`${styles.connector} ${step.status === 'completed' ? styles.connectorDone : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRole(role: string) {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
