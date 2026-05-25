// Map module keys to Display Names
export const MODULE_NAMES: Record<string, string> = {
  home: 'Home',
  sales: 'Sales',
  settings: 'Settings'
};

export const RESOURCE_NAMES: Record<string, string> = {
  // Sales
  customer_master: 'Customer Master',

  // Settings
  company_setup: 'Company / Entity Setup',
  user_management: 'User Management & RBAC',
  module_toggle: 'Module Enable / Disable',
  workflow_config: 'Approval Workflow Configuration',
  notification_rules: 'Notification & Alert Rules',
  number_series: 'Number Series / Sequence Management',
  email_templates: 'Email & Communication Templates',
  audit_log: 'System Audit Log & Activity Trail'
};

export const capitalize = (s: string) => RESOURCE_NAMES[s] || (s.charAt(0).toUpperCase() + s.slice(1));

