import React, { useState, useMemo } from 'react';
import { Plus, ChevronRight, ChevronDown, Check, X, Folder, FileText } from 'lucide-react';
import { Button, Input, Table, THead, TBody, TR, TH, TD, Skeleton } from '@erp/shared-ui';
import { AccountBadge, AccountType } from '../ui/account-badge';
import { CurrencyText } from '../ui/currency-text';

import { useCOA } from './use-coa';
import { buildTreeRows } from './utils';
import { Account } from './types';

export const ChartOfAccounts: React.FC = () => {
  const { accounts, loading, createAccount } = useCOA();
  
  // UI State
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '', type: 'Asset' as AccountType, is_group: false });

  // Memoized Tree Rows
  const rows = useMemo(() => 
    buildTreeRows(accounts, expandedIds, addingToId), 
    [accounts, expandedIds, addingToId]
  );

  // Handlers
  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  const handleSave = async () => {
    const res = await createAccount({ 
      ...formData, 
      parent_id: addingToId === 'root' ? null : addingToId 
    });
    if (res.success) setAddingToId(null);
    else alert(res.error);
  };

  if (loading && accounts.length === 0) return <COALoader />;

  return (
    <div style={{ padding: 'var(--ui-spacing-xs) 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--ui-text-xl)', fontWeight: '700', color: 'var(--ui-gray-900)', margin: 0 }}>Chart of Accounts</h1>
          <p style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', marginTop: '4px' }}>Unified financial hierarchy and ledger management.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddingToId('root')} disabled={!!addingToId}>
          <Plus size={16} style={{ marginRight: '4px' }} /> Add Account
        </Button>
      </header>

      <Table style={{ border: 'none' }}>
        <THead style={{ borderBottom: '2px solid var(--ui-gray-50)' }}>
          <TR>
            <TH style={{ width: '120px', border: 'none' }}>Code</TH>
            <TH style={{ border: 'none' }}>Account Name</TH>
            <TH style={{ width: '120px', border: 'none' }}>Type</TH>
            <TH style={{ width: '150px', textAlign: 'right', border: 'none' }}>Balance</TH>
            <TH style={{ width: '60px', border: 'none' }}></TH>
          </TR>
        </THead>
        <TBody>
          {rows.map(({ item, level, parentId }) => (
            <TR 
              key={item === 'new' ? `new-${parentId}` : item.id} 
              onClick={item !== 'new' && item.is_group ? () => toggleExpand(item.id) : undefined}
              style={{ borderBottom: '1px solid var(--ui-gray-50)' }}
            >
              {item === 'new' ? (
                <NewAccountRow 
                  level={level} 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSave={handleSave} 
                  onCancel={() => setAddingToId(null)} 
                />
              ) : (
                <AccountDataRow 
                  item={item} 
                  level={level} 
                  isExpanded={expandedIds.has(item.id)} 
                  onAdd={() => {
                    setAddingToId(item.id);
                    setFormData({ ...formData, type: item.type, is_group: false });
                    setExpandedIds(new Set([...expandedIds, item.id]));
                  }} 
                />
              )}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

// --- Sub-Components for Clarity ---

const AccountDataRow: React.FC<{ item: Account; level: number; isExpanded: boolean; onAdd: () => void }> = ({ item, level, isExpanded, onAdd }) => (
  <>
    <TD><span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '11px', color: 'var(--ui-gray-400)' }}>{item.code}</span></TD>
    <TD>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: `${level * 1.5}rem` }}>
        {item.is_group ? (
          <div style={{ color: 'var(--ui-gray-300)', display: 'flex' }}>
            {isExpanded ? <ChevronDown size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
          </div>
        ) : <div style={{ width: 14 }} />}
        {item.is_group ? <Folder size={14} color="var(--ui-primary)" fill="var(--ui-primary)" style={{ opacity: 0.15 }} /> : <FileText size={14} color="var(--ui-gray-300)" />}
        <span style={{ fontWeight: item.is_group ? '700' : '500', color: item.is_group ? 'var(--ui-gray-900)' : 'var(--ui-gray-600)' }}>{item.name}</span>
      </div>
    </TD>
    <TD><AccountBadge type={item.type} /></TD>
    <TD style={{ textAlign: 'right' }}><CurrencyText value={item.balance} /></TD>
    <TD>{item.is_group && <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); onAdd(); }} style={{ color: 'var(--ui-gray-300)' }}><Plus size={14} /></Button>}</TD>
  </>
);

const NewAccountRow: React.FC<{ level: number; formData: any; setFormData: any; onSave: () => void; onCancel: () => void }> = ({ level, formData, setFormData, onSave, onCancel }) => (
  <>
    <TD><Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} style={{ height: '1.75rem', border: 'none', background: 'var(--ui-gray-50)' }} placeholder="Code" /></TD>
    <TD>
      <div style={{ paddingLeft: `${level * 1.5}rem`, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ height: '1.75rem', border: 'none', background: 'var(--ui-gray-50)' }} autoFocus placeholder="Name" />
        <label style={{ fontSize: '10px', color: 'var(--ui-gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input type="checkbox" checked={formData.is_group} onChange={e => setFormData({ ...formData, is_group: e.target.checked })} /> Group
        </label>
      </div>
    </TD>
    <TD>
      <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as AccountType })} style={{ height: '1.75rem', width: '100%', border: 'none', background: 'var(--ui-gray-50)', borderRadius: '4px', fontSize: '12px' }}>
        {["Asset", "Liability", "Equity", "Income", "Expense"].map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </TD>
    <TD style={{ textAlign: 'right', color: 'var(--ui-gray-300)' }}>-</TD>
    <TD><div style={{ display: 'flex' }}>
      <Button variant="ghost" size="sm" onClick={onSave} style={{ color: 'var(--ui-success)', padding: 0 }}><Check size={16} /></Button>
      <Button variant="ghost" size="sm" onClick={onCancel} style={{ color: 'var(--ui-error)', padding: 0 }}><X size={16} /></Button>
    </div></TD>
  </>
);

const COALoader = () => (
  <div style={{ padding: 'var(--ui-spacing-lg)', background: 'var(--ui-white)', borderRadius: 'var(--ui-radius-lg)', border: '1px solid var(--ui-gray-100)' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0' }}><Skeleton width="40px" /><Skeleton width="200px" /><Skeleton width="100px" /></div>
    ))}
  </div>
);
