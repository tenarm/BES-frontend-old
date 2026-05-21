/**
 * BES Process Transparency — Public API
 *
 * All components and utilities for the "golden feature" process transparency system.
 */

// Types
export type {
  AuditAction,
  AuditEntry,
  AuditTimeline,
  FieldChange,
  ProcessStepType,
  StepStatus,
  ProcessStep,
  ProcessStepAction,
  ProcessDefinition,
  ResolvedStep,
  ProcessEvent,
} from './process-types';

// Engine & Utilities
export {
  resolveProcessState,
  getProgressSummary,
  getActiveBlocker,
  getActionMeta,
  relativeTime,
  fullDateTime,
  groupByDate,
  statusLabel,
  stepTypeIcon,
} from './process-engine';

// Components
export { Timeline } from './timeline';
export type { TimelineProps } from './timeline';

export { ProcessPipeline } from './process-pipeline';
export type { ProcessPipelineProps } from './process-pipeline';

export { PendingAction } from './pending-action';
export type { PendingActionProps } from './pending-action';

// Hooks
export { useActivityStream } from './use-activity-stream';
export type { UseActivityStreamOptions } from './use-activity-stream';

// Unified Real-Time Process Pipeline Exports

export { useProcessStore } from './process-store';
export { FloatingProcessPipeline } from './FloatingProcessPipeline';
export { ProcessRegistryModal } from './ProcessRegistryModal';

