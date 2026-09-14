import React, { useState, useEffect } from 'react';
import { FileText, ShoppingBag, Plus, RefreshCw } from 'lucide-react';
import {
  Button, Card, Table, THead, TBody, TR, TH, TD, Badge, Skeleton,
} from '@bes/shared-ui';
import { fetchQuotations, fetchOrders } from '../api';
import type { SalesQuotation, SalesOrder } from '../types';

type TabId = 'quotations' | 'orders';

/** Status badge colour map for quotations and orders. */
const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  draft:     { bg: 'var(--wp-stone-100)', color: 'var(--wp-stone-600)', label: 'Draft' },
  active:    { bg: 'rgba(34,197,94,0.1)', color: '#166534', label: 'Active' },
  expired:   { bg: 'rgba(239,68,68,0.08)', color: '#991b1b', label: 'Expired' },
  cancelled: { bg: 'rgba(239,68,68,0.08)', color: '#991b1b', label: 'Cancelled' },
  confirmed: { bg: 'rgba(59,130,246,0.1)', color: '#1e40af', label: 'Confirmed' },
  shipped:   { bg: 'rgba(34,197,94,0.1)', color: '#166534', label: 'Shipped' },
  invoiced:  { bg: 'rgba(168,85,247,0.1)', color: '#6b21a8', label: 'Invoiced' },
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const { bg, color, label } = STATUS_COLORS[status] ?? { bg: 'var(--wp-stone-100)', color: 'var(--wp-stone-600)', label: status };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 999,
      background: bg, color, fontSize: 12, fontWeight: 600,
    }}>
      {label}
    </span>
  );
};

/**
 * SalesModulePage — MODULES sidebar entry for the Sales domain.
 *
 * Shows two tabs:
 *   - Quotations: all quotations with status, customer, total, date
 *   - Orders: all sales orders with status, customer, total, date
 *
 * Registered in ComponentRegistry as `Module_Sales` by initSalesModule().
 */
export default function SalesModulePage() {
  const [activeTab, setActiveTab] = useState<TabId>('quotations');
  const [quotations, setQuotations] = useState<SalesQuotation[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [q, o] = await Promise.all([fetchQuotations(), fetchOrders()]);
    setQuotations(q);
    setOrders(o);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const headerStyle: React.CSSProperties = {
    fontFamily: 'var(--wp-font-display)',
    fontWeight: 700,
    color: 'var(--wp-stone-600)',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: '0.06em',
  };

  return (
    <div style={{ padding: '28px', fontFamily: 'var(--wp-font-body)' }}>
      {/* Page Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
            Sales
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--wp-stone-500)', fontSize: 14 }}>
            Browse all quotations and orders. Use the Sell workflow to create new ones.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </header>

      {/* Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {[
          {
            id: 'metric-open-quotes',
            icon: <FileText size={20} color="var(--wp-stone-600)" />,
            label: 'Open Quotations',
            value: loading ? '—' : quotations.filter((q) => q.status === 'draft' || q.status === 'active').length,
          },
          {
            id: 'metric-confirmed-orders',
            icon: <ShoppingBag size={20} color="var(--wp-stone-600)" />,
            label: 'Confirmed Orders',
            value: loading ? '—' : orders.filter((o) => o.status === 'confirmed').length,
          },
          {
            id: 'metric-invoiced-orders',
            icon: <ShoppingBag size={20} color="var(--wp-stone-600)" />,
            label: 'Invoiced Orders',
            value: loading ? '—' : orders.filter((o) => o.status === 'invoiced').length,
          },
        ].map((m) => (
          <Card key={m.id} id={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {m.label}
                </span>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--wp-font-display)', marginTop: 6, color: 'var(--wp-stone-900)' }}>
                  {m.value}
                </div>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12 }}>
                {m.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--wp-stone-200)', paddingBottom: 0 }}>
        {([
          { id: 'quotations' as TabId, label: 'Quotations', count: quotations.length },
          { id: 'orders' as TabId, label: 'Sales Orders', count: orders.length },
        ]).map((tab) => (
          <button
            key={tab.id}
            id={`sales-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--wp-accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--wp-stone-900)' : 'var(--wp-stone-500)',
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: -1,
              fontFamily: 'var(--wp-font-body)',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.id ? 'var(--wp-accent-muted)' : 'var(--wp-stone-100)',
              color: activeTab === tab.id ? 'var(--wp-accent)' : 'var(--wp-stone-500)',
              fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table content */}
      <Card style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map((n) => <Skeleton key={n} style={{ height: 44, borderRadius: 6 }} />)}
          </div>
        ) : activeTab === 'quotations' ? (
          <Table>
            <THead>
              <TR>
                <TH style={headerStyle}>Ref #</TH>
                <TH style={headerStyle}>Customer</TH>
                <TH style={headerStyle}>Total</TH>
                <TH style={headerStyle}>Status</TH>
                <TH style={headerStyle}>Valid Until</TH>
                <TH style={headerStyle}>Created</TH>
              </TR>
            </THead>
            <TBody>
              {quotations.length === 0 ? (
                <TR>
                  <TD colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--wp-stone-400)', fontSize: 14 }}>
                    No quotations yet. Start a Sell workflow to create one.
                  </TD>
                </TR>
              ) : quotations.map((q) => (
                <TR key={q.id} style={{ cursor: 'default' }}>
                  <TD style={{ fontWeight: 700, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-accent)' }}>{q.ref_number}</TD>
                  <TD>{q.customer_id}</TD>
                  <TD style={{ fontWeight: 600 }}>{parseFloat(q.total_amount).toFixed(4)}</TD>
                  <TD><StatusPill status={q.status} /></TD>
                  <TD style={{ color: 'var(--wp-stone-500)', fontSize: 13 }}>{new Date(q.valid_until).toLocaleDateString()}</TD>
                  <TD style={{ color: 'var(--wp-stone-500)', fontSize: 13 }}>{new Date(q.created_at).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH style={headerStyle}>Ref #</TH>
                <TH style={headerStyle}>Customer</TH>
                <TH style={headerStyle}>Total</TH>
                <TH style={headerStyle}>Payment Terms</TH>
                <TH style={headerStyle}>Status</TH>
                <TH style={headerStyle}>Created</TH>
              </TR>
            </THead>
            <TBody>
              {orders.length === 0 ? (
                <TR>
                  <TD colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--wp-stone-400)', fontSize: 14 }}>
                    No orders yet. Start a Sell workflow to create one.
                  </TD>
                </TR>
              ) : orders.map((o) => (
                <TR key={o.id} style={{ cursor: 'default' }}>
                  <TD style={{ fontWeight: 700, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-accent)' }}>{o.ref_number}</TD>
                  <TD>{o.customer_id}</TD>
                  <TD style={{ fontWeight: 600 }}>{parseFloat(o.total_amount).toFixed(4)}</TD>
                  <TD style={{ color: 'var(--wp-stone-500)', fontSize: 13 }}>{o.payment_terms}</TD>
                  <TD><StatusPill status={o.status} /></TD>
                  <TD style={{ color: 'var(--wp-stone-500)', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
