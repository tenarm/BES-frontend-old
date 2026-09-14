import { ComponentRegistry } from '@bes/shared-ui';

export function initAccountsDataHub() {
  ComponentRegistry.registerLazy(
    'DataHub_Accounts',
    () => import('./lib/accounts-page')
  );
}
