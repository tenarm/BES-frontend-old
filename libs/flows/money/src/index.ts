import { ComponentRegistry } from '@bes/shared-ui';

export function initMoneyFlow() {
  ComponentRegistry.registerLazy(
    'Flow_Money',
    () => import('./lib/money-landing')
  );
}
