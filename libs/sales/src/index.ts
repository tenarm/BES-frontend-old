import { ComponentRegistry } from '@bes/shared-ui';
export * from './lib/sales';
export * from './lib/quotation-form';

export function initSalesModule() {
  console.log('Initializing Sales Module...');
  
  // Using registerLazy ensures these components are only loaded when needed.
  // We map the named export to 'default' as required by React.lazy.
  ComponentRegistry.registerLazy('Widget_SalesSummary', () => 
    import('./lib/sales-widget').then(m => ({ default: m.SalesWidget }))
  );
  
  ComponentRegistry.registerLazy('Form_SalesQuotation', () => 
    import('./lib/quotation-form').then(m => ({ default: m.QuotationForm }))
  );

  // Register Customer Master Route
  ComponentRegistry.registerLazy('Route_Customer Master', () => 
    import('./lib/customer-master/customer-master').then(m => ({ default: m.CustomerMasterPage }))
  );
}

