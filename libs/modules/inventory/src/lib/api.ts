// @bes/modules-inventory — API Hook
import { useMemo } from 'react';
import type { InventoryShipment } from './types';

const API_BASE = '/api/v1';
const getToken = () => localStorage.getItem('bes_token') ?? '';
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export async function fetchShipments(): Promise<InventoryShipment[]> {
  const res = await fetch(`${API_BASE}/inventory/shipments`, { headers: getHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function createShipment(payload: {
  order_id: string;
  line_items: Array<{ product_id: string; qty: string }>;
  tracking_number?: string;
}): Promise<{ id: string; ref_number: string }> {
  const res = await fetch(`${API_BASE}/inventory/shipments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Shipment creation failed');
  const json = await res.json();
  return { id: json.data.id, ref_number: json.data.ref_number };
}

export async function dispatchShipment(shipmentId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/inventory/shipments/${shipmentId}/dispatch`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Shipment dispatch failed');
}

export function useInventoryApi() {
  return useMemo(() => ({ fetchShipments, createShipment, dispatchShipment }), []);
}
