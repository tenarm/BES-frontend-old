import React, { useState } from 'react';
import { Truck, Package } from 'lucide-react';
import type { LineItem } from '@bes/modules-sales';

interface ShipItem {
  product_id: string;
  product_name: string;
  sku: string;
  ordered_qty: number;
  ship_qty: number;
}

interface ShipmentFormProps {
  /** Original line items from the confirmed sales order. */
  lineItems: LineItem[];
  trackingNumber: string;
  onTrackingChange: (val: string) => void;
  onShipItemsChange: (items: ShipItem[]) => void;
  onSkip: () => void;
}

/**
 * ShipmentForm — Ship qty inputs per line item + optional tracking number.
 *
 * Used in ShipOrderStep (Sell flow). Can be reused in future flows.
 */
export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  lineItems,
  trackingNumber,
  onTrackingChange,
  onShipItemsChange,
  onSkip,
}) => {
  const [shipItems, setShipItems] = useState<ShipItem[]>(() =>
    lineItems.map((l) => ({
      product_id: l.product_id,
      product_name: l.product_name,
      sku: l.sku,
      ordered_qty: l.qty,
      ship_qty: l.qty,
    }))
  );

  const updateQty = (productId: string, newQty: number) => {
    const updated = shipItems.map((item) =>
      item.product_id === productId
        ? { ...item, ship_qty: Math.max(0, Math.min(item.ordered_qty, newQty)) }
        : item
    );
    setShipItems(updated);
    onShipItemsChange(updated);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-600)', display: 'block', marginBottom: 4,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Shipment Lines */}
      <div style={{ background: 'var(--wp-stone-50)', borderRadius: 10, padding: 18, border: '1px solid var(--wp-stone-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Package size={16} color="var(--wp-stone-600)" />
          <span style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--wp-stone-900)' }}>
            Shipment Lines
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shipItems.map((item) => (
            <div key={item.product_id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '12px 14px', background: 'white', borderRadius: 8,
              border: '1px solid var(--wp-stone-100)',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--wp-stone-900)' }}>{item.product_name}</div>
                <div style={{ fontSize: 12, color: 'var(--wp-stone-400)', marginTop: 2 }}>{item.sku}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 80 }}>
                <div style={{ fontSize: 12, color: 'var(--wp-stone-500)', marginBottom: 4 }}>Ordered: {item.ordered_qty}</div>
                <input
                  id={`ship-qty-${item.product_id}`}
                  type="number"
                  min={0}
                  max={item.ordered_qty}
                  value={item.ship_qty}
                  onChange={(e) => updateQty(item.product_id, parseInt(e.target.value) || 0)}
                  aria-label={`Ship quantity for ${item.product_name}`}
                  style={{
                    width: 70, padding: '6px 8px', textAlign: 'right',
                    border: '1px solid var(--wp-stone-200)', borderRadius: 6, fontSize: 13, outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--wp-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--wp-stone-200)')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Number */}
      <div style={{ background: 'var(--wp-stone-50)', borderRadius: 10, padding: 18, border: '1px solid var(--wp-stone-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Truck size={16} color="var(--wp-stone-600)" />
          <span style={{ fontFamily: 'var(--wp-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--wp-stone-900)' }}>
            Tracking
          </span>
        </div>
        <label htmlFor="tracking-number" style={labelStyle}>Tracking Number (optional)</label>
        <input
          id="tracking-number"
          type="text"
          placeholder="e.g. 1Z999AA10123456784"
          value={trackingNumber}
          onChange={(e) => onTrackingChange(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '9px 12px', borderRadius: 7,
            border: '1px solid var(--wp-stone-200)', fontSize: 13, outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--wp-accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--wp-stone-200)')}
        />
      </div>

      {/* Skip button for service/digital orders */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--wp-accent-muted)', borderRadius: 8 }}>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--wp-stone-700)' }}>
          <strong>Service or digital delivery?</strong> Skip shipping and go directly to invoicing.
        </div>
        <button
          id="skip-shipping-btn"
          onClick={onSkip}
          style={{
            padding: '8px 16px', borderRadius: 7,
            border: '1px solid var(--wp-accent)', background: 'transparent',
            color: 'var(--wp-accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Skip Shipping →
        </button>
      </div>
    </div>
  );
};

export default ShipmentForm;
