// Map module keys to Display Names
export const MODULE_NAMES: Record<string, string> = {
  home: 'Home',
  finance: 'Finance',
  sales: 'Sales & Distribution',
  inventory: 'Inventory & Warehouse',
  hr: 'Human Resources & Payroll',
  crm: 'CRM',
  manufacturing: 'Manufacturing & Production',
  project_management: 'Project Management',
  supply_chain: 'Supply Chain Management',
  quality_management: 'Quality Management',
  asset_management: 'Asset Management',
  bi: 'Business Intelligence',
  document_management: 'Document Management',
  marketing: 'Marketing & Campaigns',
  service_desk: 'Service & Help Desk',
  education: 'Education Management',
  settings: 'Settings & Administration'
};

export const RESOURCE_NAMES: Record<string, string> = {
  // Finance
  coa: 'Chart of Accounts (CoA)', // needed created
  gl: 'General Ledger (GL)', // needed created
  ap: 'Accounts Payable (AP)', // needed created
  vendors: 'Vendors', // needed created
  purchase_invoices: 'Purchase Invoices', // needed created
  ar: 'Accounts Receivable (AR)', //needed created
  bank_cash: 'Bank & Cash Management', // needed created
  tax: 'Tax Management',//created
  fixed_asset: 'Fixed Asset Management',
  budgeting: 'Budgeting & Forecasting',//created
  cost_center: 'Cost Center & Profit Center Accounting',
  multi_currency: 'Multi-Currency Management',
  period_end_close: 'Financial Period-End Close',
  payroll_integration: 'Payroll Integration',
  project_cost_accounting: 'Project / Job Cost Accounting',
  intercompany: 'Intercompany Accounting',
  mis_reporting: 'Financial Reporting & MIS',
  audit_trail: 'Audit Trail & Compliance',

  // Sales
  customer_master: 'Customer Master Management', // needed
  quotation: 'Quotation / Proposal Management', // needed
  sales_order: 'Sales Order Processing', // needed
  pricing_discount: 'Pricing & Discount Management',
  delivery_dispatch: 'Delivery / Dispatch Management',
  sales_invoice: 'Sales Invoice & Billing', // needed
  sales_returns: 'Sales Returns & Credit Notes',
  sales_commission: 'Sales Commission & Incentives',
  territory_channel: 'Territory & Channel Management',
  sales_analytics: 'Sales Analytics & Forecasting',
  ecommerce: 'E-commerce / Online Order Integration',
  sales_contracts: 'Contract & Agreement Management',

  // Inventory
  item_master: 'Item / Material Master', // needed
  warehouse_location: 'Warehouse & Location Management', // needed
  stock_ledger: 'Stock Ledger (Basic)',
  goods_receipt: 'Goods Receipt (Inbound)', // needed
  goods_issue: 'Goods Issue (Outbound)', // needed
  stock_transfer: 'Stock Transfer (Inter-warehouse)',
  inventory_valuation: 'Inventory Valuation',
  physical_inventory: 'Cycle Count & Physical Inventory',
  auto_replenishment: 'Reorder Point & Auto-Replenishment',
  batch_tracking: 'Batch / Lot Tracking',
  serial_tracking: 'Serial Number Tracking',
  bin_management: 'Bin / Shelf Management',
  inventory_reports: 'Inventory Reports & Dashboards',

  // HR
  employee_master: 'Employee Master & Onboarding', // needed
  org_structure: 'Organization Structure',
  attendance: 'Attendance & Time Tracking', // needed
  leave_management: 'Leave Management',
  payroll_processing: 'Payroll Processing & Salary Computation', // needed
  statutory_compliance: 'Statutory Compliance',
  loan_advance: 'Loan & Advance Management',
  performance_appraisal: 'Performance Appraisal & KRA/KPI',
  training_development: 'Training & Development',
  recruitment: 'Recruitment & Applicant Tracking',
  ess_portal: 'Employee Self-Service Portal',
  separation_fnf: 'Separation & Full-and-Final Settlement',
  hr_analytics: 'HR Analytics & Headcount Reports',
  shift_roster: 'Shift & Roster Management',

  // CRM
  lead_opportunity_pipeline: 'Lead Capture & Opportunity Pipeline', // needed
  contact_account: 'Contact & Account Management', // needed
  activity_tracking: 'Activity Tracking',
  quote_to_order: 'Quotation to Order Conversion',
  campaign_management: 'Campaign Management',
  customer_360: 'Customer 360° View',
  sla_escalation: 'SLA & Escalation Rules',
  customer_feedback: 'Customer Feedback & Surveys',
  crm_analytics: 'CRM Analytics & Dashboard',

  // Manufacturing
  bom: 'Bill of Materials (BOM)',
  work_order: 'Production / Work Order Management',
  mrp: 'Material Requirement Planning (MRP)',
  shop_floor: 'Shop Floor Control & Routing',
  production_scheduling: 'Production Scheduling',
  work_center: 'Work Center / Machine Master',
  subcontracting: 'Subcontracting / Job Work',
  scrap_rework: 'Scrap & Rework Management',
  production_cost: 'Production Cost Roll-Up',
  capacity_planning: 'Capacity Planning',
  quality_check_production: 'Quality Check at Production',
  manufacturing_reports: 'Manufacturing Reports & OEE',

  // Project Management
  project_master: 'Project Master & WBS',
  task_management: 'Task / Activity Management',
  resource_allocation: 'Resource Allocation & Planning',
  timesheet: 'Timesheet & Labor Tracking',
  project_budgeting: 'Project Budgeting & Cost Control',
  milestone_tracking: 'Milestone & Deliverable Tracking',
  project_billing: 'Project Billing',
  risk_issue: 'Risk & Issue Management',
  project_procurement: 'Project Procurement',
  project_reports: 'Project Reports & Dashboards',

  // Supply Chain
  supplier_master: 'Supplier / Vendor Master',
  purchase_requisition: 'Purchase Requisition',
  purchase_order: 'Purchase Order Management',
  grn: 'Goods Receipt & GRN',
  vendor_evaluation: 'Vendor Evaluation & Scorecard',
  rfq: 'Request for Quotation (RFQ)',
  purchase_contract: 'Purchase Contract / Blanket Order',
  returns_to_vendor: 'Returns to Vendor (Debit Note)',
  landed_cost: 'Landed Cost Calculation',
  scm_analytics: 'Supply Chain Analytics',

  // Quality Management
  quality_inspection_plan: 'Quality Inspection Plan',
  comprehensive_qc: 'Incoming / In-Process / Final Quality Check',
  ncr: 'Non-Conformance Report (NCR)',
  capa: 'Corrective & Preventive Action (CAPA)',
  quality_audit: 'Quality Audit & Certification Tracking',
  quality_reports: 'Quality Reports & Trend Analysis',

  // Asset Management
  asset_registration: 'Asset Master & Registration',
  asset_categorization: 'Asset Categorization & Tagging',
  asset_tracking: 'Asset Tracking',
  preventive_maintenance: 'Preventive Maintenance Scheduling',
  corrective_maintenance: 'Breakdown / Corrective Maintenance',
  spare_parts: 'Spare Parts & Inventory Integration',
  asset_depreciation: 'Asset Depreciation',
  asset_disposal: 'Asset Disposal & Write-Off',

  // BI
  dashboard_builder: 'Dashboard Builder & KPI Widgets',
  drill_down_reports: 'Drill-Down Reports',
  scheduled_reports: 'Scheduled / Automated Reports',
  cross_module_aggregation: 'Cross-Module Data Aggregation',
  custom_report_builder: 'Custom Report Builder',
  data_export: 'Data Export',
  report_access: 'Role-Based Report Access',
  trend_analysis: 'Trend Analysis & Comparative Charts',

  // Document Management
  document_upload: 'Document Upload & Storage',
  version_control: 'Version Control & History',
  document_categorization: 'Document Categorization & Tagging',
  access_control: 'Access Control & Permissions',
  document_linking: 'Document Linking to Transactions',
  full_text_search: 'Full-Text Search',
  approval_workflow: 'Approval Workflow for Documents',
  document_retention: 'Document Archival & Retention Policy',

  // Marketing
  campaign_planning: 'Campaign Planning & Budgeting',
  email_sms_campaign: 'Email / SMS Campaign Execution',
  landing_page_form: 'Landing Page & Form Management',
  lead_scoring: 'Lead Scoring & Nurturing',
  social_media: 'Social Media Integration',
  marketing_analytics: 'Marketing Analytics & ROI Tracking',
  event_management: 'Event Management',
  content_management: 'Content & Collateral Management',

  // Service Desk
  ticket_management: 'Ticket / Case Management',
  sla_monitoring: 'SLA Configuration & Monitoring',
  knowledge_base: 'Knowledge Base / FAQ',
  service_contracts: 'Service Contracts & AMC',
  field_service: 'Field Service Management',
  service_spare_parts: 'Spare Parts & Billing',
  escalation_matrix: 'Escalation Matrix',
  customer_portal: 'Customer Portal',
  service_reports: 'Service Reports & CSAT',
  warranty_management: 'Warranty Management',

  // Education
  student_admission: 'Student Admission & Enrollment',
  program_batch: 'Program / Course / Batch Management',
  timetable_scheduling: 'Timetable & Scheduling',
  student_attendance: 'Attendance Tracking (Student)',
  examination_grading: 'Examination & Grading',
  fee_collection: 'Fee Structure & Fee Collection',
  student_ledger: 'Student Ledger & Finance Integration',
  faculty_management: 'Faculty / Staff Management',
  library_management: 'Library Management',
  transport_management: 'Transport Management',
  student_parent_portal: 'Student Portal & Parent Portal',
  academic_reports: 'Academic Reports & Transcripts',

  // Settings
  company_setup: 'Company / Entity Setup', // needed
  user_management: 'User Management & RBAC', // needed
  module_toggle: 'Module Enable / Disable', // needed
  workflow_config: 'Approval Workflow Configuration',
  notification_rules: 'Notification & Alert Rules',
  number_series: 'Number Series / Sequence Management',
  email_templates: 'Email & Communication Templates',
  audit_log: 'System Audit Log & Activity Trail' // needed
};

export const capitalize = (s: string) => RESOURCE_NAMES[s] || (s.charAt(0).toUpperCase() + s.slice(1));
