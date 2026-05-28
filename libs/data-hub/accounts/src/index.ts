import { ComponentRegistry } from '@tenarm/shared-ui';

export function initAccountsDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Accounts',
    () => import('./lib/accounts-page')
  );
}
