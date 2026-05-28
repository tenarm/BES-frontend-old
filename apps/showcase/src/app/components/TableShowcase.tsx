import React, { useState } from 'react';
import { Table, THead, TBody, TR, TH, TD, Badge, Avatar } from '@tenarm/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

const journalEntries = [
  { id: 'JE-001', date: '2026-05-01', description: 'May Payroll — Engineering Dept.', debit: 84000, credit: 0, account: '5100', status: 'posted' as const },
  { id: 'JE-002', date: '2026-05-03', description: 'Vendor Invoice — Acme Supplies', debit: 12500, credit: 0, account: '6020', status: 'pending' as const },
  { id: 'JE-003', date: '2026-05-07', description: 'Revenue Recognition — SO-4421', debit: 0, credit: 65000, account: '4000', status: 'posted' as const },
  { id: 'JE-004', date: '2026-05-10', description: 'Tax Liability Accrual Q2', debit: 22000, credit: 0, account: '2100', status: 'draft' as const },
  { id: 'JE-005', date: '2026-05-14', description: 'Bank Reconciliation Adjustment', debit: 0, credit: 3200, account: '1010', status: 'review' as const },
];

const statusVariant = {
  posted: 'success' as const,
  pending: 'warning' as const,
  draft: 'default' as const,
  review: 'info' as const,
};

export const TableShowcase = () => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Table"
        description="Tables present structured, comparable data with semantic HTML elements. Support for sorting, selection, status badges, and row interactivity is built in."
        badge="Shared UI"
      />

      <ShowcaseSection
        title="Interactive Table"
        description="Clickable rows, status badges, and numeric alignment for financial data."
      >
        <ShowcaseDemo title="General Ledger Journal Entries">
          <div style={{ width: '100%' }}>
            <Table>
              <THead>
                <TR>
                  <TH>Entry ID</TH>
                  <TH>Date</TH>
                  <TH>Description</TH>
                  <TH>Account</TH>
                  <TH style={{ textAlign: 'right' }}>Debit</TH>
                  <TH style={{ textAlign: 'right' }}>Credit</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {journalEntries.map((entry) => (
                  <TR
                    key={entry.id}
                    onClick={() => setSelectedRow(entry.id === selectedRow ? null : entry.id)}
                    style={{
                      cursor: 'pointer',
                      background: entry.id === selectedRow ? '#eff6ff' : undefined,
                      outline: entry.id === selectedRow ? '2px solid #bfdbfe' : undefined,
                    }}
                  >
                    <TD>
                      <code style={{ fontSize: '12px', color: 'var(--ui-primary)', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                        {entry.id}
                      </code>
                    </TD>
                    <TD style={{ color: 'var(--ui-gray-500)', fontSize: '13px', whiteSpace: 'nowrap' }}>{entry.date}</TD>
                    <TD style={{ maxWidth: '260px' }}>{entry.description}</TD>
                    <TD><code style={{ fontSize: '12px' }}>{entry.account}</code></TD>
                    <TD style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: entry.debit ? '#0f172a' : 'var(--ui-gray-300)' }}>
                      {entry.debit ? `$${entry.debit.toLocaleString()}` : '—'}
                    </TD>
                    <TD style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: entry.credit ? '#0f172a' : 'var(--ui-gray-300)' }}>
                      {entry.credit ? `$${entry.credit.toLocaleString()}` : '—'}
                    </TD>
                    <TD>
                      <Badge variant={statusVariant[entry.status]}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {selectedRow && (
              <p style={{ fontSize: '12px', color: 'var(--ui-gray-500)', marginTop: '8px', padding: '0 4px' }}>
                Selected: <strong>{selectedRow}</strong> — click again to deselect.
              </p>
            )}
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="User List Table" description="Avatar + name patterns in a user management table.">
        <ShowcaseDemo>
          <div style={{ width: '100%' }}>
            <Table>
              <THead>
                <TR>
                  <TH>User</TH>
                  <TH>Role</TH>
                  <TH>Module Access</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {[
                  { name: 'John Doe', role: 'Finance Manager', modules: 'Finance, Settings', color: '#4f46e5', status: 'active' as const },
                  { name: 'Sarah Kim', role: 'HR Administrator', modules: 'HR, Settings', color: '#10b981', status: 'active' as const },
                  { name: 'Raj Anand', role: 'Inventory Operator', modules: 'Inventory', color: '#f59e0b', status: 'active' as const },
                  { name: 'Mei Zhou', role: 'Sales Executive', modules: 'Sales, CRM', color: '#ef4444', status: 'inactive' as const },
                ].map((user) => (
                  <TR key={user.name}>
                    <TD>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar initials={user.name.split(' ').map(n => n[0]).join('')} color={user.color} size="sm" />
                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                      </div>
                    </TD>
                    <TD style={{ color: 'var(--ui-gray-600)' }}>{user.role}</TD>
                    <TD style={{ color: 'var(--ui-gray-500)', fontSize: '13px' }}>{user.modules}</TD>
                    <TD>
                      <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Table, THead, TBody, TR, TH, TD, Badge } from '@tenarm/shared-ui';

<Table>
  <THead>
    <TR>
      <TH>Invoice</TH>
      <TH>Status</TH>
      <TH style={{ textAlign: 'right' }}>Amount</TH>
    </TR>
  </THead>
  <TBody>
    <TR onClick={() => handleSelect('INV-001')}>
      <TD>INV-001</TD>
      <TD><Badge variant="success">Paid</Badge></TD>
      <TD style={{ textAlign: 'right' }}>$2,500.00</TD>
    </TR>
  </TBody>
</Table>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'className', type: 'string', description: 'Additional CSS class name for any table element.' },
          { name: 'onClick (TR)', type: '() => void', description: 'Makes the row clickable. Adds cursor:pointer.' },
          { name: 'style (TH, TD)', type: 'CSSProperties', description: 'Inline styles, e.g., textAlign for numeric columns.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
