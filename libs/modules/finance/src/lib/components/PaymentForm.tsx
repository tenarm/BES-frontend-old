import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  totalDue: string;
  onSubmit: (method: string, amount: string) => void;
  isSubmitting?: boolean;
}

const PAYMENT_METHODS = [
  { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { id: 'card',          label: 'Card',          icon: '💳' },
  { id: 'cash',          label: 'Cash',          icon: '💵' },
  { id: 'cheque',        label: 'Cheque',        icon: '📄' },
];

/**
 * PaymentForm — Payment method selector + amount input.
 * Pre-fills amount with the outstanding invoice total.
 */
export const PaymentForm: React.FC<PaymentFormProps> = ({ totalDue, onSubmit, isSubmitting = false }) => {
  const [method, setMethod] = useState('bank_transfer');
  const [amount, setAmount] = useState(totalDue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(method, parseFloat(amount).toFixed(4));
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Payment Method */}
      <div style={{ background: 'var(--wp-stone-50)', borderRadius: 10, padding: 18, border: '1px solid var(--wp-stone-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <CreditCard size={16} color="var(--wp-stone-600)" />
          <span style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--wp-stone-900)' }}>
            Payment Method
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} role="radiogroup" aria-label="Payment method">
          {PAYMENT_METHODS.map((pm) => (
            <label
              key={pm.id}
              htmlFor={`payment-method-${pm.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                border: `2px solid ${method === pm.id ? 'var(--wp-accent)' : 'var(--wp-stone-200)'}`,
                background: method === pm.id ? 'var(--wp-accent-muted)' : 'white',
                transition: 'all 0.15s',
              }}
            >
              <input
                id={`payment-method-${pm.id}`}
                type="radio"
                name="payment_method"
                value={pm.id}
                checked={method === pm.id}
                onChange={() => setMethod(pm.id)}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: 18 }}>{pm.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: method === pm.id ? 'var(--wp-accent)' : 'var(--wp-stone-700)' }}>
                {pm.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div style={{ background: 'var(--wp-stone-50)', borderRadius: 10, padding: 18, border: '1px solid var(--wp-stone-100)' }}>
        <label htmlFor="payment-amount" style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-600)', display: 'block', marginBottom: 8 }}>
          Amount (pre-filled with outstanding balance)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{
            padding: '10px 14px', background: 'var(--wp-stone-100)',
            border: '1px solid var(--wp-stone-200)', borderRight: 'none',
            borderRadius: '7px 0 0 7px', fontSize: 14, fontWeight: 700, color: 'var(--wp-stone-600)',
          }}>
            $
          </span>
          <input
            id="payment-amount"
            type="number"
            min="0.0001"
            step="0.0001"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              flex: 1, padding: '10px 12px',
              border: '1px solid var(--wp-stone-200)', borderRadius: '0 7px 7px 0',
              fontSize: 15, fontWeight: 600, outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--wp-accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--wp-stone-200)')}
          />
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--wp-stone-500)' }}>
          Invoice total: <strong>{totalDue}</strong>
        </div>
      </div>

      {/* Submit */}
      <button
        id="record-payment-btn"
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '14px 24px', borderRadius: 10, border: 'none',
          background: 'var(--wp-primary)', color: 'white',
          fontSize: 15, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, fontFamily: 'var(--wp-font-display)',
          transition: 'opacity 0.2s',
        }}
      >
        {isSubmitting ? 'Recording…' : '✓ Record Payment'}
      </button>
    </form>
  );
};

export default PaymentForm;
