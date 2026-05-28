import { ComponentRegistry } from '@tenarm/shared-ui';

export function initSuppliersDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Suppliers',
    () => import('./lib/suppliers-page')
  );
}
