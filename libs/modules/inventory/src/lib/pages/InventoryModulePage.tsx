import React, { useState, useEffect } from 'react';
import { Package, Truck, RefreshCw } from 'lucide-react';
import { Button, Card, Table, THead, TBody, TR, TH, TD, Skeleton } from '@bes/shared-ui';
import { fetchShipments } from '../api';
import type { InventoryShipment } from '../types';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft:      { bg: 'var(--wp-stone-100)', color: 'var(--wp-stone-600)' },
  dispatched: { bg: 'rgba(34,197,94,0.1)', color: '#166534' },
  cancelled:  { bg: 'rgba(239,68,68,0.08)', color: '#991b1b' },
};

/**
 * InventoryModulePage — MODULES sidebar page for Inventory.
 * Shows all shipments with status, linked order, and dispatch date.
 * Registered as `Module_Inventory` by initInventoryModule().
 */
export default function InventoryModulePage() {
  const [shipments, setShipments] = useState<InventoryShipment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchShipments();
    setShipments(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const dispatched = shipments.filter((s) => s.status === 'dispatched').length;
  const pending = shipments.filter((s) => s.status === 'draft').length;

  const headerStyle: React.CSSProperties = {
    fontFamily: 'var(--wp-font-display)', fontWeight: 700,
    color: 'var(--wp-stone-600)', textTransform: 'uppercase',
    fontSize: 11, letterSpacing: '0.06em',
  };

  return (
    <div style={{ padding: 28, fontFamily: 'var(--wp-font-body)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
            Inventory
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--wp-stone-500)', fontSize: 14 }}>
            All shipments created through the Sell workflow.
          </p>
        </div>
        <Button variant="secondary" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </header>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {[
          { id: 'inv-metric-dispatched', icon: <Truck size={20} />, label: 'Dispatched', value: loading ? '—' : dispatched },
          { id: 'inv-metric-pending', icon: <Package size={20} />, label: 'Pending Dispatch', value: loading ? '—' : pending },
          { id: 'inv-metric-total', icon: <Package size={20} />, label: 'Total Shipments', value: loading ? '—' : shipments.length },
        ].map((m) => (
          <Card key={m.id} id={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</span>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--wp-font-display)', marginTop: 6, color: 'var(--wp-stone-900)' }}>{m.value}</div>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12, color: 'var(--wp-stone-600)' }}>{m.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Shipments Table */}
      <Card style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map((n) => <Skeleton key={n} style={{ height: 44, borderRadius: 6 }} />)}
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH style={headerStyle}>Shipment Ref</TH>
                <TH style={headerStyle}>Order ID</TH>
                <TH style={headerStyle}>Tracking</TH>
                <TH style={headerStyle}>Status</TH>
                <TH style={headerStyle}>Created</TH>
              </TR>
            </THead>
            <TBody>
              {shipments.length === 0 ? (
                <TR>
                  <TD colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--wp-stone-400)', fontSize: 14 }}>
                    No shipments yet. Complete the Ship step in the Sell workflow.
                  </TD>
                </TR>
              ) : shipments.map((s) => {
                const { bg, color } = STATUS_COLORS[s.status] ?? STATUS_COLORS.draft;
                return (
                  <TR key={s.id}>
                    <TD style={{ fontWeight: 700, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-accent)' }}>{s.ref_number}</TD>
                    <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)' }}>{s.order_id.slice(0, 8)}…</TD>
                    <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)' }}>{s.tracking_number ?? '—'}</TD>
                    <TD>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 600 }}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </TD>
                    <TD style={{ fontSize: 13, color: 'var(--wp-stone-500)' }}>{new Date(s.created_at).toLocaleDateString()}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
