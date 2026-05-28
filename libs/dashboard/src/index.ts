import { ComponentRegistry } from '@tenarm/shared-ui';

export function initDashboard() {
  ComponentRegistry.registerLazy(
    'Widget_MyTasks',
    () => import('./lib/home')
  );
}
