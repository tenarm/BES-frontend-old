export interface CompanyProfileData {
  id?: string;
  legal_name: string;
  dba_name: string;
  tax_identifier: string;
  email: string;
  phone: string;
  website: string;
  default_language: string;
  logo_url: string;
  version_id: number;
}

export interface SubsidiaryData {
  id?: string;
  name: string;
  parent_id?: string;
  base_currency: string;
  tax_identifier: string;
  address_billing: string;
  address_shipping: string;
  is_active: boolean;
  version_id: number;
}

export interface FiscalCalendarData {
  id?: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  version_id: number;
}

export interface PostingPeriodData {
  id: string;
  calendar_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_locked: boolean;
  version_id: number;
}

export interface TaxProfileData {
  id?: string;
  name: string;
  jurisdiction: string;
  tax_rate: number;
  is_active: boolean;
  version_id: number;
}

export interface UserData {
  id?: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role_id?: string;
  primary_subsidiary_id?: string;
  allowed_subsidiary_ids: string[];
  version_id: number;
}

export interface RoleData {
  id?: string;
  name: string;
  description: string;
  permissions: Record<string, Record<string, Record<string, boolean>>>;
  version_id: number;
}

export interface SessionData {
  id: string;
  token_prefix: string;
  expires_at: string;
}

export interface APIKeyData {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  expires_at?: string;
}
