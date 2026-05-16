import { ComponentRegistry } from '@bes/shared-ui';

/**
 * Initialize the module and register its components.
 * This is called by the Shell during application startup.
 */
export function initHrModule() {
  console.log('Initializing HR Module...');

  // Use registerLazy for better code-splitting and performance
  ComponentRegistry.registerLazy('Route_HR', () =>
    import('./lib/hr-home').then(m => ({ default: m.HrHomePage }))
  );
}

// Re-export for direct usage if needed
export { HrHomePage } from './lib/hr-home';
