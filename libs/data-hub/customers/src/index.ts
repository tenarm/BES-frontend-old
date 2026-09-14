import { ComponentRegistry } from '@bes/shared-ui';

export function initCustomersDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Customers',
    () => import('./lib/customers-page')
  );
}
