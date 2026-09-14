// @bes/modules-inventory — Domain Types

export interface InventoryShipmentLine {
  product_id: string;
  product_name?: string;
  qty: string; // Decimal string
}

export interface InventoryShipment {
  id: string;
  ref_number: string;
  order_id: string;
  order_ref?: string;
  status: 'draft' | 'dispatched' | 'cancelled';
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}
