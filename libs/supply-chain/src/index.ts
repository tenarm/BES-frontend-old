import { ComponentRegistry } from '@bes/shared-ui';

/**
 * Initialize the module and register its components.
 * This is called by the Shell during application startup.
 */
export function initSupplyChainModule() {
  console.log('Initializing Supply Chain Module...');

  // Use registerLazy for better code-splitting and performance
  ComponentRegistry.registerLazy('Route_SupplyChain', () =>
    import('./lib/supply-chain-home').then(m => ({ default: m.SupplyChainHomePage }))
  );
}

// Re-export for direct usage if needed
export { SupplyChainHomePage } from './lib/supply-chain-home';
