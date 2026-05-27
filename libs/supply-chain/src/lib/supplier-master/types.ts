export interface SupplierAddressData {
  id?: string;
  address_type: string;  // e.g. BILLING_REMIT, SHIP_FROM
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

export interface SupplierContactData {
  id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  role: string;  // e.g. SOURCING, FINANCE, LOGISTICS
  is_primary: boolean;
}

export interface SupplierCertificationData {
  id?: string;
  cert_type: string;  // e.g. ISO_9001, ISO_14001, LIABILITY_INSURANCE
  cert_number: string;
  issuing_authority: string;
  issue_date: string;  // date string
  expiry_date: string; // date string
  is_active?: boolean;
}

export interface SupplierCommercialData {
  id?: string;
  name: string;
  tax_id?: string;
  primary_email?: string;
  payment_terms?: string;
  currency: string;
  lead_time_days: number;
  otif_target: number;
  otif_score?: number;
  defect_rate?: number;
  purchasing_hold: boolean;
  payment_hold: boolean;
  notes?: string;
  addresses: SupplierAddressData[];
  contacts: SupplierContactData[];
  certifications: SupplierCertificationData[];
  version_id?: number;
}
