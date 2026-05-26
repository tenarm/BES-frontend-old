import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, BadgePercent, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  Button, Card, TabGroup, TabList, Tab, TabPanels, TabPanel,
  UpgradeGateOverlay, PremiumLockIndicator, Badge
} from '@bes/shared-ui';

import { CustomerCommercialData } from './types';
import { CustomerListTab } from './components/CustomerListTab';
import { CreditCollectionTab } from './components/CreditCollectionTab';
import { CustomerDrawer } from './components/CustomerDrawer';
import { PricingAgreementsTab } from './components/PricingAgreementsTab';

export const CustomerMasterPage: React.FC = () => {
  // --- Simulation States (Rule 2.3 Subscription Trails) ---
  const [activeTier, setActiveTier] = useState<'Basic' | 'Pro' | 'Premium'>(() => {
    const raw = localStorage.getItem('bes_plan') || 'premium';
    return (raw.charAt(0).toUpperCase() + raw.slice(1)) as 'Basic' | 'Pro' | 'Premium';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const raw = localStorage.getItem('bes_plan') || 'premium';
      setActiveTier((raw.charAt(0).toUpperCase() + raw.slice(1)) as 'Basic' | 'Pro' | 'Premium');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bes_plan_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bes_plan_changed', handleStorageChange);
    };
  }, []);

  const [showUpgradeGate, setShowUpgradeGate] = useState<string | null>(null);

  // --- Common States ---
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- Data Collections ---
  const [customers, setCustomers] = useState<CustomerCommercialData[]>([]);

  // --- Active Selections & Drawers ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCommercialData | null>(null);
  
  // Controlled tab index state
  const [selectedIndex, setSelectedIndex] = useState(0);

  const token = localStorage.getItem('bes_token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Fetch API Resources ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/v1/sales/customers${q}`, { headers });
      if (res.ok) {
        const body = await res.json();
        setCustomers(body.data || []);
      } else {
        // Fallback mock seeds if database is empty or not migrated
        seedMockData();
      }
    } catch {
      seedMockData();
    } finally {
      setLoading(false);
    }
  };

  const seedMockData = () => {
    setCustomers([
      {
        id: '1',
        name: 'Acme Corporation',
        tax_id: 'US-99887766',
        primary_email: 'billing@acme.com',
        version_id: 1,
        credit_limit: 50000,
        payment_terms: 'Net 45',
        currency: 'USD',
        credit_hold: false,
        notes: 'Premium commercial client.',
        addresses: [],
        contacts: []
      },
      {
        id: '2',
        name: 'Globex Holdings',
        tax_id: 'US-11223344',
        primary_email: 'finance@globex.com',
        version_id: 2,
        credit_limit: 25000,
        payment_terms: 'Net 30',
        currency: 'EUR',
        credit_hold: true,
        notes: 'Temporarily blocked due to outstanding collection delays.',
        addresses: [],
        contacts: []
      }
    ]);
  };

  useEffect(() => {
    fetchAllData();
  }, [search]);

  // --- Tab Interception (Subscription Gates) ---
  const handleTabChange = (index: number) => {
    if (index === 1 && activeTier === 'Basic') {
      setShowUpgradeGate('Credit Risk Analytics & Collection Overrides');
      return;
    }
    if (index === 2 && activeTier !== 'Premium') {
      setShowUpgradeGate('Custom Pricing Agreements & Promotional Matrix');
      return;
    }
    setSelectedIndex(index);
  };

  // --- Save Customer (Create or Update) ---
  const handleSaveCustomer = async (payload: CustomerCommercialData) => {
    if (activeTier === 'Basic' && customers.length >= 1 && !payload.id) {
      setShowUpgradeGate('Customer Onboarding (Basic limits to 1 active record)');
      return;
    }

    try {
      let res;
      if (payload.id) {
        res = await fetch(`/api/v1/sales/customers/${payload.id}?version_id=${payload.version_id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/v1/sales/customers', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      const body = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          showToast('error', 'Concurrency Conflict: Record modified concurrently by another user.');
        } else {
          showToast('error', body.detail || 'Failed to save customer record.');
        }
      } else {
        showToast('success', `Customer '${payload.name}' saved successfully.`);
        setIsDrawerOpen(false);
        fetchAllData();
      }
    } catch {
      // Offline/Mock simulation fallback
      if (payload.id) {
        setCustomers(customers.map(c => c.id === payload.id ? { ...payload, version_id: payload.version_id + 1 } : c));
      } else {
        setCustomers([...customers, { ...payload, id: crypto.randomUUID() }]);
      }
      showToast('success', `Customer saved successfully (offline simulation mode).`);
      setIsDrawerOpen(false);
    }
  };

  // --- Toggle Credit Hold ---
  const handleToggleHold = async (customer: CustomerCommercialData) => {
    if (activeTier === 'Basic') {
      setShowUpgradeGate('Granular Credit Locking Override Controls');
      return;
    }

    const nextHold = !customer.credit_hold;
    try {
      const res = await fetch(`/api/v1/sales/customers/${customer.id}/credit-hold?credit_hold=${nextHold}`, {
        method: 'PATCH',
        headers
      });
      if (res.ok) {
        showToast('success', `Credit hold successfully ${nextHold ? 'ACTIVATED' : 'RELEASED'}.`);
        fetchAllData();
      }
    } catch {
      setCustomers(customers.map(c => c.id === customer.id ? { ...c, credit_hold: nextHold } : c));
      showToast('success', `Credit hold successfully modified (offline simulation mode).`);
    }
  };

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)', position: 'relative', minHeight: '100vh' }}>
      
      {/* Toast Notifications */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toast.type === 'success' ? '#059669' : '#dc2626',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--ui-spacing-lg)' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: 'var(--ui-text-xl)', 
            fontWeight: '700', 
            color: 'var(--ui-gray-900)', 
            margin: 0 
          }}>Customer Master Directory</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Manage customer identities, commercial billing profiles, payment thresholds, and credit holds.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button variant="secondary" onClick={fetchAllData} size="sm">
            <RefreshCw size={14} style={{ marginRight: 6 }} /> Refresh
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
        <TabList>
          <Tab><Users size={16} style={{ marginRight: 8 }} /> Active Directory</Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldAlert size={16} /> Credit & Collection Parameters
              {activeTier === 'Basic' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BadgePercent size={16} /> Customer Pricing Agreements
              {activeTier !== 'Premium' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
        </TabList>

        <TabPanels style={{ marginTop: '20px' }}>
          {/* Active Directory Tab */}
          <TabPanel>
            <CustomerListTab 
              customers={customers}
              search={search}
              setSearch={setSearch}
              loading={loading}
              onOnboard={() => {
                setSelectedCustomer(null);
                setIsDrawerOpen(true);
              }}
              onEdit={(c) => {
                setSelectedCustomer(c);
                setIsDrawerOpen(true);
              }}
              onToggleHold={handleToggleHold}
            />
          </TabPanel>

          {/* Credit & Collections Tab */}
          <TabPanel>
            <CreditCollectionTab 
              customers={customers}
              onToggleHold={handleToggleHold}
            />
          </TabPanel>

          {/* Pricing Agreements Tab */}
          <TabPanel>
            {activeTier === 'Premium' ? (
              <PricingAgreementsTab customers={customers} showToast={showToast} />
            ) : (
              <Card style={{ padding: '40px', textAlign: 'center' }}>
                <LockGatePrompt requiredFeature="Custom Pricing Agreements" onUpgrade={() => setShowUpgradeGate('Custom Contract Pricing & Discounts')} />
              </Card>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Drawer */}
      <CustomerDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCustomer={selectedCustomer}
        onSave={handleSaveCustomer}
      />

      {/* Premium Upgrade Overlay */}
      {showUpgradeGate && (
        <UpgradeGateOverlay 
          moduleName={showUpgradeGate}
          requiredTier="Pro"
          onClose={() => setShowUpgradeGate(null)}
        />
      )}
    </div>
  );
};

// Internal lock helper
const LockGatePrompt: React.FC<{ requiredFeature: string; onUpgrade: () => void }> = ({ requiredFeature, onUpgrade }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0' }}>
      <ShieldCheck size={48} style={{ color: 'var(--ui-primary)', opacity: 0.6 }} />
      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Feature Locked</h3>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ui-gray-500)', maxWidth: 400 }}>
        {requiredFeature} is a Premium Tier feature. Upgrade your plan to manage contract pricing agreements.
      </p>
      <Button variant="primary" onClick={onUpgrade} style={{ marginTop: 8 }}>
        Explore Upgrade Options
      </Button>
    </div>
  );
};
