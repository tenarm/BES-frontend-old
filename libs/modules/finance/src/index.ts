// @bes/modules-finance — Public API
import { ComponentRegistry } from '@bes/shared-ui';

export type { FinanceInvoice, FinanceInvoiceLine, FinancePayment } from './lib/types';
export { useFinanceApi, fetchInvoices, createInvoice, issueInvoice, fetchPayments, recordPayment } from './lib/api';
export { InvoiceSummary } from './lib/components/InvoiceSummary';
export { PaymentForm } from './lib/components/PaymentForm';

/**
 * initFinanceModule — called by auth-store.ts on login when `finance`
 * module is active. Registers Module_Finance in ComponentRegistry.
 */
export function initFinanceModule() {
  ComponentRegistry.registerLazy(
    'Module_Finance',
    () => import('./lib/pages/FinanceModulePage')
  );
}
