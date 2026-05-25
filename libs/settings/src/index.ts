import { ComponentRegistry } from '@bes/shared-ui';

/**
 * Initialize the module and register its components.
 * This is called by the Shell during application startup.
 */
export function initSettingsModule() {
  console.log('Initializing Settings Module...');

  // Use registerLazy for better code-splitting and performance
  ComponentRegistry.registerLazy('Route_Settings', () =>
    import('./lib/settings-home').then(m => ({ default: m.SettingsHomePage }))
  );

  // Map sub-menu Route key matching RESOURCE_NAMES.company_setup
  ComponentRegistry.registerLazy('Route_Company / Entity Setup', () =>
    import('./lib/settings-home').then(m => ({ default: m.SettingsHomePage }))
  );
}

// Re-export for direct usage if needed
export { SettingsHomePage } from './lib/settings-home';
