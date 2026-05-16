import { ComponentRegistry } from '@bes/shared-ui';

/**
 * Initialize the module and register its components.
 * This is called by the Shell during application startup.
 */
export function initInventoryModule() {
  console.log('Initializing Inventory Module...');

  // Use registerLazy for better code-splitting and performance
  ComponentRegistry.registerLazy('Route_Inventory', () =>
    import('./lib/inventory-home').then(m => ({ default: m.InventoryHomePage }))
  );
}

// Re-export for direct usage if needed
export { InventoryHomePage } from './lib/inventory-home';
