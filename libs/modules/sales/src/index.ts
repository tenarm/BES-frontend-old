// @bes/modules-sales — Public API
// Everything exported here is available to:
//   - libs/flows/sell (step components)
//   - libs/data-hub/customers (customer enrichment)
//   - Future flows (Buy, Projects) that need customer/product selects

import { ComponentRegistry } from '@bes/shared-ui';

// ---- Types ----------------------------------------------------------------
export type {
  Customer,
  Product,
  LineItem,
  SalesQuotation,
  SalesOrder,
  SellStep,
  SellFlowState,
  OrderTotals,
} from './lib/types';

// ---- Store ----------------------------------------------------------------
export { useSellStore } from './lib/sell-store';

// ---- API ------------------------------------------------------------------
export {
  useSalesApi,
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
} from './lib/api';

// ---- Reusable Components --------------------------------------------------
export { CustomerSelect } from './lib/components/CustomerSelect';
export { LineItemsTable } from './lib/components/LineItemsTable';
export { OrderSummaryCard } from './lib/components/OrderSummaryCard';

// ---- Module Initializer ---------------------------------------------------
/**
 * initSalesModule — called by auth-store.ts on login when the `sales`
 * module is active. Registers the Module_Sales page in the ComponentRegistry
 * so the shell can render it when "Sales" is clicked in the MODULES sidebar.
 */
export function initSalesModule() {
  ComponentRegistry.registerLazy(
    'Module_Sales',
    () => import('./lib/pages/SalesModulePage')
  );
}
