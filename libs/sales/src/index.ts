export * from './lib/sales';
export * from './lib/quotation-form';

import { ComponentRegistry } from '@erp/shared-ui';
import { SalesWidget } from './lib/sales-widget';
import { QuotationForm } from './lib/quotation-form';

export function initSalesModule() {
  console.log('Initializing Sales Module...');
  ComponentRegistry.register('Widget_SalesSummary', SalesWidget);
  ComponentRegistry.register('Form_SalesQuotation', QuotationForm);
}

