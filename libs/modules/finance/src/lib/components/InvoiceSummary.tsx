import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import type { LineItem } from '@bes/modules-sales';
import { computeTotals } from '@bes/modules-sales';

interface InvoiceSummaryProps {
  lineItems: LineItem[];
  dueDate: string;
  onDueDateChange?: (date: string) => void;
  readOnly?: boolean;
  invoiceRef?: string;
}

/**
 * InvoiceSummary — Due date selector + line items totals for the invoice step.
 */
export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  lineItems,
  dueDate,
  onDueDateChange,
  readOnly = false,
  invoiceRef,
}) => {
  const totals = computeTotals(lineItems);

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-600)', display: 'block', marginBottom: 4,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {invoiceRef && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
          <FileText size={16} color="#166534" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>Invoice {invoiceRef} issued successfully</span>
        </div>
      )}

      {/* Due Date */}
      <div style={{ background: 'var(--wp-stone-50)', borderRadius: 10, padding: 18, border: '1px solid var(--wp-stone-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Calendar size={16} color="var(--wp-stone-600)" />
          <span style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--wp-stone-900)' }}>
            Due Date
          </span>
        </div>
        {readOnly ? (
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--wp-stone-900)' }}>
            {new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        ) : (
          <>
            <label htmlFor="invoice-due-date" style={labelStyle}>Payment due by</label>
            <input
              id="invoice-due-date"
              type="date"
              value={dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => onDueDateChange?.(e.target.value)}
              style={{
                padding: '9px 12px', borderRadius: 7,
                border: '1px solid var(--wp-stone-200)', fontSize: 13,
                outline: 'none', background: 'white',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--wp-accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--wp-stone-200)')}
            />
          </>
        )}
      </div>

      {/* Invoice Totals */}
      <div style={{ background: 'var(--wp-stone-50)', borderRadius: 10, padding: 18, border: '1px solid var(--wp-stone-100)' }}>
        <div style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--wp-stone-900)' }}>
          Invoice Totals
        </div>
        {[
          { label: 'Subtotal', value: totals.subtotal },
          { label: 'Tax', value: totals.tax },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--wp-stone-600)' }}>
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontWeight: 800, fontSize: 20, fontFamily: 'var(--wp-font-display)',
          color: 'var(--wp-stone-900)',
          borderTop: '1px solid var(--wp-stone-200)', paddingTop: 12, marginTop: 8,
        }}>
          <span>Total Due</span>
          <span style={{ color: 'var(--wp-accent)' }}>{totals.total}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
