import React from 'react';
import styles from './timeline.module.css';
import type { AuditEntry, AuditTimeline, FieldChange } from './process-types';
import { getActionMeta, relativeTime, fullDateTime, groupByDate } from './process-engine';

export interface TimelineProps {
  /** Audit timeline data from GET /api/v1/auth/audit/{entity_type}/{entity_id} */
  data: AuditTimeline | null;
  /** Raw entries (alternative to data — for manual construction). */
  entries?: AuditEntry[];
  /** Extra class name. */
  className?: string;
}

/**
 * <Timeline> — Premium Process Transparency Component
 *
 * A rich, expandable activity feed that answers the 5 Ws for every action:
 * WHO performed it (actor avatar + name)
 * WHAT happened (action badge + description)
 * WHEN it happened (relative time + full datetime tooltip)
 * WHY it changed (field-level before/after diffs)
 * WHERE it connects (correlation ID + event chain badges)
 *
 * Feed it data from the Audit API and it renders automatically.
 */
export function Timeline({ data, entries: rawEntries, className }: TimelineProps) {
  const entries = rawEntries || data?.entries || [];

  if (entries.length === 0) {
    return (
      <div className={`${styles.root} ${className || ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Activity</span>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <div className={styles.emptyText}>No activity recorded yet</div>
        </div>
      </div>
    );
  }

  const grouped = groupByDate(entries);
  const totalEntries = data?.total || entries.length;

  return (
    <div className={`${styles.root} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Activity</span>
        <span className={styles.totalBadge}>{totalEntries} events</span>
      </div>

      {/* Date-grouped entries */}
      {Array.from(grouped.entries()).map(([dateLabel, dateEntries]) => (
        <div key={dateLabel} className={styles.dateGroup}>
          <div className={styles.dateLabel}>{dateLabel}</div>
          {dateEntries.map((entry, idx) => (
            <AuditEntryCard
              key={entry.id}
              entry={entry}
              isLast={idx === dateEntries.length - 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Single Audit Entry Card ─────────────────────────────────────────────────

function AuditEntryCard({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const [showChanges, setShowChanges] = React.useState(false);
  const meta = getActionMeta(entry.action);
  const fieldChanges: FieldChange[] = entry.changes?.field_changes || [];
  const triggeredEvent = entry.changes?.triggered_event;
  const hasExpandable = fieldChanges.length > 0;

  return (
    <div className={styles.entry}>
      {/* Action Icon Column */}
      <div className={styles.iconCol}>
        <div className={styles.actionIcon} style={{ background: meta.color }}>
          {meta.icon}
        </div>
        <div className={`${styles.spine} ${isLast ? styles.spineHidden : ''}`} />
      </div>

      {/* Content */}
      <div className={styles.body}>
        {/* Top row: action label + module + timestamp */}
        <div className={styles.topRow}>
          <span
            className={styles.actionLabel}
            style={{ color: meta.color, background: `${meta.color}12` }}
          >
            {meta.label}
          </span>
          <span className={styles.moduleBadge}>{entry.module}</span>
          <span className={styles.timestamp} title={fullDateTime(entry.created_at)}>
            {relativeTime(entry.created_at)}
          </span>
        </div>

        {/* Description */}
        <div className={styles.description}>{entry.description}</div>

        {/* Actor row */}
        <div className={styles.actorRow}>
          <div className={`${styles.actorAvatar} ${
            entry.actor_type === 'system' ? styles.actorAvatarSystem : styles.actorAvatarUser
          }`}>
            {entry.actor_type === 'system' ? '⚙' : entry.actor_name.charAt(0).toUpperCase()}
          </div>
          <span>
            {entry.actor_type === 'system' ? 'System' : entry.actor_name}
          </span>
          {entry.correlation_id && (
            <span className={styles.corrId} title="Correlation ID">
              {entry.correlation_id}
            </span>
          )}
        </div>

        {/* Triggered event badge */}
        {triggeredEvent && (
          <div className={styles.eventBadge}>
            ⚡ Triggered: {triggeredEvent}
          </div>
        )}

        {/* Field changes — expandable diff section */}
        {hasExpandable && (
          <>
            <button
              className={styles.changesToggle}
              onClick={() => setShowChanges(!showChanges)}
            >
              <span className={`${styles.chevron} ${showChanges ? styles.chevronOpen : ''}`}>▶</span>
              {fieldChanges.length} field{fieldChanges.length > 1 ? 's' : ''} changed
            </button>

            {showChanges && (
              <ul className={styles.changesList}>
                {fieldChanges.map((fc, i) => (
                  <li key={i} className={styles.changeItem}>
                    <span className={styles.changeField}>
                      {fc.context || fc.field}
                    </span>
                    {fc.old !== null && fc.old !== undefined && (
                      <span className={styles.changeOld}>{fc.old}</span>
                    )}
                    <span className={styles.changeArrow}>→</span>
                    <span className={styles.changeNew}>{fc.new}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
