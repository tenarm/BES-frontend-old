export * from './lib/finance';

// 1. Import the registry from your shared library
import { ComponentRegistry, RESOURCE_NAMES } from '@bes/shared-ui';

export function initFinanceModule() {
  console.log('Initializing Finance Module...');

  ComponentRegistry.registerLazy('Widget_FinanceSummary', () =>
    import('./lib/finance-widget').then(m => ({ default: m.FinanceWidget }))
  );

  ComponentRegistry.registerLazy('Route_Finance', () =>
    import('./lib/finance-routes').then(m => ({ default: m.FinanceRoutes }))
  );

  ComponentRegistry.registerLazy(`Route_${RESOURCE_NAMES.coa}`, () =>
    import('./lib/coa/coa-tree').then(m => ({ default: m.ChartOfAccounts }))
  );

  ComponentRegistry.registerLazy(`Route_${RESOURCE_NAMES.gl}`, () =>
    import('./lib/gl/gl-dashboard').then(m => ({ default: m.GLDashboard }))
  );
  
  ComponentRegistry.registerLazy(`Route_${RESOURCE_NAMES.ap}`, () =>
    import('./lib/ap/ap-dashboard').then(m => ({ default: m.APDashboard }))
  );

  ComponentRegistry.registerLazy(`Route_vendors`, () =>
    import('./lib/ap/vendor-list').then(m => ({ default: m.VendorList }))
  );

  ComponentRegistry.registerLazy(`Route_purchase_invoices`, () =>
    import('./lib/ap/purchase-invoice-list').then(m => ({ default: m.PurchaseInvoiceList }))
  );

}
