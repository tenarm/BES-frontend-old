import React, { useState } from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useProcessStore } from '../../../../shared-ui/src/lib/process/process-store';
import { Button, Input, FeedbackAlert } from '@bes/shared-ui';

interface CreditOverrideModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export const CreditOverrideModal: React.FC<CreditOverrideModalProps> = ({ onComplete, onClose }) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const activeProcess = useProcessStore((s) => s.activeProcess);
  const addEvent = useProcessStore((s) => s.addEvent);

  const [justification, setJustification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOverride = async () => {
    if (!justification.trim()) {
      setErrorMsg('Please enter a signed justification comment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('bes_token');
      const orderId = activeProcess?.entityId || crypto.randomUUID();

      // We can use a mock customer ID or fallback if no real customer is selected,
      // but let's assume we find a mock customer ID.
      const mockCustomerId = 'b5df8917-93e9-414d-9a78-5a46d1fd8a46';

      const res = await fetch(`/api/v1/sales/customers/credit-override/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: mockCustomerId
        })
      });

      if (!res.ok) {
        throw new Error('Failed to authorize override');
      }

      // Advance the process stepper by adding the status event
      const authorizer = currentUser?.full_name || currentUser?.username || 'CFO Manager';
      addEvent('CUSTOMER_CREDIT_RELEASED', authorizer, { justification });

      onComplete();
    } catch (e: any) {
      setErrorMsg(e.message || 'Verification of override credentials failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          Authorizing release for blocked Sales Order ID:
        </p>
        <code style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
          {activeProcess?.entityId || 'SO-882-MOCK'}
        </code>
      </div>

      {errorMsg && (
        <FeedbackAlert variant="warning" title="Authorization Denied">
          {errorMsg}
        </FeedbackAlert>
      )}

      {/* Receivables Aging and payment history display */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Ledger Aging Buckets</span>
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Breached Limit</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
          <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>0-30 Days</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>$12,450</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>31-60 Days</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>$8,900</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>61-90 Days</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>$6,100</div>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>90+ Days</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c' }}>$24,850</div>
          </div>
        </div>
      </div>

      <Input
        label="Manager Justification / Comments"
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="e.g. Accounts paid; credit release approved by regional CFO."
        required
        disabled={isSubmitting}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleOverride} disabled={isSubmitting}>
          {isSubmitting ? 'Authorizing Override...' : 'Approve Override & Release'}
        </Button>
      </div>
    </div>
  );
};
