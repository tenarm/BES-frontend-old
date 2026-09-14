import { ComponentRegistry } from '@bes/shared-ui';

export function initDashboard() {
  ComponentRegistry.registerLazy(
    'Widget_MyTasks',
    () => import('./lib/home')
  );
}
