import React from 'react';
import { Drawer, Button, Input } from '@bes/shared-ui';
import { FiscalCalendarData } from '../types';

interface CalendarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCalendar: FiscalCalendarData | null;
  setSelectedCalendar: (cal: FiscalCalendarData) => void;
  onSave: (e: React.FormEvent) => void;
}

export const CalendarDrawer: React.FC<CalendarDrawerProps> = ({
  isOpen,
  onClose,
  selectedCalendar,
  setSelectedCalendar,
  onSave,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Accounting Year"
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Generate Calendar Year</Button>
        </div>
      }
    >
      {selectedCalendar && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input 
            label="Calendar Name (e.g. FY 2026)" 
            value={selectedCalendar.name}
            onChange={(e) => setSelectedCalendar({ ...selectedCalendar, name: e.target.value })}
            required
          />
          <Input 
            label="Start Date (YYYY-MM-DD)" 
            value={selectedCalendar.start_date}
            onChange={(e) => setSelectedCalendar({ ...selectedCalendar, start_date: e.target.value })}
            placeholder="e.g. 2026-01-01"
            required
          />
          <Input 
            label="End Date (YYYY-MM-DD)" 
            value={selectedCalendar.end_date}
            onChange={(e) => setSelectedCalendar({ ...selectedCalendar, end_date: e.target.value })}
            placeholder="e.g. 2026-12-31"
            required
          />
        </form>
      )}
    </Drawer>
  );
};
