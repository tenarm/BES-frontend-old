import React, { useState, useEffect } from 'react';
import { FileText, CreditCard, RefreshCw, TrendingDown } from 'lucide-react';
import { Button, Card, Table, THead, TBody, TR, TH, TD, Skeleton } from '@bes/shared-ui';
import { fetchInvoices, fetchPayments } from '../api';
import type { FinanceInvoice, FinancePayment } from '../types';

type TabId = 'invoices' | 'payments';

const INV_STATUS: Record<string, { bg: string; color: string }> = {
  draft:           { bg: 'var(--wp-stone-100)', color: 'var(--wp-stone-600)' },
  issued:          { bg: 'rgba(59,130,246,0.1)', color: '#1e40af' },
  paid:            { bg: 'rgba(34,197,94,0.1)', color: '#166534' },
  partially_paid:  { bg: 'rgba(245,158,11,0.1)', color: '#92400e' },
  overdue:         { bg: 'rgba(239,68,68,0.1)', color: '#991b1b' },
  cancelled:       { bg: 'var(--wp-stone-100)', color: 'var(--wp-stone-500)' },
};

/**
 * FinanceModulePage — MODULES sidebar page for Finance.
 * Shows Invoices and Payments tabs with summary cards.
 * Registered as `Module_Finance` by initFinanceModule().
 */
export default function FinanceModulePage() {
  const [activeTab, setActiveTab] = useState<TabId>('invoices');
  const [invoices, setInvoices] = useState<FinanceInvoice[]>([]);
  const [payments, setPayments] = useState<FinancePayment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [inv, pay] = await Promise.all([fetchInvoices(), fetchPayments()]);
    setInvoices(inv);
    setPayments(pay);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const outstanding = invoices
    .filter((i) => i.status === 'issued' || i.status === 'partially_paid' || i.status === 'overdue')
    .reduce((sum, i) => sum + parseFloat(i.balance_due || '0'), 0)
    .toFixed(4);

  const collected = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
    .toFixed(4);

  const headerStyle: React.CSSProperties = {
    fontFamily: 'var(--wp-font-display)', fontWeight: 700, color: 'var(--wp-stone-600)',
    textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em',
  };

  return (
    <div style={{ padding: 28, fontFamily: 'var(--wp-font-body)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
            Finance
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--wp-stone-500)', fontSize: 14 }}>
            Invoices and payments generated through the Sell workflow.
          </p>
        </div>
        <Button variant="secondary" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {[
          { id: 'fin-metric-invoices', icon: <FileText size={20} />, label: 'Total Invoices', value: loading ? '—' : invoices.length },
          { id: 'fin-metric-outstanding', icon: <TrendingDown size={20} />, label: 'Outstanding', value: loading ? '—' : `$${outstanding}` },
          { id: 'fin-metric-collected', icon: <CreditCard size={20} />, label: 'Total Collected', value: loading ? '—' : `$${collected}` },
        ].map((m) => (
          <Card key={m.id} id={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</span>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--wp-font-display)', marginTop: 6, color: 'var(--wp-stone-900)' }}>{m.value}</div>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12, color: 'var(--wp-stone-600)' }}>{m.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--wp-stone-200)' }}>
        {([
          { id: 'invoices' as TabId, label: 'Invoices', count: invoices.length },
          { id: 'payments' as TabId, label: 'Payments', count: payments.length },
        ]).map((tab) => (
          <button key={tab.id} id={`finance-tab-${tab.id}`} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px', background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--wp-accent)' : '2px solid transparent',
              cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--wp-stone-900)' : 'var(--wp-stone-500)',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: -1,
              fontFamily: 'var(--wp-font-body)', transition: 'color 0.15s',
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.id ? 'var(--wp-accent-muted)' : 'var(--wp-stone-100)',
              color: activeTab === tab.id ? 'var(--wp-accent)' : 'var(--wp-stone-500)',
              fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map((n) => <Skeleton key={n} style={{ height: 44, borderRadius: 6 }} />)}
          </div>
        ) : activeTab === 'invoices' ? (
          <Table>
            <THead>
              <TR>
                <TH style={headerStyle}>Ref #</TH>
                <TH style={headerStyle}>Customer</TH>
                <TH style={headerStyle}>Total</TH>
                <TH style={headerStyle}>Balance Due</TH>
                <TH style={headerStyle}>Due Date</TH>
                <TH style={headerStyle}>Status</TH>
              </TR>
            </THead>
            <TBody>
              {invoices.length === 0 ? (
                <TR><TD colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--wp-stone-400)', fontSize: 14 }}>No invoices yet.</TD></TR>
              ) : invoices.map((inv) => {
                const { bg, color } = INV_STATUS[inv.status] ?? INV_STATUS.draft;
                return (
                  <TR key={inv.id}>
                    <TD style={{ fontWeight: 700, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-accent)' }}>{inv.ref_number}</TD>
                    <TD style={{ fontSize: 13 }}>{inv.customer_id.slice(0, 8)}…</TD>
                    <TD style={{ fontWeight: 600 }}>{parseFloat(inv.total_amount).toFixed(4)}</TD>
                    <TD style={{ fontWeight: 600, color: inv.status === 'overdue' ? '#991b1b' : undefined }}>{parseFloat(inv.balance_due).toFixed(4)}</TD>
                    <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)' }}>{new Date(inv.due_date).toLocaleDateString()}</TD>
                    <TD><span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 600 }}>{inv.status.replace('_', ' ')}</span></TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH style={headerStyle}>Ref #</TH>
                <TH style={headerStyle}>Invoice</TH>
                <TH style={headerStyle}>Amount</TH>
                <TH style={headerStyle}>Method</TH>
                <TH style={headerStyle}>Date</TH>
              </TR>
            </THead>
            <TBody>
              {payments.length === 0 ? (
                <TR><TD colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--wp-stone-400)', fontSize: 14 }}>No payments yet.</TD></TR>
              ) : payments.map((p) => (
                <TR key={p.id}>
                  <TD style={{ fontWeight: 700, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-accent)' }}>{p.ref_number}</TD>
                  <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)' }}>{p.invoice_id.slice(0, 8)}…</TD>
                  <TD style={{ fontWeight: 600 }}>{parseFloat(p.amount).toFixed(4)}</TD>
                  <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)', textTransform: 'capitalize' }}>{p.payment_method.replace('_', ' ')}</TD>
                  <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)' }}>{new Date(p.created_at).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
