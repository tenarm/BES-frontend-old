import React from 'react';
import { Card, Button, Badge, PremiumLockIndicator } from '@bes/shared-ui';
import { FiscalCalendarData } from '../types';
import { PostingPeriodsList } from './posting-periods-list';

interface FiscalCalendarsTabProps {
  calendars: FiscalCalendarData[];
  activeTier: 'Basic' | 'Pro' | 'Premium';
  onAdd: () => void;
  headers: any;
  onToggleLock: (id: string, current: boolean) => void;
}

export const FiscalCalendarsTab: React.FC<FiscalCalendarsTabProps> = ({
  calendars,
  activeTier,
  onAdd,
  headers,
  onToggleLock,
}) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Accounting Calendars</h3>
        <Button variant="primary" onClick={onAdd}>
          Generate Fiscal Year {activeTier === 'Basic' && <PremiumLockIndicator size={12} style={{ marginLeft: 6 }} />}
        </Button>
      </div>

      {calendars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ui-gray-500)' }}>
          No fiscal calendars configured. Generate your first accounting year to initialize posting periods.
        </div>
      ) : (
        calendars.map((cal) => (
          <div key={cal.id} style={{ marginBottom: 30, border: '1px solid var(--ui-gray-200)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{cal.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)' }}>Range: {cal.start_date} to {cal.end_date}</span>
              </div>
              <Badge variant={cal.status === 'OPEN' ? 'success' : 'danger'}>{cal.status}</Badge>
            </div>

            {/* Display Associated Month Periods */}
            <PostingPeriodsList calendarId={cal.id!} headers={headers} activeTier={activeTier} onToggleLock={onToggleLock} />
          </div>
        ))
      )}
    </Card>
  );
};
