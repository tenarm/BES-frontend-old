import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button, Table, THead, TBody, TR, TH, TD, Skeleton } from '@erp/shared-ui';
import { GLActivityDrawer } from './gl-entry-drawer';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const GLDashboard: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/finance/journal-entries`);
      const json = await res.json();
      setEntries(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-lg)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--ui-text-xl)', fontWeight: '700', color: 'var(--ui-gray-900)', margin: 0 }}>General Ledger</h2>
          <p style={{ fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-500)', marginTop: '4px' }}>Manage and record journal entries.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} style={{ marginRight: '4px' }} /> New Entry
        </Button>
      </header>

      <div style={{ background: 'var(--ui-white)', borderRadius: 'var(--ui-radius-lg)', border: '1px solid var(--ui-gray-200)', overflow: 'hidden' }}>
        <Table>
          <THead style={{ background: 'var(--ui-gray-50)' }}>
            <TR>
              <TH>Date</TH>
              <TH>Reference</TH>
              <TH>Description</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TR key={i}>
                  <TD><Skeleton width="100px" /></TD>
                  <TD><Skeleton width="120px" /></TD>
                  <TD><Skeleton width="200px" /></TD>
                  <TD><Skeleton width="60px" /></TD>
                </TR>
              ))
            ) : entries.length === 0 ? (
              <TR>
                <TD colSpan={4} style={{ textAlign: 'center', padding: 'var(--ui-spacing-xl) 0', color: 'var(--ui-gray-400)' }}>
                  <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <p>No journal entries found.</p>
                </TD>
              </TR>
            ) : (
              entries.map(entry => (
                <TR key={entry.id} style={{ borderBottom: '1px solid var(--ui-gray-100)' }}>
                  <TD>{entry.date}</TD>
                  <TD>{entry.reference || '-'}</TD>
                  <TD>{entry.description}</TD>
                  <TD>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      background: entry.status === 'Posted' ? 'var(--ui-success-light)' : 'var(--ui-warning-light)',
                      color: entry.status === 'Posted' ? 'var(--ui-success)' : 'var(--ui-warning)'
                    }}>
                      {entry.status}
                    </span>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>

      {isDrawerOpen && (
        <GLActivityDrawer 
          onClose={() => setIsDrawerOpen(false)} 
          onSaved={() => { setIsDrawerOpen(false); fetchEntries(); }} 
        />
      )}
    </div>
  );
};
