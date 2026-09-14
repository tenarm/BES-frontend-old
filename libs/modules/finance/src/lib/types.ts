// @bes/modules-finance — Domain Types

export interface FinanceInvoiceLine {
  product_id: string;
  product_name?: string;
  qty: string;
  unit_price: string;
  discount_amount: string;
  tax_rate: string;
  line_total: string;
}

export interface FinanceInvoice {
  id: string;
  ref_number: string;
  order_id: string | null;
  customer_id: string;
  status: 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  total_amount: string;
  balance_due: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface FinancePayment {
  id: string;
  ref_number: string;
  invoice_id: string;
  amount: string;
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'cheque';
  status: 'pending' | 'captured' | 'failed' | 'refunded';
  created_at: string;
}
