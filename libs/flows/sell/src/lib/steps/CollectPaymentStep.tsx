import React, { useState } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { Button, Card } from '@bes/shared-ui';
import { PaymentForm } from '@bes/modules-finance';
import { useSellStore } from '@bes/modules-sales';
import { computeTotals } from '@bes/modules-sales';
import { recordPayment } from '@bes/modules-finance';

interface CollectPaymentStepProps {
  onBack: () => void;
  onComplete: () => void;
}

/**
 * CollectPaymentStep — Step 5 (final) of the Sell flow.
 *
 * Uses PaymentForm from @bes/modules-finance.
 * Records the payment against the issued invoice and resets the flow.
 */
export const CollectPaymentStep: React.FC<CollectPaymentStepProps> = ({ onBack, onComplete }) => {
  const {
    invoiceId, lineItems, refNumbers,
    setPaymentId, resetFlow,
  } = useSellStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totals = computeTotals(lineItems);

  const handlePayment = async (method: string, amount: string) => {
    if (!invoiceId) return;
    setIsSaving(true);
    try {
      const { id, ref_number } = await recordPayment({
        invoice_id: invoiceId,
        amount,
        payment_method: method,
      });
      setPaymentId(id, ref_number);
      setIsComplete(true);
    } catch (e) {
      console.error(e);
      alert('Failed to record payment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Success screen after payment recorded
  if (isComplete) {
    return (
      <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ marginBottom: 16 }}>
          <CheckCircle size={56} color="#166534" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: 'var(--wp-stone-900)' }}>
          Payment Collected!
        </h2>
        <p style={{ color: 'var(--wp-stone-500)', fontSize: 15, margin: '0 0 4px' }}>
          Invoice {refNumbers.invoice} — paid in full.
        </p>
        <p style={{ color: 'var(--wp-stone-400)', fontSize: 14, margin: '0 0 32px' }}>
          Payment ref: {refNumbers.payment}
        </p>
        <Button
          id="sell-flow-complete-btn"
          variant="primary"
          onClick={() => { resetFlow(); onComplete(); }}
          style={{ minWidth: 180 }}
        >
          Start New Sell
        </Button>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <h3 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 15, fontWeight: 700, margin: '0 0 18px', color: 'var(--wp-stone-900)' }}>
          Collect Payment
        </h3>
        <PaymentForm
          totalDue={totals.total}
          onSubmit={handlePayment}
          isSubmitting={isSaving}
        />
      </Card>

      <div>
        <Button id="payment-back-btn" variant="secondary" onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={16} /> Back
        </Button>
      </div>
    </div>
  );
};

export default CollectPaymentStep;
