import React, { useState, useEffect } from 'react';
import { Package, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UpgradeGateOverlay } from '@bes/shared-ui';

import { ItemDetailsRead, UomRecord } from './types';
import { ItemListTab } from './components/ItemListTab';
import { ItemDrawer } from './components/ItemDrawer';

export const ItemMasterPage: React.FC = () => {
  // --- Plan/Tier Scoping (Rule 2.3 Subscription Trails) ---
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
  const [items, setItems] = useState<ItemDetailsRead[]>([]);
  const [uoms, setUoms] = useState<UomRecord[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<any[]>([]);
  const [taxProfiles, setTaxProfiles] = useState<any[]>([]);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // --- Active Selections & Drawers ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemDetailsRead | null>(null);

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
  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = `?page=${page}&page_size=${pageSize}` + (search ? `&search=${encodeURIComponent(search)}` : '');
      const res = await fetch(`/api/v1/inventory/items${q}`, { headers });
      if (res.ok) {
        const body = await res.json();
        setItems(body.data || []);
        setTotal(body.metadata?.total || body.data?.length || 0);
      } else {
        seedMockData();
      }
    } catch {
      seedMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    // 1. Fetch UOMs
    try {
      const res = await fetch('/api/v1/inventory/uoms', { headers });
      if (res.ok) {
        const body = await res.json();
        setUoms(body.data || []);
      } else {
        seedMockUoms();
      }
    } catch {
      seedMockUoms();
    }

    // 2. Fetch Subsidiaries
    try {
      const res = await fetch('/api/v1/settings/subsidiaries', { headers });
      if (res.ok) {
        const body = await res.json();
        setSubsidiaries(body.data || []);
      } else {
        setSubsidiaries([{ id: 'msme-sub', name: 'MSME Primary Subsidiary' }]);
      }
    } catch {
      setSubsidiaries([{ id: 'msme-sub', name: 'MSME Primary Subsidiary' }]);
    }

    // 3. Fetch Tax Profiles
    try {
      const res = await fetch('/api/v1/settings/tax-profiles', { headers });
      if (res.ok) {
        const body = await res.json();
        setTaxProfiles(body.data || []);
      } else {
        setTaxProfiles([{ id: 'tax-vat', name: 'Standard VAT (15%)' }]);
      }
    } catch {
      setTaxProfiles([{ id: 'tax-vat', name: 'Standard VAT (15%)' }]);
    }
  };

  const seedMockUoms = () => {
    setUoms([
      { id: 'ea-uom', code: 'EA', name: 'Each', description: 'Individual units' },
      { id: 'kg-uom', code: 'KG', name: 'Kilograms', description: 'Weight-based measurement' },
      { id: 'box-uom', code: 'BOX', name: 'Box', description: 'Pack of items' },
      { id: 'plt-uom', code: 'PLT', name: 'Pallet', description: 'Pallet bulk unit' }
    ]);
  };

  const seedMockData = () => {
    // Generate some mock inventory items for preview if database is not seeded
    const mockList: ItemDetailsRead[] = [
      {
        id: 'item-1',
        product_id: 'item-1',
        name: 'Cold Rolled Steel Sheet',
        sku: 'RM-STEEL-001',
        base_price: '150.0000',
        uom_id: 'ea-uom',
        subsidiary_id: 'msme-sub',
        is_deleted: false,
        version_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        costing_method: 'STANDARD',
        standard_cost: '95.5000',
        weighted_average_cost: '95.5000',
        safety_stock: '100.0000',
        reorder_point: '250.0000',
        is_serial_tracked: false,
        is_lot_tracked: false,
        notes: 'Category: Raw Materials; Cold rolled steel'
      },
      {
        id: 'item-2',
        product_id: 'item-2',
        name: 'Electric Servo Motor 24V',
        sku: 'COMP-MOTOR-24V',
        base_price: '420.0000',
        uom_id: 'ea-uom',
        subsidiary_id: 'msme-sub',
        is_deleted: false,
        version_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        costing_method: 'WAC',
        standard_cost: '310.0000',
        weighted_average_cost: '315.4200',
        safety_stock: '25.0000',
        reorder_point: '50.0000',
        is_serial_tracked: true,
        is_lot_tracked: true,
        notes: 'Category: Electrical Components; High torque servo'
      }
    ];

    setItems(mockList.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.sku.toLowerCase().includes(search.toLowerCase())
    ));
    setTotal(mockList.length);
  };

  useEffect(() => {
    fetchItems();
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // --- Onboard or Update Item API ---
  const handleSaveItem = async (payload: any) => {
    if (activeTier === 'Basic' && items.length >= 1 && !selectedItem) {
      setShowUpgradeGate('Multiple Item Master Registrations (Basic tier is limited to 1 active item)');
      return;
    }

    const isEditing = !!selectedItem;
    const url = isEditing 
      ? `/api/v1/inventory/items/${selectedItem.id}?version_id=${selectedItem.version_id}` 
      : '/api/v1/inventory/items';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });

    const body = await res.json();
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error('Concurrency Conflict: Record modified by another user in parallel.');
      } else {
        throw new Error(body.detail || 'Failed to save item configuration.');
      }
    } else {
      showToast('success', `Item '${payload.sku}' saved successfully.`);
      setIsDrawerOpen(false);
      fetchItems();
    }
  };

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)', position: 'relative', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Toast Notifications */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toast.type === 'success' ? '#059669' : '#dc2626',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--ui-radius-md)',
          boxShadow: 'var(--ui-shadow-lg)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
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
          }}>Item Master Catalog</h2>
          <p style={{ 
            fontSize: 'var(--ui-text-sm)', 
            color: 'var(--ui-gray-500)', 
            marginTop: '4px' 
          }}>Configure inventory items, base Units of Measure, costing methods, reorder points, and batch tracking.</p>
        </div>
      </header>

      {/* Main Catalog Tab */}
      <ItemListTab 
        items={items}
        search={search}
        setSearch={setSearch}
        loading={loading}
        onOnboard={() => {
          setSelectedItem(null);
          setIsDrawerOpen(true);
        }}
        onEdit={(item) => {
          setSelectedItem(item);
          setIsDrawerOpen(true);
        }}
        onRefresh={fetchItems}
        page={page}
        pageSize={pageSize}
        total={total}
        setPage={setPage}
        setPageSize={setPageSize}
        activeTier={activeTier}
      />

      {/* Onboarding Drawer */}
      <ItemDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedItem={selectedItem}
        onSave={handleSaveItem}
        uoms={uoms}
        subsidiaries={subsidiaries}
        taxProfiles={taxProfiles}
        activeTier={activeTier}
        setShowUpgradeGate={setShowUpgradeGate}
        showToast={showToast}
      />

      {/* Upgrade Plan Overlay Gate */}
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
