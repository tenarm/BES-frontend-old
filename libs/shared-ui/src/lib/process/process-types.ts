/**
 * ERP Process Transparency — Type Definitions (v2)
 *
 * Enhanced type system supporting:
 * - Rich audit trail entries with field-level diffs
 * - Cross-module causal chains via correlation IDs
 * - Actor identity (user vs system) with avatar support
 * - Action categorization for visual treatment
 * - Expandable detail payloads
 */

// ─── Action Types ─────────────────────────────────────────────────────────────

/** Categorizes an audit action for visual treatment and icon selection. */
export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'APPROVE'
  | 'REJECT'
  | 'POST'
  | 'CONFIRM'
  | 'CANCEL'
  | 'EVENT';

/** Step types for workflow pipeline visualization. */
export type ProcessStepType = 'direct' | 'sequence' | 'approval';

/** Resolved status of a workflow step. */
export type StepStatus = 'completed' | 'active' | 'pending' | 'waiting_approval';

// ─── Audit Trail Types ────────────────────────────────────────────────────────

/** A single field-level change within an audit entry. */
export interface FieldChange {
  field: string;
  old: string | null;
  new: string | null;
  /** Optional context label (e.g., "Account 1000 - Cash") */
  context?: string;
}

/** A single audit log entry from the backend. */
export interface AuditEntry {
  id: string;
  created_at: string;
  entity_type: string;
  entity_id: string;
  action: AuditAction;
  actor_id: string | null;
  actor_name: string;
  actor_type: 'user' | 'system';
  module: string;
  correlation_id: string | null;
  description: string;
  changes: {
    action_data?: Record<string, unknown>;
    field_changes?: FieldChange[];
    triggered_event?: string;
    downstream_effects?: string[];
  };
  event_id: string | null;
  parent_audit_id: string | null;
}

/** Timeline data returned by GET /api/v1/auth/audit/{entity_type}/{entity_id} */
export interface AuditTimeline {
  entity_type: string;
  entity_id: string;
  total: number;
  page: number;
  entries: AuditEntry[];
}

// ─── Workflow Process Types ───────────────────────────────────────────────────

export interface ProcessStepAction {
  label: string;
  apiEndpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  payload?: Record<string, unknown>;
}

export interface ProcessStep {
  id: string;
  label: string;
  type: ProcessStepType;
  statusEvent: string;
  dependsOn?: string[];
  requiredRole?: string;
  action?: ProcessStepAction;
  allowRollback?: boolean;
  icon?: string;
  description?: string;
}

export interface ProcessDefinition {
  processId: string;
  label: string;
  entity: string;
  steps: ProcessStep[];
}

// ─── Resolved Runtime Types ──────────────────────────────────────────────────

export interface ResolvedStep extends ProcessStep {
  status: StepStatus;
  completedAt?: string;
  completedBy?: string;
}

export interface ProcessEvent {
  eventKey: string;
  occurredAt: string;
  actor: string;
  actorType: 'user' | 'system';
  metadata?: Record<string, unknown>;
}
