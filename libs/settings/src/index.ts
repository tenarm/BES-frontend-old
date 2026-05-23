import { ComponentRegistry } from '@bes/shared-ui';

/**
 * Initialize the module and register its components.
 * This is called by the Shell during application startup.
 */
export function initSettingsModule() {
  console.log('Initializing Settings Module...');

  // Register the main settings page (Company Setup is the primary view)
  ComponentRegistry.registerLazy('Route_Settings', () =>
    import('./lib/company-setup/company-setup').then(m => ({ default: m.CompanySetupPage }))
  );

  // Register the specific Company Setup subitem route (Company / Entity Setup)
  ComponentRegistry.registerLazy('Route_Company / Entity Setup', () =>
    import('./lib/company-setup/company-setup').then(m => ({ default: m.CompanySetupPage }))
  );

  // Register the Period Close Approval modal for the process pipeline
  ComponentRegistry.registerLazy('Modal_PeriodCloseApproval', () =>
    import('./lib/company-setup/PeriodCloseApprovalModal').then(m => ({
      default: m.PeriodCloseApprovalModal
    }))
  );
}

