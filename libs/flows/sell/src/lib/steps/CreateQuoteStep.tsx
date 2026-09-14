import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, Card } from '@bes/shared-ui';
import { CustomerSelect } from '@bes/modules-sales';
import { LineItemsTable } from '@bes/modules-sales';
import { useSellStore } from '@bes/modules-sales';
import { createQuotation, toApiLineItems } from '@bes/modules-sales';

interface CreateQuoteStepProps {
  onNext: () => void;
}

/**
 * CreateQuoteStep — Step 1 of the Sell flow.
 *
 * Lets the user pick a customer and define line items, then posts
 * a quotation to the backend and advances to Confirm Order.
 */
export const CreateQuoteStep: React.FC<CreateQuoteStepProps> = ({ onNext }) => {
  const {
    customer, lineItems, creditWarning,
    setCustomer, setLineItems, setQuotationId, setActiveStep,
  } = useSellStore();

  const [isSaving, setIsSaving] = React.useState(false);

  const handleCreateQuote = async () => {
    if (!customer || lineItems.length === 0) return;
    setIsSaving(true);
    try {
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      const { id, ref_number } = await createQuotation({
        customer_id: customer.id,
        valid_until: validUntil,
        line_items: toApiLineItems(lineItems),
      });

      setQuotationId(id, ref_number);
      setActiveStep('confirm_order');
      onNext();
    } catch (e) {
      console.error(e);
      alert('Failed to create quotation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = !!customer && lineItems.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Customer Selection */}
      <Card>
        <h3 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: 'var(--wp-stone-900)' }}>
          Select Customer
        </h3>
        <CustomerSelect
          value={customer}
          onSelect={setCustomer}
          creditWarning={creditWarning}
        />
      </Card>

      {/* Line Items */}
      <Card>
        <h3 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: 'var(--wp-stone-900)' }}>
          Line Items
        </h3>
        <LineItemsTable items={lineItems} onChange={setLineItems} />
      </Card>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          id="create-quote-btn"
          variant="primary"
          disabled={!canProceed || isSaving}
          onClick={handleCreateQuote}
          style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}
        >
          {isSaving ? 'Creating Quote…' : 'Create Quote'}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CreateQuoteStep;
