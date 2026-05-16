// libs/finance/src/index.ts
import { ComponentRegistry } from '@bes/shared-ui';

/**
 * Initialize the module and register its components.
 * This is called by the Shell during application startup.
 */
export function initFinanceModule() {
  console.log('Initializing Finance Module...');

  // Use registerLazy for better code-splitting and performance
  ComponentRegistry.registerLazy('Route_Finance', () =>
    import('./lib/finance-home').then(m => ({ default: m.FinanceHomePage }))
  );
}

// Re-export for direct usage if needed
export { FinanceHomePage } from './lib/finance-home';
