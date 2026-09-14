// @bes/modules-finance — API Hook
import { useMemo } from 'react';
import type { FinanceInvoice, FinancePayment } from './types';

const API_BASE = '/api/v1';
const getToken = () => localStorage.getItem('bes_token') ?? '';
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export async function fetchInvoices(): Promise<FinanceInvoice[]> {
  const res = await fetch(`${API_BASE}/finance/invoices`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function createInvoice(payload: {
  order_id: string;
  customer_id: string;
  due_date: string;
  line_items: Array<{
    product_id: string;
    qty: string;
    unit_price: string;
    discount_amount: string;
    tax_rate: string;
  }>;
}): Promise<{ id: string; ref_number: string }> {
  const res = await fetch(`${API_BASE}/finance/invoices`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Invoice creation failed');
  const json = await res.json();
  return { id: json.data.id, ref_number: json.data.ref_number };
}

export async function issueInvoice(invoiceId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/finance/invoices/${invoiceId}/issue`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Invoice issue failed');
}

export async function fetchPayments(): Promise<FinancePayment[]> {
  const res = await fetch(`${API_BASE}/finance/payments`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function recordPayment(payload: {
  invoice_id: string;
  amount: string;
  payment_method: string;
}): Promise<{ id: string; ref_number: string }> {
  const res = await fetch(`${API_BASE}/finance/payments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Payment recording failed');
  const json = await res.json();
  return { id: json.data.id, ref_number: json.data.ref_number };
}

export function useFinanceApi() {
  return useMemo(() => ({
    fetchInvoices, createInvoice, issueInvoice,
    fetchPayments, recordPayment,
  }), []);
}
