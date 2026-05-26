export interface AddressData {
  id?: string;
  customer_id?: string;
  address_type: string; // BILLING, SHIPPING
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

export interface ContactData {
  id?: string;
  customer_id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  role: string; // BILLING, PURCHASING, LOGISTICS
}

export interface CustomerCommercialData {
  id?: string;
  name: string;
  tax_id?: string;
  primary_email?: string;
  version_id: number;
  credit_limit: number;
  payment_terms: string;
  currency: string;
  credit_hold: boolean;
  notes?: string;
  addresses: AddressData[];
  contacts: ContactData[];
}
