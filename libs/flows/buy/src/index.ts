import { ComponentRegistry } from '@bes/shared-ui';

export function initBuyFlow() {
  ComponentRegistry.registerLazy(
    'Flow_Buy',
    () => import('./lib/buy-landing')
  );
}
