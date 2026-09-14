import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card } from '@bes/shared-ui';
import { OrderSummaryCard } from '@bes/modules-sales';
import { useSellStore } from '@bes/modules-sales';
import { createOrder, confirmOrder, toApiLineItems } from '@bes/modules-sales';

interface ConfirmOrderStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * ConfirmOrderStep — Step 2 of the Sell flow.
 *
 * Shows the order summary (customer, lines, totals) and payment terms.
 * Creates + immediately confirms the sales order on the backend.
 */
export const ConfirmOrderStep: React.FC<ConfirmOrderStepProps> = ({ onNext, onBack }) => {
  const {
    customer, lineItems, paymentTerms, quotationId, creditWarning,
    setPaymentTerms, setOrderId, setCreditWarning, setActiveStep,
  } = useSellStore();

  const [isSaving, setIsSaving] = React.useState(false);

  const handleConfirm = async () => {
    if (!customer || lineItems.length === 0) return;
    setIsSaving(true);
    try {
      const { id, ref_number, credit_warning } = await createOrder({
        customer_id: customer.id,
        payment_terms: paymentTerms,
        ...(quotationId ? { quotation_id: quotationId } : {}),
        line_items: toApiLineItems(lineItems),
      });

      setOrderId(id, ref_number);
      setCreditWarning(credit_warning);

      await confirmOrder(id);
      setActiveStep('ship_order');
      onNext();
    } catch (e) {
      console.error(e);
      alert('Failed to confirm order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!customer) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <h3 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 15, fontWeight: 700, margin: '0 0 18px', color: 'var(--wp-stone-900)' }}>
          Review &amp; Confirm Order
        </h3>
        <OrderSummaryCard
          customer={customer}
          lineItems={lineItems}
          paymentTerms={paymentTerms}
          onPaymentTermsChange={setPaymentTerms}
          creditWarning={creditWarning}
        />
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button id="confirm-back-btn" variant="secondary" onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button id="confirm-order-btn" variant="primary" disabled={isSaving} onClick={handleConfirm}
          style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
          {isSaving ? 'Confirming…' : 'Confirm Order'}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ConfirmOrderStep;
