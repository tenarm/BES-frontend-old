import { ComponentRegistry, RESOURCE_NAMES } from '@bes/shared-ui';

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

  // Register the specific Company Setup subitem route using central constants
  ComponentRegistry.registerLazy(`Route_${RESOURCE_NAMES.company_setup}`, () =>
    import('./lib/company-setup/company-setup').then(m => ({ default: m.CompanySetupPage }))
  );

  // Register the User Management subitem route using central constants
  ComponentRegistry.registerLazy(`Route_${RESOURCE_NAMES.user_management}`, () =>
    import('./lib/user-management/user-management').then(m => ({ default: m.UserManagementPage }))
  );

  // Register the Period Close Approval modal for the process pipeline
  ComponentRegistry.registerLazy('Modal_PeriodCloseApproval', () =>
    import('./lib/company-setup/PeriodCloseApprovalModal').then(m => ({
      default: m.PeriodCloseApprovalModal
    }))
  );
  ComponentRegistry.registerLazy('Modal_cfo_final_approval', () =>
    import('./lib/company-setup/PeriodCloseApprovalModal').then(m => ({
      default: m.PeriodCloseApprovalModal
    }))
  );

  // Register the User Offboard Operational Handover modal
  ComponentRegistry.registerLazy('Modal_UserOffboardApproval', () =>
    import('./lib/user-management/modals/UserOffboardApprovalModal').then(m => ({
      default: m.UserOffboardApprovalModal
    }))
  );
  ComponentRegistry.registerLazy('Modal_transfer_crm_assets', () =>
    import('./lib/user-management/modals/UserOffboardApprovalModal').then(m => ({
      default: m.UserOffboardApprovalModal
    }))
  );
}

