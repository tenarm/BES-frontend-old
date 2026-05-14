export * from './lib/finance';

// 1. Import the registry from your shared library
import { ComponentRegistry } from '@erp/shared-ui';

// 2. Import your actual React component
import { FinanceWidget } from './lib/finance-widget';
import { FinanceRoutes } from './lib/finance-routes';
import { ChartOfAccounts } from './lib/coa/coa-tree';
import { GLDashboard } from './lib/gl/gl-dashboard';

// 3. Create an initialization function for the Finance Module
export function initFinanceModule() {
  console.log('Initializing Finance Module...');

  // Publish the components to the global phonebook
  ComponentRegistry.register('Widget_FinanceSummary', FinanceWidget);
  ComponentRegistry.register('Route_FinanceMain', FinanceRoutes);
  ComponentRegistry.register('Route_COAMain', ChartOfAccounts);
  ComponentRegistry.register('Route_General Ledger (GL)Main', GLDashboard);
  ComponentRegistry.register('Route_ChartOfAccounts', ChartOfAccounts);
}
