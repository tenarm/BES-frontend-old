import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  tax_id?: string;
  primary_email?: string;
  parent_customer_id?: string;
  status: string; // ACTIVE, INACTIVE, CREDIT_HOLD
  version_id: number;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  address_type: string; // BILLING, SHIPPING
  street_address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country_code: string;
  is_default: boolean;
  version_id: number;
}

export interface CustomerContact {
  id: string;
  customer_id: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  version_id: number;
}

export interface CustomerCredit {
  id: string;
  customer_id: string;
  credit_limit: number;
  outstanding_balance: number;
  payment_terms_code?: string;
  status: string; // ACTIVE, CREDIT_HOLD
  version_id: number;
}

interface CustomerStore {
  customers: Customer[];
  totalCustomers: number;
  activeCustomers: number;
  creditHoldsCount: number;
  isLoading: boolean;
  selectedCustomer: Customer | null;
  selectedCustomerCredit: CustomerCredit | null;
  selectedCustomerAddresses: CustomerAddress[];
  selectedCustomerContacts: CustomerContact[];
  
  // Conflicts (HTTP 409)
  conflictDetails: { local: any; server: any; customerId: string } | null;

  // Actions
  fetchCustomers: (page?: number, pageSize?: number) => Promise<void>;
  selectCustomer: (customer: Customer | null) => Promise<void>;
  createCustomer: (data: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (id: string, data: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Address Actions
  addAddress: (customerId: string, data: any) => Promise<void>;
  updateAddress: (addressId: string, data: any) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;

  // Contact Actions
  addContact: (customerId: string, data: any) => Promise<void>;
  updateContact: (contactId: string, data: any) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;

  // Credit Actions
  updateCredit: (customerId: string, data: any) => Promise<void>;
  resolveConflict: (resolution: 'overwrite' | 'discard') => Promise<void>;
}

const API_BASE = '/api/v1/sales';

const getHeaders = () => {
  const token = localStorage.getItem('bes_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  totalCustomers: 0,
  activeCustomers: 0,
  creditHoldsCount: 0,
  isLoading: false,
  selectedCustomer: null,
  selectedCustomerCredit: null,
  selectedCustomerAddresses: [],
  selectedCustomerContacts: [],
  conflictDetails: null,

  fetchCustomers: async (page = 1, pageSize = 50) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/customers?page=${page}&page_size=${pageSize}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch customers');
      const payload = await res.json();
      
      if (payload.status === 'success' && payload.data) {
        const list = payload.data as Customer[];
        const active = list.filter(c => c.status === 'ACTIVE').length;
        const holds = list.filter(c => c.status === 'CREDIT_HOLD').length;

        set({
          customers: list,
          totalCustomers: payload.metadata?.total || list.length,
          activeCustomers: active,
          creditHoldsCount: holds,
          isLoading: false
        });
      }
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  selectCustomer: async (customer) => {
    if (!customer) {
      set({
        selectedCustomer: null,
        selectedCustomerCredit: null,
        selectedCustomerAddresses: [],
        selectedCustomerContacts: [],
        conflictDetails: null
      });
      return;
    }

    set({ selectedCustomer: customer, conflictDetails: null });
    const cId = customer.id;

    try {
      // Fetch Child Info: Credit, Addresses, Contacts
      const [creditRes, addrRes, contRes] = await Promise.all([
        fetch(`${API_BASE}/customers/${cId}/credit`, { headers: getHeaders() }),
        fetch(`${API_BASE}/customers/${cId}/addresses`, { headers: getHeaders() }),
        fetch(`${API_BASE}/customers/${cId}/contacts`, { headers: getHeaders() })
      ]);

      let credit = null;
      let addresses = [];
      let contacts = [];

      if (creditRes.ok) {
        const p = await creditRes.json();
        if (p.status === 'success') credit = p.data;
      }
      if (addrRes.ok) {
        const p = await addrRes.json();
        if (p.status === 'success') addresses = p.data;
      }
      if (contRes.ok) {
        const p = await contRes.json();
        if (p.status === 'success') contacts = p.data;
      }

      set({
        selectedCustomerCredit: credit,
        selectedCustomerAddresses: addresses,
        selectedCustomerContacts: contacts
      });
    } catch (e) {
      console.warn('Failed to load child customer info', e);
    }
  },

  createCustomer: async (data) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create customer');
    const payload = await res.json();
    await get().fetchCustomers();
    return payload.data;
  },

  updateCustomer: async (id, data) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (res.status === 409) {
      // Conflict Detected
      const serverRes = await fetch(`${API_BASE}/customers/${id}`, { headers: getHeaders() });
      if (serverRes.ok) {
        const payload = await serverRes.json();
        set({
          conflictDetails: {
            local: data,
            server: payload.data,
            customerId: id
          }
        });
      }
      throw new Error('Conflict detected');
    }

    if (!res.ok) throw new Error('Failed to update customer');
    const payload = await res.json();
    set({ selectedCustomer: payload.data, conflictDetails: null });
    await get().fetchCustomers();
  },

  deleteCustomer: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete customer');
    set({ selectedCustomer: null });
    await get().fetchCustomers();
  },

  addAddress: async (customerId, data) => {
    const res = await fetch(`${API_BASE}/customers/${customerId}/addresses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add address');
    await get().selectCustomer(get().selectedCustomer);
  },

  updateAddress: async (addressId, data) => {
    const res = await fetch(`${API_BASE}/customers/addresses/${addressId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update address');
    await get().selectCustomer(get().selectedCustomer);
  },

  deleteAddress: async (addressId) => {
    const res = await fetch(`${API_BASE}/customers/addresses/${addressId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete address');
    await get().selectCustomer(get().selectedCustomer);
  },

  addContact: async (customerId, data) => {
    const res = await fetch(`${API_BASE}/customers/${customerId}/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add contact');
    await get().selectCustomer(get().selectedCustomer);
  },

  updateContact: async (contactId, data) => {
    const res = await fetch(`${API_BASE}/customers/contacts/${contactId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update contact');
    await get().selectCustomer(get().selectedCustomer);
  },

  deleteContact: async (contactId) => {
    const res = await fetch(`${API_BASE}/customers/contacts/${contactId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete contact');
    await get().selectCustomer(get().selectedCustomer);
  },

  updateCredit: async (customerId, data) => {
    const res = await fetch(`${API_BASE}/customers/${customerId}/credit`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update credit settings');
    await get().selectCustomer(get().selectedCustomer);
  },

  resolveConflict: async (resolution) => {
    const conflict = get().conflictDetails;
    if (!conflict) return;

    if (resolution === 'overwrite') {
      // Re-submit using server version_id to bypass optimistic lock
      const serverVersion = conflict.server.version_id;
      const resolvedData = { ...conflict.local, version_id: serverVersion };
      await get().updateCustomer(conflict.customerId, resolvedData);
    } else {
      // Discard and load server version
      set({ selectedCustomer: conflict.server, conflictDetails: null });
      await get().selectCustomer(conflict.server);
    }
  }
}));
