import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Table, THead, TBody, TR, TH, TD } from '@bes/shared-ui';
import { fetchProducts } from '../api';
import type { LineItem, Product } from '../types';

interface LineItemsTableProps {
  /** Current line items in the order/quotation. */
  items: LineItem[];
  /** Called when the items array changes. */
  onChange: (items: LineItem[]) => void;
}

/**
 * LineItemsTable — Inline editable table for order/quotation line items.
 *
 * Features:
 * - Product selector dropdown per row (fetched from /api/v1/products)
 * - Qty, unit price, discount, tax rate inputs
 * - Computed line total per row
 * - Totals footer: subtotal, tax, grand total (all 4dp)
 * - Add / Remove row actions
 */
export const LineItemsTable: React.FC<LineItemsTableProps> = ({ items, onChange }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const addRow = () => {
    if (products.length === 0) return;
    const first = products[0];
    const newItem: LineItem = {
      product_id: first.id,
      product_name: first.name,
      sku: first.sku,
      qty: 1,
      unit_price: parseFloat(first.base_price),
      discount_amount: 0,
      tax_rate: 0,
      line_total: parseFloat(first.base_price),
    };
    onChange([...items, newItem]);
  };

  const removeRow = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, field: keyof LineItem, rawValue: string) => {
    const updated = items.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item };

      if (field === 'product_id') {
        const prod = products.find((p) => p.id === rawValue);
        if (prod) {
          updated.product_id = prod.id;
          updated.product_name = prod.name;
          updated.sku = prod.sku;
          updated.unit_price = parseFloat(prod.base_price);
        }
      } else if (field === 'qty') {
        updated.qty = Math.max(1, parseInt(rawValue) || 1);
      } else if (field === 'unit_price') {
        updated.unit_price = parseFloat(rawValue) || 0;
      } else if (field === 'discount_amount') {
        updated.discount_amount = parseFloat(rawValue) || 0;
      } else if (field === 'tax_rate') {
        updated.tax_rate = Math.min(1, parseFloat(rawValue) || 0);
      }

      // Recalculate line total
      const lineBase = updated.qty * updated.unit_price - updated.discount_amount;
      updated.line_total = lineBase + lineBase * updated.tax_rate;
      return updated;
    });
    onChange(updated);
  };

  // Summary totals
  let subtotal = 0, totalTax = 0;
  items.forEach((l) => {
    const base = l.qty * l.unit_price - l.discount_amount;
    subtotal += base;
    totalTax += base * l.tax_rate;
  });
  const grandTotal = (subtotal + totalTax).toFixed(4);

  const inputStyle: React.CSSProperties = {
    padding: '5px 8px', border: '1px solid var(--wp-stone-200)',
    borderRadius: 5, fontSize: 13, width: '100%',
    boxSizing: 'border-box', outline: 'none',
  };

  return (
    <div>
      <Table style={{ fontSize: 13 }}>
        <THead>
          <TR>
            <TH>Product</TH>
            <TH style={{ width: 70 }}>Qty</TH>
            <TH style={{ width: 100 }}>Unit Price</TH>
            <TH style={{ width: 100 }}>Discount</TH>
            <TH style={{ width: 80 }}>Tax %</TH>
            <TH style={{ width: 110 }}>Line Total</TH>
            <TH style={{ width: 40 }}>{''}</TH>
          </TR>
        </THead>
        <TBody>
          {items.length === 0 && (
            <TR>
              <TD colSpan={7} style={{ textAlign: 'center', color: 'var(--wp-stone-400)', padding: '20px 0' }}>
                No items — click "Add Item" to start
              </TD>
            </TR>
          )}
          {items.map((item, idx) => (
            <TR key={`${item.product_id}-${idx}`}>
              {/* Product picker */}
              <TD>
                <select
                  id={`line-item-product-${idx}`}
                  value={item.product_id}
                  onChange={(e) => updateField(idx, 'product_id', e.target.value)}
                  style={{ ...inputStyle, background: 'white' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </TD>
              <TD>
                <input
                  id={`line-item-qty-${idx}`}
                  type="number" min={1}
                  value={item.qty}
                  onChange={(e) => updateField(idx, 'qty', e.target.value)}
                  style={inputStyle}
                />
              </TD>
              <TD>
                <input
                  id={`line-item-price-${idx}`}
                  type="number" min={0} step="0.0001"
                  value={item.unit_price}
                  onChange={(e) => updateField(idx, 'unit_price', e.target.value)}
                  style={inputStyle}
                />
              </TD>
              <TD>
                <input
                  id={`line-item-discount-${idx}`}
                  type="number" min={0} step="0.0001"
                  value={item.discount_amount}
                  onChange={(e) => updateField(idx, 'discount_amount', e.target.value)}
                  style={inputStyle}
                />
              </TD>
              <TD>
                <input
                  id={`line-item-tax-${idx}`}
                  type="number" min={0} max={1} step="0.01"
                  value={item.tax_rate}
                  onChange={(e) => updateField(idx, 'tax_rate', e.target.value)}
                  style={inputStyle}
                  placeholder="0.18"
                />
              </TD>
              <TD style={{ fontWeight: 600, color: 'var(--wp-stone-800)' }}>
                {item.line_total.toFixed(4)}
              </TD>
              <TD>
                <button
                  id={`line-item-remove-${idx}`}
                  onClick={() => removeRow(idx)}
                  aria-label={`Remove line ${idx + 1}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--wp-stone-400)', padding: 4, borderRadius: 4,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      {/* Add row + totals */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 14, gap: 16 }}>
        <button
          id="add-line-item-btn"
          onClick={addRow}
          disabled={products.length === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 7,
            border: '1px dashed var(--wp-stone-300)',
            background: 'transparent', cursor: 'pointer',
            fontSize: 13, color: 'var(--wp-stone-600)', fontWeight: 500,
          }}
        >
          <Plus size={14} /> Add Item
        </button>

        {/* Totals */}
        <div style={{
          background: 'var(--wp-stone-50)', borderRadius: 8, padding: '12px 16px',
          minWidth: 220, fontSize: 13,
        }}>
          {[
            { label: 'Subtotal', value: subtotal.toFixed(4) },
            { label: 'Tax', value: totalTax.toFixed(4) },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--wp-stone-600)' }}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontWeight: 700, fontSize: 15, color: 'var(--wp-stone-900)',
            borderTop: '1px solid var(--wp-stone-200)', paddingTop: 8, marginTop: 4,
          }}>
            <span>Total</span>
            <span>{grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemsTable;
