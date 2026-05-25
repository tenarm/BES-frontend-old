export interface CompanyProfile {
  name: string;
  legal_name: string;
  registration_id: string;
  timezone: string;
  base_currency: string;
  date_format: string;
  number_format: string;
  logo_light_url?: string;
  logo_dark_url?: string;
  primary_brand_color?: string;
  version_id: string; // Optimistic locking
}

export interface Subsidiary {
  id: string;
  name: string;
  legal_name: string;
  tax_id: string;
  parent_id: string | null;
  country_code: string;
  currency_code: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SubsidiaryCreate {
  name: string;
  legal_name: string;
  tax_id: string;
  parent_id: string | null;
  country_code: string;
  currency_code: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FiscalYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface FiscalYearCreate {
  name: string;
  start_date: string;
  end_date: string;
}

export interface PostingPeriod {
  id: string;
  fiscal_year_id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'OPEN' | 'LOCKED' | 'CLOSING';
  locked_at?: string;
  locked_by?: string;
}

export interface TaxProfile {
  id: string;
  subsidiary_id: string;
  tax_authority: string;
  tax_registration_number: string;
  default_tax_rate: number; // Decimal represented as number
}

export interface TaxProfileCreate {
  subsidiary_id: string;
  tax_authority: string;
  tax_registration_number: string;
  default_tax_rate: number;
}

export interface SharingRule {
  entity_type: 'CUSTOMER' | 'VENDOR' | 'ITEM';
  is_globally_shared: boolean;
}

export interface IntercompanyAccount {
  id: string;
  from_subsidiary_id: string;
  to_subsidiary_id: string;
  due_to_account_id: string; // GL Account UUID ref
  due_from_account_id: string; // GL Account UUID ref
}

export interface IntercompanyAccountCreate {
  from_subsidiary_id: string;
  to_subsidiary_id: string;
  due_to_account_id: string;
  due_from_account_id: string;
}

export interface ConflictError {
  local_changes: Record<string, any>;
  server_version: Record<string, any>;
  field_diffs: string[];
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  metadata?: Record<string, any>;
  error?: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  total: number;
  page: number;
  per_page: number;
  metadata?: Record<string, any>;
  error?: string;
}
