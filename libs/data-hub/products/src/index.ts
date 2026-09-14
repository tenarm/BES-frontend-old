import { ComponentRegistry } from '@bes/shared-ui';

export function initProductsDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Products',
    () => import('./lib/products-page')
  );
}
