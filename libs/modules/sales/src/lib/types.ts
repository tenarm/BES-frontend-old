// ============================================================
// @bes/modules-sales — Domain Types
// All TypeScript interfaces for the Sales module.
// These are shared across: flows/sell steps, SalesModulePage,
// and any future flow that touches quotations or orders.
// ============================================================

export interface Customer {
  id: string;
  name: string;
  primary_email: string | null;
  tax_id: string | null;
  credit_limit: string;       // Decimal string (4dp) e.g. "5000.0000"
  outstanding_balance: string; // Decimal string (4dp)
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  base_price: string; // Decimal string (4dp)
}

export interface LineItem {
  product_id: string;
  product_name: string;
  sku: string;
  qty: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  line_total: number;
}

export interface SalesQuotation {
  id: string;
  ref_number: string;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  customer_id: string;
  customer_name?: string;
  total_amount: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface SalesOrder {
  id: string;
  ref_number: string;
  status: 'draft' | 'confirmed' | 'shipped' | 'invoiced' | 'cancelled';
  customer_id: string;
  customer_name?: string;
  total_amount: string;
  payment_terms: string;
  credit_warning: boolean;
  cloned_from_id: string | null;
  created_at: string;
  updated_at: string;
}

/** The full shape of the active sell flow instance state. */
export type SellStep =
  | 'landing'
  | 'create_quote'
  | 'confirm_order'
  | 'ship_order'
  | 'generate_invoice'
  | 'collect_payment';

export interface SellFlowState {
  activeStep: SellStep;
  quotationId: string | null;   // camelCase — frontend store convention
  orderId: string | null;
  shipmentId: string | null;
  invoiceId: string | null;
  paymentId: string | null;
  customer: Customer | null;
  paymentTerms: string;
  lineItems: LineItem[];
  creditWarning: boolean;
  refNumbers: {
    quotation?: string;
    order?: string;
    shipment?: string;
    invoice?: string;
    payment?: string;
  };
}

/** Computed totals derived from line items. */
export interface OrderTotals {
  subtotal: string; // 4dp
  tax: string;      // 4dp
  total: string;    // 4dp
}
