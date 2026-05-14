import { useState, useEffect, useRef, useCallback } from 'react';
import type { AuditEntry } from './process-types';

export interface UseActivityStreamOptions {
  /** Filter by module (e.g., "finance"). */
  module?: string;
  /** Filter by entity type (e.g., "finance.JournalEntry"). */
  entityType?: string;
  /** Maximum entries to keep in memory (oldest are dropped). Default: 100. */
  maxEntries?: number;
  /** Whether the stream is enabled. Default: true. */
  enabled?: boolean;
}

/**
 * useActivityStream — Real-time audit activity via SSE
 *
 * Connects to the backend SSE endpoint and receives live audit entries
 * as they happen. Perfect for:
 * - Live Timeline updates when a journal entry is posted
 * - Real-time activity feed showing system-triggered actions
 * - Dashboard activity widget
 *
 * Usage:
 *   const { entries, isConnected } = useActivityStream({ module: 'finance' });
 *   <Timeline entries={entries} />
 */
export function useActivityStream({
  module,
  entityType,
  maxEntries = 100,
  enabled = true,
}: UseActivityStreamOptions = {}) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    const token = localStorage.getItem('bes_token');
    if (!token) return;

    // Build URL with filters
    const params = new URLSearchParams();
    if (module) params.set('module', module);
    if (entityType) params.set('entity_type', entityType);

    // SSE doesn't support Authorization header natively,
    // so we pass the token as a query param (backend must support this)
    // For production, consider using a cookie-based auth instead.
    const url = `/api/v1/auth/audit/stream?${params.toString()}`;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('connected', (e: MessageEvent) => {
      setIsConnected(true);
      setError(null);
    });

    es.onmessage = (e: MessageEvent) => {
      try {
        const entry: AuditEntry = JSON.parse(e.data);
        setEntries((prev) => {
          const next = [entry, ...prev];
          return next.slice(0, maxEntries);
        });
      } catch {
        // Ignore malformed messages
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      setError('Connection lost — reconnecting...');
      // EventSource auto-reconnects, so we just update state
    };
  }, [module, entityType, maxEntries, enabled]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [connect]);

  /** Manually clear the entry buffer. */
  const clear = useCallback(() => setEntries([]), []);

  return { entries, isConnected, error, clear };
}
