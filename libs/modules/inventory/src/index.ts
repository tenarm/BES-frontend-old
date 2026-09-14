// @bes/modules-inventory — Public API
import { ComponentRegistry } from '@bes/shared-ui';

export type { InventoryShipment, InventoryShipmentLine } from './lib/types';
export { useInventoryApi, fetchShipments, createShipment, dispatchShipment } from './lib/api';
export { ShipmentForm } from './lib/components/ShipmentForm';

/**
 * initInventoryModule — called by auth-store.ts on login when the
 * `inventory` module is active. Registers Module_Inventory.
 */
export function initInventoryModule() {
  ComponentRegistry.registerLazy(
    'Module_Inventory',
    () => import('./lib/pages/InventoryModulePage')
  );
}
