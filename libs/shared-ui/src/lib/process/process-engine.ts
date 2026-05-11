/**
 * ERP Process Transparency — State Resolution Engine (v2)
 *
 * Pure-function utilities for:
 * - Resolving workflow step states from event data
 * - Formatting audit entries for display
 * - Grouping timeline entries by date
 * - Computing action metadata (icons, colors, labels)
 */

import type {
  ProcessDefinition,
  ProcessEvent,
  ResolvedStep,
  StepStatus,
  AuditEntry,
  AuditAction,
} from './process-types';

// ─── Workflow State Engine ───────────────────────────────────────────────────

export function resolveProcessState(
  definition: ProcessDefinition,
  events: ProcessEvent[]
): ResolvedStep[] {
  const eventMap = new Map<string, ProcessEvent>(
    events.map((e) => [e.eventKey, e])
  );
  const completedStepIds = new Set<string>(
    definition.steps
      .filter((step) => eventMap.has(step.statusEvent))
      .map((step) => step.id)
  );

  return definition.steps.map((step): ResolvedStep => {
    const matchingEvent = eventMap.get(step.statusEvent);

    if (matchingEvent) {
      return { ...step, status: 'completed', completedAt: matchingEvent.occurredAt, completedBy: matchingEvent.actor };
    }

    const deps = step.dependsOn ?? [];
    const depsComplete = deps.every((depId) => completedStepIds.has(depId));

    if (!depsComplete) return { ...step, status: 'pending' };
    if (step.type === 'approval') return { ...step, status: 'waiting_approval' };
    return { ...step, status: 'active' };
  });
}

export function getProgressSummary(steps: ResolvedStep[]) {
  const completed = steps.filter((s) => s.status === 'completed').length;
  return { completed, total: steps.length, percent: Math.round((completed / steps.length) * 100) };
}

export function getActiveBlocker(steps: ResolvedStep[]): ResolvedStep | null {
  return steps.find((s) => s.status === 'waiting_approval' || s.status === 'active') ?? null;
}

// ─── Audit Entry Helpers ─────────────────────────────────────────────────────

/** Visual metadata for each action type. */
const ACTION_META: Record<AuditAction | string, { icon: string; color: string; label: string }> = {
  CREATE:        { icon: '✚', color: '#10b981', label: 'Created' },
  UPDATE:        { icon: '✎', color: '#3b82f6', label: 'Updated' },
  DELETE:        { icon: '✕', color: '#ef4444', label: 'Deleted' },
  STATUS_CHANGE: { icon: '⟳', color: '#8b5cf6', label: 'Status Changed' },
  APPROVE:       { icon: '✓', color: '#10b981', label: 'Approved' },
  REJECT:        { icon: '✕', color: '#ef4444', label: 'Rejected' },
  POST:          { icon: '⬆', color: '#0ea5e9', label: 'Posted' },
  CONFIRM:       { icon: '✓', color: '#10b981', label: 'Confirmed' },
  CANCEL:        { icon: '⊘', color: '#6b7280', label: 'Cancelled' },
  EVENT:         { icon: '⚡', color: '#f59e0b', label: 'Event Triggered' },
};

export function getActionMeta(action: string) {
  return ACTION_META[action] || { icon: '•', color: '#6b7280', label: action };
}

/** Formats an ISO timestamp to a relative time string. */
export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Formats a full date-time for tooltips. */
export function fullDateTime(iso: string): string {
  return new Date(iso).toLocaleString([], {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

/** Groups audit entries by date for section headers. */
export function groupByDate(entries: AuditEntry[]): Map<string, AuditEntry[]> {
  const groups = new Map<string, AuditEntry[]>();
  for (const entry of entries) {
    const date = new Date(entry.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(entry);
  }
  return groups;
}

/** Step type visual helpers. */
export function statusLabel(status: StepStatus): string {
  const map: Record<StepStatus, string> = {
    completed: 'Completed', active: 'In Progress',
    pending: 'Pending', waiting_approval: 'Waiting for Approval',
  };
  return map[status];
}

export function stepTypeIcon(step: ResolvedStep): string {
  if (step.icon) return step.icon;
  const map: Record<string, string> = { direct: '👤', sequence: '⚙️', approval: '✅' };
  return map[step.type] ?? '•';
}
