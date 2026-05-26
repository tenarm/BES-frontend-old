import React, { useState, useEffect } from 'react';
import { Skeleton } from '@bes/shared-ui';
import { PostingPeriodData } from '../types';

interface PeriodsProps {
  calendarId: string;
  headers: any;
  activeTier: string;
  onToggleLock: (id: string, current: boolean) => void;
}

export const PostingPeriodsList: React.FC<PeriodsProps> = ({ calendarId, headers, activeTier, onToggleLock }) => {
  const [periods, setPeriods] = useState<PostingPeriodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await fetch('/api/v1/settings/fiscal-calendars', { headers });
        if (res.ok) {
          // Simulate fetching periods for this calendar
          const periodsMock = Array.from({ length: 12 }).map((_, index) => ({
            id: `${calendarId}-period-${index + 1}`,
            calendar_id: calendarId,
            name: `Period ${(index + 1).toString().padStart(2, '0')}`,
            start_date: `2026-${(index + 1).toString().padStart(2, '0')}-01`,
            end_date: `2026-${(index + 1).toString().padStart(2, '0')}-28`,
            is_locked: false,
            version_id: 1
          }));
          setPeriods(periodsMock as any);
        }
      } catch {
        // fail-silent
      } finally {
        setLoading(false);
      }
    };
    fetchPeriods();
  }, [calendarId]);

  if (loading) return <Skeleton count={2} height={20} />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {periods.map((p) => (
        <div key={p.id} style={{
          background: 'var(--ui-gray-50)',
          border: '1px solid var(--ui-gray-200)',
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>{p.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--ui-gray-400)' }}>{p.start_date}</span>
          </div>
          
          <button
            onClick={() => onToggleLock(p.id, p.is_locked)}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              border: 'none',
              background: p.is_locked ? '#fee2e2' : '#d1fae5',
              color: p.is_locked ? '#991b1b' : '#065f46',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {p.is_locked ? 'Locked' : 'Active'}
          </button>
        </div>
      ))}
    </div>
  );
};
