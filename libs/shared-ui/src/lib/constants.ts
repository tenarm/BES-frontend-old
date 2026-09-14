/** Flow identifiers and display names */
export const FLOW_NAMES: Record<string, string> = {
  sell: 'Sell',
  buy: 'Buy',
  stock: 'Stock',
  money: 'Money',
  people: 'People',
  customers: 'Customers',
  manufacture: 'Manufacture',
  projects: 'Projects',
  assets: 'Assets',
  support: 'Support',
};

/** Data Hub entity display names */
export const DATA_HUB_NAMES: Record<string, string> = {
  customers: 'Customers',
  suppliers: 'Suppliers',
  products: 'Products',
  accounts: 'Accounts',
  employees: 'Employees',
  contacts: 'Contacts',
};

/** System section items */
export const SYSTEM_NAMES: Record<string, string> = {
  settings: 'Settings',
  pipelines: 'Pipelines',
};

/** Domain module display names (MODULES sidebar section) */
export const MODULE_NAMES: Record<string, string> = {
  sales:     'Sales',
  inventory: 'Inventory',
  finance:   'Finance',
};

/** ComponentRegistry key builders */
export const ROUTE_KEYS = {
  flow: (flowId: string) =>
    `Flow_${flowId.charAt(0).toUpperCase() + flowId.slice(1)}`,
  dataHub: (entity: string) =>
    `DataHub_${entity.charAt(0).toUpperCase() + entity.slice(1)}`,
  module: (name: string) =>
    `Module_${name.charAt(0).toUpperCase() + name.slice(1)}`,
  setting: (name: string) =>
    `Setting_${name.charAt(0).toUpperCase() + name.slice(1)}`,
} as const;

/** Flow icons (emoji) */
export const FLOW_ICONS: Record<string, string> = {
  sell: '💰',
  buy: '🛒',
  stock: '📦',
  money: '💳',
  people: '👥',
  customers: '🤝',
  manufacture: '🏭',
  projects: '📋',
  assets: '🏗️',
  support: '🎧',
};

/** Flow tier requirements */
export const FLOW_TIERS: Record<string, 'basic' | 'pro' | 'premium'> = {
  sell: 'basic',
  buy: 'basic',
  stock: 'basic',
  money: 'pro',
  people: 'pro',
  customers: 'pro',
  manufacture: 'premium',
  projects: 'premium',
  assets: 'premium',
  support: 'premium',
};

/** Utility */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
