import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card } from '@bes/shared-ui';
import { InvoiceSummary } from '@bes/modules-finance';
import { useSellStore } from '@bes/modules-sales';
import { createInvoice, issueInvoice } from '@bes/modules-finance';
import { toApiLineItems } from '@bes/modules-sales';

interface GenerateInvoiceStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * GenerateInvoiceStep — Step 4 of the Sell flow.
 *
 * Uses InvoiceSummary from @bes/modules-finance.
 * Creates and issues an invoice against the confirmed sales order.
 */
export const GenerateInvoiceStep: React.FC<GenerateInvoiceStepProps> = ({ onNext, onBack }) => {
  const {
    orderId, customer, lineItems,
    setInvoiceId, setActiveStep,
  } = useSellStore();

  const defaultDue = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const [dueDate, setDueDate] = useState(defaultDue);
  const [isSaving, setIsSaving] = useState(false);

  const handleIssue = async () => {
    if (!orderId || !customer) return;
    setIsSaving(true);
    try {
      const { id, ref_number } = await createInvoice({
        order_id: orderId,
        customer_id: customer.id,
        due_date: dueDate,
        line_items: toApiLineItems(lineItems),
      });
      await issueInvoice(id);
      setInvoiceId(id, ref_number);
      setActiveStep('collect_payment');
      onNext();
    } catch (e) {
      console.error(e);
      alert('Failed to issue invoice. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <h3 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 15, fontWeight: 700, margin: '0 0 18px', color: 'var(--wp-stone-900)' }}>
          Generate Invoice
        </h3>
        <InvoiceSummary
          lineItems={lineItems}
          dueDate={dueDate}
          onDueDateChange={setDueDate}
        />
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button id="invoice-back-btn" variant="secondary" onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button id="issue-invoice-btn" variant="primary" disabled={isSaving} onClick={handleIssue}
          style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
          {isSaving ? 'Issuing…' : 'Issue Invoice'}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default GenerateInvoiceStep;
