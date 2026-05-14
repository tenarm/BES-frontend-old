export * from './lib/finance';

// 1. Import the registry from your shared library
import { ComponentRegistry } from '@erp/shared-ui';

export function initFinanceModule() {
  console.log('Initializing Finance Module...');

  ComponentRegistry.registerLazy('Widget_FinanceSummary', () => 
    import('./lib/finance-widget').then(m => ({ default: m.FinanceWidget }))
  );
  
  ComponentRegistry.registerLazy('Route_FinanceMain', () => 
    import('./lib/finance-routes').then(m => ({ default: m.FinanceRoutes }))
  );
  
  ComponentRegistry.registerLazy('Route_COAMain', () => 
    import('./lib/coa/coa-tree').then(m => ({ default: m.ChartOfAccounts }))
  );
  
  ComponentRegistry.registerLazy('Route_General Ledger (GL)Main', () => 
    import('./lib/gl/gl-dashboard').then(m => ({ default: m.GLDashboard }))
  );
  
  ComponentRegistry.registerLazy('Route_ChartOfAccounts', () => 
    import('./lib/coa/coa-tree').then(m => ({ default: m.ChartOfAccounts }))
  );
}
