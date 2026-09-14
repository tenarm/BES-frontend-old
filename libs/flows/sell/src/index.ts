import { ComponentRegistry } from '@bes/shared-ui';

export function initSellFlow() {
  ComponentRegistry.registerLazy(
    'Flow_Sell',
    () => import('./lib/sell-landing')
  );
}
