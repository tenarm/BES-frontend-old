import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@bes/shared-ui';
import { computeTotals } from '../api';
import type { Customer, LineItem } from '../types';

interface OrderSummaryCardProps {
  customer: Customer;
  lineItems: LineItem[];
  paymentTerms: string;
  onPaymentTermsChange?: (terms: string) => void;
  creditWarning?: boolean;
  /** If true, payment terms selector is read-only */
  readOnly?: boolean;
}

const PAYMENT_TERM_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt'];

/**
 * OrderSummaryCard — Read-only order review panel with optional payment terms selector.
 *
 * Used in: ConfirmOrderStep (editable), GenerateInvoiceStep (read-only).
 */
export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  customer,
  lineItems,
  paymentTerms,
  onPaymentTermsChange,
  creditWarning = false,
  readOnly = false,
}) => {
  const totals = computeTotals(lineItems);

  const fieldStyle: React.CSSProperties = {
    fontSize: 13,
    color: 'var(--wp-stone-500)',
    marginBottom: 2,
    fontWeight: 500,
  };
  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    color: 'var(--wp-stone-900)',
    fontWeight: 600,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Credit Warning Banner */}
      {creditWarning && (
        <div
          role="alert"
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 14px',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: 8, fontSize: 13, color: '#92400e',
          }}
        >
          <AlertCircle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <strong>Credit limit warning.</strong> This customer's outstanding balance
            is approaching or exceeding their credit limit. You can continue, but
            consider requesting a deposit.
          </div>
        </div>
      )}

      {/* Customer Info */}
      <div style={{
        background: 'var(--wp-stone-50)', borderRadius: 10, padding: '16px 18px',
        border: '1px solid var(--wp-stone-100)',
      }}>
        <div style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--wp-stone-900)' }}>
          Customer
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
          <div>
            <div style={fieldStyle}>Name</div>
            <div style={valueStyle}>{customer.name}</div>
          </div>
          {customer.primary_email && (
            <div>
              <div style={fieldStyle}>Email</div>
              <div style={valueStyle}>{customer.primary_email}</div>
            </div>
          )}
          <div>
            <div style={fieldStyle}>Credit Limit</div>
            <div style={valueStyle}>{parseFloat(customer.credit_limit).toFixed(4)}</div>
          </div>
          <div>
            <div style={fieldStyle}>Outstanding Balance</div>
            <div style={{ ...valueStyle, color: creditWarning ? '#92400e' : 'var(--wp-stone-900)' }}>
              {parseFloat(customer.outstanding_balance).toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div style={{
        background: 'var(--wp-stone-50)', borderRadius: 10, padding: '16px 18px',
        border: '1px solid var(--wp-stone-100)',
      }}>
        <div style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--wp-stone-900)' }}>
          Payment Terms
        </div>
        {readOnly ? (
          <Badge variant="default">{paymentTerms}</Badge>
        ) : (
          <select
            id="payment-terms-select"
            value={paymentTerms}
            onChange={(e) => onPaymentTermsChange?.(e.target.value)}
            style={{
              padding: '9px 12px', borderRadius: 7,
              border: '1px solid var(--wp-stone-200)', fontSize: 13,
              background: 'white', cursor: 'pointer', outline: 'none',
            }}
          >
            {PAYMENT_TERM_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}
      </div>

      {/* Line Items Summary */}
      <div style={{
        background: 'var(--wp-stone-50)', borderRadius: 10, padding: '16px 18px',
        border: '1px solid var(--wp-stone-100)',
      }}>
        <div style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--wp-stone-900)' }}>
          Order Lines ({lineItems.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lineItems.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 13, padding: '6px 0',
              borderBottom: idx < lineItems.length - 1 ? '1px solid var(--wp-stone-100)' : 'none',
            }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--wp-stone-900)' }}>{item.product_name}</span>
                <span style={{ color: 'var(--wp-stone-400)', marginLeft: 6 }}>×{item.qty}</span>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--wp-stone-800)' }}>
                {item.line_total.toFixed(4)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--wp-stone-200)' }}>
          {[
            { label: 'Subtotal', value: totals.subtotal },
            { label: 'Tax', value: totals.tax },
          ].map((row) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, color: 'var(--wp-stone-600)', marginBottom: 6,
            }}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 16, fontWeight: 800,
            color: 'var(--wp-stone-900)', marginTop: 6,
            fontFamily: 'var(--wp-font-display)',
          }}>
            <span>Total</span>
            <span>{totals.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
