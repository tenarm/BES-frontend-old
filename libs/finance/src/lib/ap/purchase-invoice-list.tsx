import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { Button, Table, THead, TBody, TR, TH, TD, Skeleton, Badge } from '@bes/shared-ui';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const PurchaseInvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/finance/purchase-invoices`);
      const json = await res.json();
      setInvoices(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Unpaid': return 'error';
      case 'Partially Paid': return 'warning';
      case 'Draft': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-lg)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--ui-text-xl)', fontWeight: '700', color: 'var(--ui-gray-900)', margin: 0 }}>Purchase Invoices</h2>
          <p style={{ fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-500)', marginTop: '4px' }}>Record and track bills from your vendors.</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus size={16} style={{ marginRight: '4px' }} /> Record Invoice
        </Button>
      </header>

      <div style={{ background: 'var(--ui-white)', borderRadius: 'var(--ui-radius-lg)', border: '1px solid var(--ui-gray-200)', overflow: 'hidden' }}>
        <Table>
          <THead style={{ background: 'var(--ui-gray-50)' }}>
            <TR>
              <TH>Invoice #</TH>
              <TH>Vendor</TH>
              <TH>Date</TH>
              <TH>Due Date</TH>
              <TH>Total Amount</TH>
              <TH>Outstanding</TH>
              <TH>Status</TH>
              <TH style={{ width: '48px' }}></TH>
            </TR>
          </THead>
          <TBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TR key={i}>
                  <TD><Skeleton width="100px" /></TD>
                  <TD><Skeleton width="150px" /></TD>
                  <TD><Skeleton width="90px" /></TD>
                  <TD><Skeleton width="90px" /></TD>
                  <TD><Skeleton width="80px" /></TD>
                  <TD><Skeleton width="80px" /></TD>
                  <TD><Skeleton width="70px" /></TD>
                  <TD><Skeleton width="24px" /></TD>
                </TR>
              ))
            ) : invoices.length === 0 ? (
              <TR>
                <TD colSpan={8} style={{ textAlign: 'center', padding: 'var(--ui-spacing-xl) 0', color: 'var(--ui-gray-400)' }}>
                  <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <p>No purchase invoices found.</p>
                </TD>
              </TR>
            ) : (
              invoices.map(invoice => (
                <TR key={invoice.id} style={{ borderBottom: '1px solid var(--ui-gray-100)' }}>
                  <TD style={{ fontWeight: '600' }}>{invoice.invoice_number}</TD>
                  <TD>{invoice.vendor_id}</TD>
                  <TD>{invoice.date}</TD>
                  <TD>{invoice.due_date || '-'}</TD>
                  <TD>${parseFloat(invoice.total_amount).toLocaleString()}</TD>
                  <TD style={{ color: parseFloat(invoice.outstanding_amount) > 0 ? 'var(--ui-error)' : 'inherit' }}>
                    ${parseFloat(invoice.outstanding_amount).toLocaleString()}
                  </TD>
                  <TD>
                    <Badge variant={getStatusColor(invoice.status) as any}>{invoice.status}</Badge>
                  </TD>
                  <TD>
                    <button style={{ background: 'none', border: 'none', color: 'var(--ui-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="View Process Chain">
                      <ExternalLink size={16} />
                    </button>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>
    </div>
  );
};
