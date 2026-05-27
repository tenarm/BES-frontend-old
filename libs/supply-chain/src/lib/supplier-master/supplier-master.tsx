import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Truck, ShieldAlert, Award, AlertTriangle, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { 
  Button, Card, TabGroup, TabList, Tab, TabPanels, TabPanel,
  UpgradeGateOverlay, PremiumLockIndicator
} from '@bes/shared-ui';

import { SupplierCommercialData } from './types';
import { SupplierListTab } from './components/SupplierListTab';
import { SupplierPerformanceTab } from './components/SupplierPerformanceTab';
import { SupplierComplianceTab } from './components/SupplierComplianceTab';
import { SupplierDrawer } from './components/SupplierDrawer';

export const SupplierMasterPage: React.FC = () => {
  // --- Simulation States (Rule 2.3 Subscription Trails) ---
  const [activePlan, setActivePlan] = useState<'Basic' | 'Pro' | 'Premium'>(() => {
    const raw = localStorage.getItem('bes_plan') || 'premium';
    return (raw.charAt(0).toUpperCase() + raw.slice(1)) as 'Basic' | 'Pro' | 'Premium';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const raw = localStorage.getItem('bes_plan') || 'premium';
      setActivePlan((raw.charAt(0).toUpperCase() + raw.slice(1)) as 'Basic' | 'Pro' | 'Premium');
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
  const [suppliers, setSuppliers] = useState<SupplierCommercialData[]>([]);

  // --- Active Selections & Drawers ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierCommercialData | null>(null);
  
  // Controlled tab index state
  const [selectedIndex, setSelectedIndex] = useState(0);

  const headers = useMemo(() => {
    const token = localStorage.getItem('bes_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Fetch API Resources ---
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/v1/supply-chain/suppliers${q}`, { headers });
      if (res.ok) {
        const body = await res.json();
        setSuppliers(body.data || []);
      } else {
        seedMockData();
      }
    } catch {
      seedMockData();
    } finally {
      setLoading(false);
    }
  }, [search, headers]);

  const seedMockData = () => {
    setSuppliers([
      {
        id: '1',
        name: 'Global Logistics & Freight Corp',
        tax_id: 'US-99112233',
        primary_email: 'billing@globallogistics.com',
        payment_terms: 'Net 30',
        currency: 'USD',
        lead_time_days: 5,
        otif_target: 95,
        otif_score: 96.8,
        defect_rate: 0.45,
        purchasing_hold: false,
        payment_hold: false,
        notes: 'Primary freight forwarder.',
        addresses: [
          { address_type: 'BILLING_REMIT', address_line1: '100 Shipping Ln', city: 'Seattle', postal_code: '98101', country: 'US', is_primary: true }
        ],
        contacts: [
          { full_name: 'Jane Doe', email: 'jane@globallogistics.com', phone: '555-0100', role: 'SOURCING', is_primary: true }
        ],
        certifications: [
          { cert_type: 'ISO_9001', cert_number: 'ISO-9001-Seattle-981', issuing_authority: 'SGS Audits', issue_date: '2025-01-01', expiry_date: '2026-12-31' }
        ]
      },
      {
        id: '2',
        name: 'Alpha Parts Manufacturing',
        tax_id: 'US-88776655',
        primary_email: 'accounts@alphaparts.com',
        payment_terms: 'Net 45',
        currency: 'EUR',
        lead_time_days: 12,
        otif_target: 98,
        otif_score: 92.4,
        defect_rate: 1.85,
        purchasing_hold: false,
        payment_hold: true,
        notes: 'Warning: bank details re-verification pending.',
        addresses: [],
        contacts: [],
        certifications: []
      }
    ]);
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Tab Interception (Subscription Gates) ---
  const handleTabChange = (index: number) => {
    if (index === 1 && activePlan !== 'Premium') {
      setShowUpgradeGate('Sourcing Performance Analytics & Defect Metrics');
      return;
    }
    if (index === 2 && activePlan !== 'Premium') {
      setShowUpgradeGate('Compliance Auditing & Document Expiring Scanning');
      return;
    }
    setSelectedIndex(index);
  };

  // --- Save Supplier (Create or Update) ---
  const handleSaveSupplier = async (payload: SupplierCommercialData) => {
    if (activePlan === 'Basic' && suppliers.length >= 1 && !payload.id) {
      setShowUpgradeGate('Supplier Onboarding (Basic limits to 1 active record)');
      return;
    }

    try {
      let res;
      if (payload.id) {
        res = await fetch(`/api/v1/supply-chain/suppliers/${payload.id}?version_id=${payload.version_id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/v1/supply-chain/suppliers', {
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
          showToast('error', body.detail || 'Failed to save supplier record.');
        }
      } else {
        showToast('success', `Supplier '${payload.name}' saved successfully.`);
        setIsDrawerOpen(false);
        fetchAllData();
      }
    } catch {
      // Offline/Mock simulation fallback
      if (payload.id) {
        setSuppliers(suppliers.map(s => s.id === payload.id ? { ...payload, version_id: (payload.version_id || 1) + 1 } : s));
      } else {
        setSuppliers([...suppliers, { ...payload, id: crypto.randomUUID(), otif_score: 100, defect_rate: 0 }]);
      }
      showToast('success', `Supplier saved successfully (offline simulation mode).`);
      setIsDrawerOpen(false);
    }
  };

  // --- Toggle Holds (Purchasing/Payment Blocks) ---
  const handleToggleHold = async (supplier: SupplierCommercialData, type: 'purchasing' | 'payment') => {
    if (activePlan === 'Basic') {
      setShowUpgradeGate('Supplier Purchasing & Payment Holds Gating');
      return;
    }

    const nextPurchasingHold = type === 'purchasing' ? !supplier.purchasing_hold : supplier.purchasing_hold;
    const nextPaymentHold = type === 'payment' ? !supplier.payment_hold : supplier.payment_hold;
    
    try {
      const res = await fetch(`/api/v1/supply-chain/suppliers/${supplier.id}/holds?purchasing_hold=${nextPurchasingHold}&payment_hold=${nextPaymentHold}`, {
        method: 'PATCH',
        headers
      });
      if (res.ok) {
        showToast('success', `Sourcing block state successfully updated.`);
        fetchAllData();
      }
    } catch {
      setSuppliers(suppliers.map(s => s.id === supplier.id ? { ...s, purchasing_hold: nextPurchasingHold, payment_hold: nextPaymentHold } : s));
      showToast('success', `Sourcing hold modified (offline simulation mode).`);
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
          }}>Supplier Master Directory</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Onboard corporate suppliers, manage multi-address logs, check rolling OTIF evaluations, and audit compliance certificates.</p>
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
          <Tab><Truck size={16} style={{ marginRight: 8 }} /> Supplier Directory</Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={16} /> Logistics & Performance Scorecard
              {activePlan !== 'Premium' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldAlert size={16} /> Compliance & Expirations Hub
              {activePlan !== 'Premium' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
        </TabList>

        <TabPanels style={{ marginTop: '20px' }}>
          {/* Supplier Directory Tab */}
          <TabPanel>
            <SupplierListTab 
              suppliers={suppliers}
              search={search}
              setSearch={setSearch}
              loading={loading}
              onOnboard={() => {
                setSelectedSupplier(null);
                setIsDrawerOpen(true);
              }}
              onEdit={(s) => {
                setSelectedSupplier(s);
                setIsDrawerOpen(true);
              }}
              onToggleHold={handleToggleHold}
            />
          </TabPanel>

          {/* Sourcing Performance Tab (Premium Gated) */}
          <TabPanel>
            {activePlan === 'Premium' ? (
              <SupplierPerformanceTab suppliers={suppliers} />
            ) : (
              <Card style={{ padding: '40px', textAlign: 'center' }}>
                <LockGatePrompt requiredFeature="Sourcing Performance Scorecards" onUpgrade={() => setShowUpgradeGate('Strategic Supplier Metrics & OTIF trends')} />
              </Card>
            )}
          </TabPanel>

          {/* Compliance Tab (Premium Gated) */}
          <TabPanel>
            {activePlan === 'Premium' ? (
              <SupplierComplianceTab suppliers={suppliers} />
            ) : (
              <Card style={{ padding: '40px', textAlign: 'center' }}>
                <LockGatePrompt requiredFeature="Compliance Certification Tracking" onUpgrade={() => setShowUpgradeGate('Compliance Certification Audits & Tracking')} />
              </Card>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Drawer */}
      <SupplierDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedSupplier={selectedSupplier}
        onSave={handleSaveSupplier}
        activePlan={activePlan}
        onTriggerUpgradeGate={(feat) => setShowUpgradeGate(feat)}
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
        {requiredFeature} is a Premium Tier feature. Upgrade your platform package to unlock rolling analytics.
      </p>
      <Button variant="primary" onClick={onUpgrade} style={{ marginTop: 8 }}>
        Explore Upgrade Options
      </Button>
    </div>
  );
};
