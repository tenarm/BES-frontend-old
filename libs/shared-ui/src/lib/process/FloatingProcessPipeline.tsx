import React from 'react';
import { useProcessStore } from './process-store';
import styles from './FloatingProcessPipeline.module.css';

interface FloatingProcessPipelineProps {
  currentUser?: {
    is_superuser: boolean;
    permissions: Record<string, Record<string, Record<string, boolean>>>;
  } | null;
}

export function FloatingProcessPipeline({ currentUser }: FloatingProcessPipelineProps) {
  const {
    activeProcess,
    processState,
    errorDetails,
    getResolvedSteps,
    triggerApprovalModal,
    failProcess,
    acknowledgeAndClose,
  } = useProcessStore();

  if (!activeProcess) return null;

  const steps = getResolvedSteps();
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const hasApprovalRights = (role?: string) => {
    if (!role) return true;
    if (!currentUser) return false;
    if (currentUser.is_superuser) return true;

    // Map role keywords to permissions keys
    if (role === 'hr_admin' && currentUser.permissions?.hr) return true;
    if (role === 'finance_admin' && currentUser.permissions?.finance) return true;
    if (role === 'inventory_admin' && currentUser.permissions?.inventory) return true;

    return false;
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return '';
    if (role === 'hr_admin') return 'HR Department';
    if (role === 'finance_admin') return 'Finance Department';
    if (role === 'inventory_admin') return 'Inventory Operations';
    return role;
  };

  const handleStepAction = (stepId: string, requiredRole?: string) => {
    // CFO closing approval gate
    if (stepId === 'cfo_final_approval') {
      triggerApprovalModal(stepId, 'Modal_PeriodCloseApproval');
    }
    // Operational CRM assets handover gate
    else if (stepId === 'transfer_crm_assets') {
      triggerApprovalModal(stepId, 'Modal_UserOffboardApproval');
    }
    // Final lockout confirmation step
    else if (stepId === 'finalize_termination') {
      useProcessStore.getState().addEvent('USER_DEACTIVATED', 'Administrator', {
        timestamp: new Date().toISOString()
      });
    }
    else {
      console.warn(`No handler registered for step action: ${stepId}`);
    }
  };

  const handleSimulatedError = () => {
    failProcess(
      'Finance Settlement Ledger Sync Failed',
      'The double-entry journal transaction was rejected by PostgreSQL due to a missing default cost center map for Acme Corp [ERR_CODE: 409_LEDGER_INTEGRITY].'
    );
  };

  return (
    <div className={styles.overlayContainer}>
      <div className={styles.window}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleBlock}>
            <span className={styles.headerSubtitle}>REAL-TIME PROCESS WORKFLOW</span>
            <h4 className={styles.headerTitle}>{activeProcess.label}</h4>
          </div>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>

        {/* State Banner */}
        <div className={`${styles.stateBanner} ${styles[`banner_${processState}`]}`}>
          {processState === 'running' && (
            <div className={styles.bannerRow}>
              <div className={styles.spinner} />
              <span>Syncing actions with server ledgers...</span>
            </div>
          )}
          {processState === 'waiting' && (
            <div className={styles.bannerRow}>
              <span className={styles.amberWarningIcon}>⚠</span>
              <span>Action required from authorized department</span>
            </div>
          )}
          {processState === 'completed' && (
            <div className={styles.bannerRow}>
              <span className={styles.greenCheckIcon}>✓</span>
              <span>All workflow actions successfully executed</span>
            </div>
          )}
          {processState === 'failed' && (
            <div className={styles.bannerRow}>
              <span className={styles.redErrorIcon}>✕</span>
              <span>System transaction aborted</span>
            </div>
          )}
        </div>

        {/* Vertical Stepper List */}
        <div className={styles.stepperList}>
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isWaiting = step.status === 'waiting_approval';
            const isFailed = processState === 'failed' && index === steps.findIndex((s) => s.status !== 'completed');

            const isAuthorized = hasApprovalRights(step.requiredRole);
            const roleLabel = getRoleLabel(step.requiredRole);

            return (
              <div key={step.id} className={styles.stepItem}>
                {/* Visual Connector Line */}
                {!isLast && (
                  <div
                    className={`${styles.stepConnector} ${isCompleted ? styles.connectorCompleted : ''} ${
                      isFailed ? styles.connectorFailed : ''
                    }`}
                  />
                )}

                {/* Circle Icon Badge */}
                <div
                  className={`${styles.stepCircle} ${isCompleted ? styles.circleCompleted : ''} ${
                    isActive ? styles.circleActive : ''
                  } ${isWaiting ? styles.circleWaiting : ''} ${isFailed ? styles.circleFailed : ''}`}
                >
                  {isCompleted ? (
                    <svg viewBox="0 0 16 16" fill="none" className={styles.checkSvg}>
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isFailed ? (
                    <span className={styles.crossTxt}>✕</span>
                  ) : isWaiting ? (
                    <span className={styles.keyTxt}>🔑</span>
                  ) : isActive ? (
                    <div className={styles.pulseInner} />
                  ) : (
                    <span className={styles.pendingDot} />
                  )}
                </div>

                {/* Step Metadata & Buttons */}
                <div className={styles.stepContent}>
                  <div className={styles.stepTitleRow}>
                    <span
                      className={`${styles.stepLabel} ${isCompleted ? styles.lblCompleted : ''} ${
                        isActive ? styles.lblActive : ''
                      } ${isWaiting ? styles.lblWaiting : ''} ${isFailed ? styles.lblFailed : ''}`}
                    >
                      {step.label}
                    </span>
                    {step.completedAt && (
                      <span className={styles.timeTag}>
                        {new Date(step.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className={styles.stepDesc}>{step.description}</p>

                  {/* Interactive Gate Actions */}
                  {isWaiting && step.action && (
                    <div className={styles.actionContainer}>
                      {isAuthorized ? (
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleStepAction(step.id, step.requiredRole)}
                        >
                          {step.action.label} →
                        </button>
                      ) : (
                        <div className={styles.waitingLockBadge}>
                          🔒 Waiting on approval from {roleLabel} ({step.requiredRole})
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Details Section */}
        {processState === 'failed' && errorDetails && (
          <div className={styles.errorBox}>
            <h5 className={styles.errorBoxTitle}>Transaction Aborted Details</h5>
            <p className={styles.errorBoxMsg}>{errorDetails.message}</p>
            {errorDetails.details && <pre className={styles.errorBoxDetail}>{errorDetails.details}</pre>}
            <button
              className={styles.retryBtn}
              onClick={() => {
                const activeId = activeProcess.processId;
                acknowledgeAndClose();
                // restart
                setTimeout(() => useProcessStore.getState().startProcess(activeId), 500);
              }}
            >
              Retry Pipeline Execution
            </button>
          </div>
        )}

        {/* Bottom Actions Area */}
        <div className={styles.footer}>
          {processState === 'running' && activeProcess.processId === 'GL_ENTRY_CREATION' && (
            <button className={styles.devTriggerFailBtn} onClick={handleSimulatedError}>
              Simulate Network Error Trigger
            </button>
          )}

          {(processState === 'completed' || processState === 'failed') && (
            <div className={styles.footerCompleteRow}>
              <button className={styles.acknowledgeBtn} onClick={acknowledgeAndClose}>
                Acknowledge & Close Process
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
