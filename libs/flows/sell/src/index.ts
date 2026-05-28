import { ComponentRegistry } from '@tenarm/shared-ui';

export function initSellFlow() {
  ComponentRegistry.registerLazy(
    'Flow_Sell',
    () => import('./lib/sell-landing')
  );
}
