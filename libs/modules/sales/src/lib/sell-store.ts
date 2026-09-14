// ============================================================
// @bes/modules-sales — Zustand Sell Flow Store
// Centralised state for the active sell flow instance.
// ============================================================

import { create } from 'zustand';
import type { Customer, LineItem, SellStep, SellFlowState } from './types';

const DRAFT_KEY = 'bes_sell_draft';

interface SellStoreState extends SellFlowState {
  // --- Actions ---
  setActiveStep: (step: SellStep) => void;
  setCustomer: (customer: Customer | null) => void;
  setLineItems: (items: LineItem[]) => void;
  addLineItem: (item: LineItem) => void;
  removeLineItem: (productId: string) => void;
  updateLineItem: (productId: string, updates: Partial<LineItem>) => void;
  setPaymentTerms: (terms: string) => void;
  setCreditWarning: (warning: boolean) => void;
  setQuotationId: (id: string, refNumber: string) => void;
  setOrderId: (id: string, refNumber: string) => void;
  setShipmentId: (id: string, refNumber: string) => void;
  setInvoiceId: (id: string, refNumber: string) => void;
  setPaymentId: (id: string, refNumber: string) => void;
  resetFlow: () => void;
  persistDraft: () => void;
  recoverDraft: () => void;
}

const DEFAULT_STATE: SellFlowState = {
  activeStep: 'landing',
  quotationId: null,
  orderId: null,
  shipmentId: null,
  invoiceId: null,
  paymentId: null,
  customer: null,
  paymentTerms: 'Net 30',
  lineItems: [],
  creditWarning: false,
  refNumbers: {},
};

export const useSellStore = create<SellStoreState>((set, get) => ({
  ...DEFAULT_STATE,

  setActiveStep: (step) => {
    set({ activeStep: step });
    if (step !== 'landing') get().persistDraft();
    else localStorage.removeItem(DRAFT_KEY);
  },

  setCustomer: (customer) => set({ customer }),

  setLineItems: (lineItems) => set({ lineItems }),

  addLineItem: (item) =>
    set((s) => ({ lineItems: [...s.lineItems, item] })),

  removeLineItem: (productId) =>
    set((s) => ({
      lineItems: s.lineItems.filter((l) => l.product_id !== productId),
    })),

  updateLineItem: (productId, updates) =>
    set((s) => ({
      lineItems: s.lineItems.map((l) =>
        l.product_id === productId ? { ...l, ...updates } : l
      ),
    })),

  setPaymentTerms: (paymentTerms) => set({ paymentTerms }),

  setCreditWarning: (creditWarning) => set({ creditWarning }),

  setQuotationId: (id, refNumber) =>
    set((s) => ({
      quotationId: id,
      refNumbers: { ...s.refNumbers, quotation: refNumber },
    })),

  setOrderId: (id, refNumber) =>
    set((s) => ({
      orderId: id,
      refNumbers: { ...s.refNumbers, order: refNumber },
    })),

  setShipmentId: (id, refNumber) =>
    set((s) => ({
      shipmentId: id,
      refNumbers: { ...s.refNumbers, shipment: refNumber },
    })),

  setInvoiceId: (id, refNumber) =>
    set((s) => ({
      invoiceId: id,
      refNumbers: { ...s.refNumbers, invoice: refNumber },
    })),

  setPaymentId: (id, refNumber) =>
    set((s) => ({
      paymentId: id,
      refNumbers: { ...s.refNumbers, payment: refNumber },
    })),

  resetFlow: () => {
    set(DEFAULT_STATE);
    localStorage.removeItem(DRAFT_KEY);
  },

  /** Persist current flow state to localStorage (auto-save draft). */
  persistDraft: () => {
    const { activeStep, quotationId, orderId, shipmentId, invoiceId,
      paymentId, customer, paymentTerms, lineItems, creditWarning, refNumbers } = get();
    const draft: SellFlowState = {
      activeStep, quotationId, orderId, shipmentId, invoiceId,
      paymentId, customer, paymentTerms, lineItems, creditWarning, refNumbers,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  },

  /** Recover a previously saved draft on page load. */
  recoverDraft: () => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const draft: SellFlowState = JSON.parse(saved);
      if (draft.activeStep && draft.activeStep !== 'landing') {
        set({ ...draft });
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  },
}));
