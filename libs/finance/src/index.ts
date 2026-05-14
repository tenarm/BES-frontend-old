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

}
