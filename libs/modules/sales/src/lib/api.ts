// ============================================================
// @bes/modules-sales — API Hook
// All HTTP calls for the Sales module in one place.
// Used by: sell flow steps, SalesModulePage, CustomerSelect.
// ============================================================

import { useMemo } from 'react';
import type { Customer, Product, SalesQuotation, SalesOrder, LineItem } from './types';

const API_BASE = '/api/v1';

/** Read the auth token from localStorage (canonical key per Rule 2 §9). */
const getToken = () => localStorage.getItem('bes_token') ?? '';

/** Build standard auth + JSON headers. */
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

/** Auth-only headers (for GET requests). */
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// ---- Customers -----------------------------------------------------------

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function createCustomer(payload: {
  name: string;
  primary_email?: string | null;
  tax_id?: string | null;
  credit_limit: string;
  outstanding_balance: string;
}): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  const json = await res.json();
  return json.data;
}

// ---- Products ------------------------------------------------------------

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

// ---- Quotations ----------------------------------------------------------

export async function fetchQuotations(): Promise<SalesQuotation[]> {
  const res = await fetch(`${API_BASE}/sales/quotations`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function createQuotation(payload: {
  customer_id: string;
  valid_until: string;
  line_items: Array<{
    product_id: string;
    qty: string;
    unit_price: string;
    discount_amount: string;
    tax_rate: string;
  }>;
}): Promise<{ id: string; ref_number: string }> {
  const res = await fetch(`${API_BASE}/sales/quotations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Quotation creation failed');
  const json = await res.json();
  return { id: json.data.id, ref_number: json.data.ref_number };
}

// ---- Orders --------------------------------------------------------------

export async function fetchOrders(): Promise<SalesOrder[]> {
  const res = await fetch(`${API_BASE}/sales/orders`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function createOrder(payload: {
  customer_id: string;
  payment_terms: string;
  quotation_id?: string;
  line_items: Array<{
    product_id: string;
    qty: string;
    unit_price: string;
    discount_amount: string;
    tax_rate: string;
  }>;
}): Promise<{ id: string; ref_number: string; credit_warning: boolean }> {
  const res = await fetch(`${API_BASE}/sales/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Order creation failed');
  const json = await res.json();
  return {
    id: json.data.id,
    ref_number: json.data.ref_number,
    credit_warning: json.data.credit_warning ?? false,
  };
}

export async function confirmOrder(orderId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/sales/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Order confirmation failed');
}

// ---- Utility: build line item API payload from LineItem[] ---------------

export function toApiLineItems(lineItems: LineItem[]) {
  return lineItems.map((l) => ({
    product_id: l.product_id,
    qty: l.qty.toString(),
    unit_price: l.unit_price.toString(),
    discount_amount: l.discount_amount.toString(),
    tax_rate: l.tax_rate.toString(),
  }));
}

// ---- Utility: compute order totals from LineItem[] ----------------------

export function computeTotals(lineItems: LineItem[]) {
  let subtotal = 0;
  let tax = 0;
  lineItems.forEach((l) => {
    const lineTotal = l.qty * l.unit_price - l.discount_amount;
    subtotal += lineTotal;
    tax += lineTotal * l.tax_rate;
  });
  return {
    subtotal: subtotal.toFixed(4),
    tax: tax.toFixed(4),
    total: (subtotal + tax).toFixed(4),
  };
}

/**
 * useSalesApi — convenience hook that re-exports all sales API functions
 * bound to the current auth context. Use this in components.
 */
export function useSalesApi() {
  return useMemo(
    () => ({
      fetchCustomers,
      createCustomer,
      fetchProducts,
      fetchQuotations,
      createQuotation,
      fetchOrders,
      createOrder,
      confirmOrder,
      toApiLineItems,
      computeTotals,
    }),
    []
  );
}
