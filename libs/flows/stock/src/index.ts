import { ComponentRegistry } from '@bes/shared-ui';

export function initStockFlow() {
  ComponentRegistry.registerLazy(
    'Flow_Stock',
    () => import('./lib/stock-landing')
  );
}
