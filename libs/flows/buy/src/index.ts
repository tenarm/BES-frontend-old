import { ComponentRegistry } from '@tenarm/shared-ui';

export function initBuyFlow() {
  ComponentRegistry.registerLazy(
    'Flow_Buy',
    () => import('./lib/buy-landing')
  );
}
