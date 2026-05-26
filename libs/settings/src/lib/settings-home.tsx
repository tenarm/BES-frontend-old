import React, { useState, useEffect } from 'react';
import { Building, Calendar, Percent, Globe, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
   Button, Card, Badge, TabGroup, TabList, Tab, TabPanels, TabPanel, UpgradeGateOverlay 
} from '@bes/shared-ui';

import { CompanyProfileData, SubsidiaryData, FiscalCalendarData, TaxProfileData } from './types';
import { CompanyProfileTab } from './components/company-profile-tab';
import { SubsidiariesTab } from './components/subsidiaries-tab';
import { SubsidiaryDrawer } from './components/subsidiary-drawer';
import { FiscalCalendarsTab } from './components/fiscal-calendars-tab';
import { CalendarDrawer } from './components/calendar-drawer';
import { TaxProfilesTab } from './components/tax-profiles-tab';
import { TaxDrawer } from './components/tax-drawer';

export const SettingsHomePage: React.FC = () => {
  // --- Plan Tier Gating (Rule 2.3) ---
  const [activeTier, setActiveTier] = useState<'Basic' | 'Pro' | 'Premium'>(() => {
    const rawPlan = localStorage.getItem('bes_plan') || 'premium';
    return (rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1)) as 'Basic' | 'Pro' | 'Premium';
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
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- Entity Collections ---
  const [profile, setProfile] = useState<CompanyProfileData>({
    legal_name: '', dba_name: '', tax_identifier: '', email: '', phone: '', website: '', default_language: 'en', logo_url: '', version_id: 1
  });
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryData[]>([]);
  const [calendars, setCalendars] = useState<FiscalCalendarData[]>([]);
  const [taxProfiles, setTaxProfiles] = useState<TaxProfileData[]>([]);

  // --- Active Selection / Drawer States ---
  const [drawerOpen, setDrawerOpen] = useState<'subsidiary' | 'calendar' | 'tax' | null>(null);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<SubsidiaryData | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<FiscalCalendarData | null>(null);
  const [selectedTax, setSelectedTax] = useState<TaxProfileData | null>(null);

  // --- Field Error Bounds (Cognitive UX Rule) ---
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const token = localStorage.getItem('bes_token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // --- Toast Trigger Helper ---
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Fetch API Resources ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Company Profile
      const profRes = await fetch('/api/v1/settings/company-profile', { headers });
      if (profRes.ok) {
        const res = await profRes.json();
        setProfile(res.data);
      }

      // 2. Fetch Subsidiaries
      const subRes = await fetch('/api/v1/settings/subsidiaries', { headers });
      if (subRes.ok) {
        const res = await subRes.json();
        setSubsidiaries(res.data);
      }

      // 3. Fetch Fiscal Calendars
      const calRes = await fetch('/api/v1/settings/fiscal-calendars', { headers });
      if (calRes.ok) {
        const res = await calRes.json();
        setCalendars(res.data);
      }

      // 4. Fetch Tax Profiles
      const taxRes = await fetch('/api/v1/settings/tax-profiles', { headers });
      if (taxRes.ok) {
        const res = await taxRes.json();
        setTaxProfiles(res.data);
      }
    } catch {
      showToast('error', 'Failed to retrieve configuration data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Save Company Profile ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Inline regex validation check per rules
    const taxPattern = /^(\d{2}-\d{7}|[A-Z0-9-]{5,20})$/;
    if (profile.tax_identifier && !taxPattern.test(profile.tax_identifier)) {
      setFieldErrors({ tax_identifier: "Format must be XX-XXXXXXX or alphanumeric (5-20 chars)" });
      return;
    }

    try {
      let res;
      if (profile.id) {
        res = await fetch(`/api/v1/settings/company-profile/${profile.id}?version_id=${profile.version_id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(profile)
        });
      } else {
        res = await fetch('/api/v1/settings/company-profile', {
          method: 'POST',
          headers,
          body: JSON.stringify(profile)
        });
      }

      const body = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          showToast('error', 'Concurrency conflict: Changes were made by another admin. Refreshing profile.');
          fetchAllData();
        } else {
          showToast('error', body.detail || 'Failed to save company profile.');
        }
      } else {
        setProfile(body.data);
        showToast('success', 'Company profile successfully updated.');
      }
    } catch {
      showToast('error', 'Network error updating company profile.');
    }
  };

  // --- Save Subsidiary ---
  const handleSaveSubsidiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubsidiary) return;

    if (activeTier === 'Basic' && subsidiaries.length >= 1 && !selectedSubsidiary.id) {
      setShowUpgradeGate('Subsidiaries (Basic tier limits to 1 entity)');
      return;
    }

    setFieldErrors({});
    const taxPattern = /^(\d{2}-\d{7}|[A-Z0-9-]{5,20})$/;
    if (selectedSubsidiary.tax_identifier && !taxPattern.test(selectedSubsidiary.tax_identifier)) {
      setFieldErrors({ tax_identifier: "Format must be XX-XXXXXXX or alphanumeric (5-20 chars)" });
      return;
    }

    try {
      let res;
      if (selectedSubsidiary.id) {
        res = await fetch(`/api/v1/settings/subsidiaries/${selectedSubsidiary.id}?version_id=${selectedSubsidiary.version_id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(selectedSubsidiary)
        });
      } else {
        res = await fetch('/api/v1/settings/subsidiaries', {
          method: 'POST',
          headers,
          body: JSON.stringify(selectedSubsidiary)
        });
      }

      const body = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          showToast('error', 'Conflict error: Subsidiary record modified concurrently by another user.');
        } else {
          showToast('error', body.detail || 'Failed to save subsidiary.');
        }
      } else {
        showToast('success', 'Subsidiary profile registered successfully.');
        setDrawerOpen(null);
        fetchAllData();
      }
    } catch {
      showToast('error', 'Network request failed.');
    }
  };

  // --- Save Fiscal Calendar ---
  const handleSaveCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCalendar) return;

    try {
      const res = await fetch('/api/v1/settings/fiscal-calendars', {
        method: 'POST',
        headers,
        body: JSON.stringify(selectedCalendar)
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Overlap or invalid date range specified.');
      } else {
        showToast('success', 'Fiscal calendar generated with 12 monthly periods.');
        setDrawerOpen(null);
        fetchAllData();
      }
    } catch {
      showToast('error', 'Request execution failed.');
    }
  };

  // --- Save Tax Profile ---
  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTax) return;
    try {
      const res = await fetch('/api/v1/settings/tax-profiles', {
        method: 'POST',
        headers,
        body: JSON.stringify(selectedTax)
      });
      if (res.ok) {
        showToast('success', 'Tax Profile successfully registered.');
        setDrawerOpen(null);
        fetchAllData();
      } else {
        const body = await res.json();
        showToast('error', body.detail || 'Failed to save Tax Profile.');
      }
    } catch {
      showToast('error', 'Network failure.');
    }
  };

  // --- Toggle Period Lock (Pessimistic Locking trigger) ---
  const handleToggleLockPeriod = async (periodId: string, currentLock: boolean) => {
    try {
      const res = await fetch(`/api/v1/settings/posting-periods/${periodId}/lock?is_locked=${!currentLock}`, {
        method: 'PATCH',
        headers
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Lock operation rejected by transaction guard.');
      } else {
        showToast('success', `Posting period successfully ${!currentLock ? 'LOCKED' : 'UNLOCKED'}.`);
        fetchAllData();
      }
    } catch {
      showToast('error', 'Failed lock toggle action.');
    }
  };

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)', position: 'relative', minHeight: '100vh' }}>

      {/* Main Header */}
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
          }}>Company Setup & Configurations</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Manage legal entities, corporate branches, fiscal calendars, and regional tax profiles.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button variant="secondary" onClick={fetchAllData} size="sm">
            <RefreshCw size={14} style={{ marginRight: 6 }} /> Refresh
          </Button>
        </div>
      </header>

      {/* Floating Toast Notification */}
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
          fontWeight: 600,
          animation: 'fadeIn 0.2s'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Tab Panels */}
      {loading ? (
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <RefreshCw className="animate-spin" style={{ margin: '0 auto', color: 'var(--ui-primary)' }} />
        </Card>
      ) : (
        <TabGroup defaultIndex={0}>
          <TabList>
            <Tab><Building size={16} style={{ marginRight: 8 }} /> Company Profile</Tab>
            <Tab><Globe size={16} style={{ marginRight: 8 }} /> Subsidiaries</Tab>
            <Tab><Calendar size={16} style={{ marginRight: 8 }} /> Fiscal Calendars</Tab>
            <Tab><Percent size={16} style={{ marginRight: 8 }} /> Tax Profiles</Tab>
          </TabList>

          <TabPanels style={{ marginTop: '20px' }}>
            {/* Tab 1: Company Profile */}
            <TabPanel>
              <CompanyProfileTab 
                profile={profile} 
                onChange={setProfile} 
                fieldErrors={fieldErrors} 
                onSave={handleSaveProfile} 
              />
            </TabPanel>

            {/* Tab 2: Subsidiaries */}
            <TabPanel>
              <SubsidiariesTab 
                subsidiaries={subsidiaries} 
                activeTier={activeTier} 
                onAdd={() => {
                  if (activeTier === 'Basic' && subsidiaries.length >= 1) {
                    setShowUpgradeGate('Multi-Subsidiary Hierarchies');
                  } else {
                    setSelectedSubsidiary({ name: '', base_currency: 'USD', tax_identifier: '', address_billing: '', address_shipping: '', is_active: true, version_id: 1 });
                    setDrawerOpen('subsidiary');
                  }
                }}
                onEdit={(sub) => {
                  setSelectedSubsidiary(sub);
                  setDrawerOpen('subsidiary');
                }}
              />
            </TabPanel>

            {/* Tab 3: Fiscal Calendars */}
            <TabPanel>
              <FiscalCalendarsTab 
                calendars={calendars} 
                activeTier={activeTier} 
                onAdd={() => {
                  if (activeTier === 'Basic' && calendars.length >= 1) {
                    setShowUpgradeGate('Multiple Accounting Years & Locks');
                  } else {
                    setSelectedCalendar({ name: '', start_date: '', end_date: '', status: 'OPEN', version_id: 1 });
                    setDrawerOpen('calendar');
                  }
                }}
                headers={headers}
                onToggleLock={handleToggleLockPeriod}
              />
            </TabPanel>

            {/* Tab 4: Tax Profiles */}
            <TabPanel>
              <TaxProfilesTab 
                taxProfiles={taxProfiles} 
                onAdd={() => {
                  setSelectedTax({ name: '', jurisdiction: '', tax_rate: 0, is_active: true, version_id: 1 });
                  setDrawerOpen('tax');
                }}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}

      {/* --- Drawers --- */}

      <SubsidiaryDrawer 
        isOpen={drawerOpen === 'subsidiary'} 
        onClose={() => setDrawerOpen(null)} 
        selectedSubsidiary={selectedSubsidiary}
        setSelectedSubsidiary={setSelectedSubsidiary}
        fieldErrors={fieldErrors}
        onSave={handleSaveSubsidiary}
      />

      <CalendarDrawer 
        isOpen={drawerOpen === 'calendar'} 
        onClose={() => setDrawerOpen(null)} 
        selectedCalendar={selectedCalendar}
        setSelectedCalendar={setSelectedCalendar}
        onSave={handleSaveCalendar}
      />

      <TaxDrawer 
        isOpen={drawerOpen === 'tax'} 
        onClose={() => setDrawerOpen(null)} 
        selectedTax={selectedTax}
        setSelectedTax={setSelectedTax}
        onSave={handleSaveTax}
      />

      {/* --- Premium Upgrade Overlay --- */}
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
