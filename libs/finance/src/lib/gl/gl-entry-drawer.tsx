import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, Save, Send } from 'lucide-react';
import { Button, Input, Table, THead, TBody, TR, TH, TD } from '@bes/shared-ui';
import { useCOA } from '../coa/use-coa';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface LineItem {
  id: string; // temp UI id
  account_id: string;
  description: string;
  debit: number | string;
  credit: number | string;
}

interface DrawerProps {
  onClose: () => void;
  onSaved: () => void;
}

export const GLActivityDrawer: React.FC<DrawerProps> = ({ onClose, onSaved }) => {
  const { accounts } = useCOA(); // Reuse the hook to get account list
  
  // Only allow posting to non-group accounts
  const selectableAccounts = useMemo(() => accounts.filter(a => !a.is_group), [accounts]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  
  const [lines, setLines] = useState<LineItem[]>([
    { id: '1', account_id: '', description: '', debit: '', credit: '' },
    { id: '2', account_id: '', description: '', debit: '', credit: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculations
  const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit as string) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit as string) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference === 0 && totalDebit > 0;

  const addLine = () => {
    setLines([...lines, { id: Math.random().toString(), account_id: '', description: '', debit: '', credit: '' }]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) return; // Keep at least two lines
    setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof LineItem, value: string) => {
    setLines(lines.map(l => {
      if (l.id !== id) return l;
      
      const newLine = { ...l, [field]: value };
      
      // Auto-clear opposing side to prevent accidental debit AND credit on same line
      if (field === 'debit' && value !== '' && value !== '0') newLine.credit = '';
      if (field === 'credit' && value !== '' && value !== '0') newLine.debit = '';
      
      return newLine;
    }));
  };

  const handleSave = async (status: 'Draft' | 'Posted') => {
    try {
      setError(null);
      setIsSubmitting(true);

      // Clean up lines: remove empty ones, format numbers
      const validLines = lines
        .filter(l => l.account_id !== '' && (parseFloat(l.debit as string) > 0 || parseFloat(l.credit as string) > 0))
        .map(l => ({
          account_id: l.account_id,
          description: l.description,
          debit: parseFloat(l.debit as string) || 0,
          credit: parseFloat(l.credit as string) || 0
        }));

      if (validLines.length < 2) {
        throw new Error("A journal entry requires at least two valid lines.");
      }

      if (status === 'Posted' && totalDebit !== totalCredit) {
        throw new Error(`Cannot post unbalanced entry. Difference: ${difference}`);
      }

      const payload = {
        date,
        reference,
        description,
        status,
        lines: validLines
      };

      const res = await fetch(`${API_BASE}/api/v1/finance/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Failed to save entry');

      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={onClose} />
      <div style={{ 
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '800px', 
        background: 'var(--ui-white)', zIndex: 101, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{ padding: 'var(--ui-spacing-lg)', borderBottom: '1px solid var(--ui-gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--ui-text-lg)', fontWeight: '600' }}>New Journal Entry</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X size={20} /></Button>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--ui-spacing-lg)' }}>
          {error && (
            <div style={{ padding: '12px', background: 'var(--ui-error-light)', color: 'var(--ui-error)', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Header Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ui-gray-600)' }}>Date</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ui-gray-600)' }}>Reference (Optional)</label>
              <Input placeholder="e.g. INV-2023-001" value={reference} onChange={e => setReference(e.target.value)} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ui-gray-600)' }}>Memo / Description</label>
              <Input placeholder="Description for the entire entry..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Lines */}
          <Table>
            <THead style={{ background: 'var(--ui-gray-50)' }}>
              <TR>
                <TH style={{ width: '35%' }}>Account</TH>
                <TH style={{ width: '25%' }}>Description</TH>
                <TH style={{ width: '15%', textAlign: 'right' }}>Debit</TH>
                <TH style={{ width: '15%', textAlign: 'right' }}>Credit</TH>
                <TH style={{ width: '10%' }}></TH>
              </TR>
            </THead>
            <TBody>
              {lines.map((line, index) => (
                <TR key={line.id}>
                  <TD>
                    <select 
                      value={line.account_id} 
                      onChange={e => updateLine(line.id, 'account_id', e.target.value)}
                      style={{ width: '100%', height: '36px', border: '1px solid var(--ui-gray-200)', borderRadius: '4px', padding: '0 8px' }}
                    >
                      <option value="">Select Account...</option>
                      {selectableAccounts.map(a => (
                        <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                      ))}
                    </select>
                  </TD>
                  <TD><Input placeholder="Line desc..." value={line.description} onChange={e => updateLine(line.id, 'description', e.target.value)} /></TD>
                  <TD><Input type="number" placeholder="0.00" value={line.debit} onChange={e => updateLine(line.id, 'debit', e.target.value)} style={{ textAlign: 'right' }} /></TD>
                  <TD><Input type="number" placeholder="0.00" value={line.credit} onChange={e => updateLine(line.id, 'credit', e.target.value)} style={{ textAlign: 'right' }} /></TD>
                  <TD style={{ textAlign: 'center' }}>
                    <Button variant="ghost" size="sm" onClick={() => removeLine(line.id)} disabled={lines.length <= 2} style={{ color: 'var(--ui-gray-400)' }}>
                      <Trash2 size={16} />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <Button variant="ghost" size="sm" onClick={addLine} style={{ marginTop: '12px', color: 'var(--ui-primary)' }}>
            <Plus size={16} style={{ marginRight: '4px' }} /> Add Line
          </Button>

        </div>

        {/* Footer & Totals */}
        <div style={{ padding: 'var(--ui-spacing-lg)', borderTop: '1px solid var(--ui-gray-100)', background: 'var(--ui-gray-50)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '32px', marginBottom: '24px', marginRight: '48px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--ui-gray-500)', fontWeight: '600' }}>Total Debit</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ui-gray-900)' }}>${totalDebit.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--ui-gray-500)', fontWeight: '600' }}>Total Credit</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ui-gray-900)' }}>${totalCredit.toFixed(2)}</div>
            </div>
          </div>
          
          {difference > 0 && (
            <div style={{ textAlign: 'right', color: 'var(--ui-error)', fontSize: '14px', fontWeight: '600', marginBottom: '16px', marginRight: '48px' }}>
              Out of Balance by: ${difference.toFixed(2)}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="secondary" onClick={() => handleSave('Draft')} disabled={isSubmitting}>
              <Save size={16} style={{ marginRight: '8px' }} /> Save as Draft
            </Button>
            <Button variant="primary" onClick={() => handleSave('Posted')} disabled={isSubmitting || !isBalanced}>
              <Send size={16} style={{ marginRight: '8px' }} /> Post Entry
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
