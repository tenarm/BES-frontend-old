import { ComponentRegistry } from '@bes/shared-ui';

export function initSuppliersDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Suppliers',
    () => import('./lib/suppliers-page')
  );
}
