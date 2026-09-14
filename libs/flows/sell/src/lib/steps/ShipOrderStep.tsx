import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card } from '@bes/shared-ui';
import { ShipmentForm } from '@bes/modules-inventory';
import { useSellStore } from '@bes/modules-sales';
import { createShipment, dispatchShipment } from '@bes/modules-inventory';

interface ShipOrderStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * ShipOrderStep — Step 3 of the Sell flow.
 *
 * Uses ShipmentForm from @bes/modules-inventory.
 * Creates a shipment and dispatches it, or skips to invoicing for digital/service orders.
 */
export const ShipOrderStep: React.FC<ShipOrderStepProps> = ({ onNext, onBack }) => {
  const {
    orderId, lineItems,
    setShipmentId, setActiveStep,
  } = useSellStore();

  const [tracking, setTracking] = useState('');
  const [shipItems, setShipItems] = useState<Array<{
    product_id: string;
    product_name: string;
    sku: string;
    ordered_qty: number;
    ship_qty: number;
  }>>(() =>
    lineItems.map((l) => ({
      product_id: l.product_id,
      product_name: l.product_name,
      sku: l.sku,
      ordered_qty: l.qty,
      ship_qty: l.qty,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleShip = async () => {
    if (!orderId) return;
    setIsSaving(true);
    try {
      const payload = {
        order_id: orderId,
        line_items: shipItems.map((i: { product_id: string; ship_qty: number }) => ({
          product_id: i.product_id,
          qty: i.ship_qty.toString(),
        })),
        ...(tracking ? { tracking_number: tracking } : {}),
      };

      const { id, ref_number } = await createShipment(payload);
      await dispatchShipment(id);
      setShipmentId(id, ref_number);
      setActiveStep('generate_invoice');
      onNext();
    } catch (e) {
      console.error(e);
      alert('Failed to dispatch shipment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    setActiveStep('generate_invoice');
    onNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <h3 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 15, fontWeight: 700, margin: '0 0 18px', color: 'var(--wp-stone-900)' }}>
          Ship Order
        </h3>
        <ShipmentForm
          lineItems={lineItems}
          trackingNumber={tracking}
          onTrackingChange={setTracking}
          onShipItemsChange={setShipItems}
          onSkip={handleSkip}
        />
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button id="ship-back-btn" variant="secondary" onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button id="ship-dispatch-btn" variant="primary" disabled={isSaving} onClick={handleShip}
          style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
          {isSaving ? 'Dispatching…' : 'Dispatch Shipment'}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ShipOrderStep;
