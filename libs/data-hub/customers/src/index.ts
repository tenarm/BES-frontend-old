import { ComponentRegistry } from '@tenarm/shared-ui';

export function initCustomersDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Customers',
    () => import('./lib/customers-page')
  );
}
