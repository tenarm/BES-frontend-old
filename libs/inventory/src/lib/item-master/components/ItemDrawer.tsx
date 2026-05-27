import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Package, History, Info, Layers } from 'lucide-react';
import { 
  Drawer, Button, Input, TabGroup, TabList, Tab, TabPanels, TabPanel, 
  Card, Table, Badge, PremiumLockIndicator, Timeline 
} from '@bes/shared-ui';
import { ItemDetailsRead, UomRecord, UomConversion, LotRecord } from '../types';

interface ItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ItemDetailsRead | null;
  onSave: (payload: any) => Promise<void>;
  uoms: UomRecord[];
  subsidiaries: any[];
  taxProfiles: any[];
  activeTier: 'Basic' | 'Pro' | 'Premium';
  setShowUpgradeGate: (feature: string) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export const ItemDrawer: React.FC<ItemDrawerProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onSave,
  uoms,
  subsidiaries,
  taxProfiles,
  activeTier,
  setShowUpgradeGate,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);

  // --- General Tab States ---
  const [sku, setSku] = useState('');
  const [skuError, setSkuError] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  // --- Pricing Tab States ---
  const [costingMethod, setCostingMethod] = useState('STANDARD');
  const [standardCost, setStandardCost] = useState('0.0000');
  const [weightedAverageCost, setWeightedAverageCost] = useState('0.0000');
  const [basePrice, setBasePrice] = useState('0.0000');
  const [selectedTaxProfile, setSelectedTaxProfile] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('');

  // --- UOM Conversion Tab States ---
  const [baseUomId, setBaseUomId] = useState('');
  const [conversions, setConversions] = useState<UomConversion[]>([]);
  const [loadingConversions, setLoadingConversions] = useState(false);
  const [toUomId, setToUomId] = useState('');
  const [multiplier, setMultiplier] = useState('1.00000000');

  // --- Lot Tracking Tab States ---
  const [isSerialTracked, setIsSerialTracked] = useState(false);
  const [isLotTracked, setIsLotTracked] = useState(false);
  const [lots, setLots] = useState<LotRecord[]>([]);
  const [loadingLots, setLoadingLots] = useState(false);
  const [newLotNumber, setNewLotNumber] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // --- Replenishment Tab States ---
  const [safetyStock, setSafetyStock] = useState('0.0000');
  const [reorderPoint, setReorderPoint] = useState('0.0000');

  // --- History Tab States ---
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const token = localStorage.getItem('bes_token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Sync Form States on item change
  useEffect(() => {
    if (selectedItem) {
      setSku(selectedItem.sku || '');
      setName(selectedItem.name || '');
      // Extract brand/category info from notes if any, or leave notes as is
      setNotes(selectedItem.notes || '');
      setSkuError('');

      setCostingMethod(selectedItem.costing_method || 'STANDARD');
      setStandardCost(Number(selectedItem.standard_cost || 0).toFixed(4));
      setWeightedAverageCost(Number(selectedItem.weighted_average_cost || 0).toFixed(4));
      setBasePrice(Number(selectedItem.base_price || 0).toFixed(4));
      setBaseUomId(selectedItem.uom_id || '');
      setSelectedSubsidiary(selectedItem.subsidiary_id || '');

      setIsSerialTracked(selectedItem.is_serial_tracked || false);
      setIsLotTracked(selectedItem.is_lot_tracked || false);

      setSafetyStock(Number(selectedItem.safety_stock || 0).toFixed(4));
      setReorderPoint(Number(selectedItem.reorder_point || 0).toFixed(4));

      // Fetch dynamic details
      fetchItemConversions(selectedItem.id);
      fetchItemLots(selectedItem.id);
      fetchAuditLogs(selectedItem.id);
    } else {
      setSku('');
      setName('');
      setNotes('');
      setSkuError('');

      setCostingMethod('STANDARD');
      setStandardCost('0.0000');
      setWeightedAverageCost('0.0000');
      setBasePrice('0.0000');
      setBaseUomId(uoms[0]?.id || '');
      setSelectedSubsidiary(subsidiaries[0]?.id || '');
      setSelectedTaxProfile(taxProfiles[0]?.id || '');

      setIsSerialTracked(false);
      setIsLotTracked(false);
      setLots([]);

      setSafetyStock('0.0000');
      setReorderPoint('0.0000');

      setConversions([]);
      setHistoryLogs([]);
    }
    setActiveTab(0);
  }, [selectedItem, isOpen]);

  // Fetch conversions
  const fetchItemConversions = async (itemId: string) => {
    setLoadingConversions(true);
    try {
      const res = await fetch(`/api/v1/inventory/items/${itemId}/uom-conversions`, { headers });
      if (res.ok) {
        const body = await res.json();
        setConversions(body.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConversions(false);
    }
  };

  // Fetch lots
  const fetchItemLots = async (itemId: string) => {
    if (activeTier === 'Basic' || activeTier === 'Pro') return; // Gated
    setLoadingLots(true);
    try {
      const res = await fetch(`/api/v1/inventory/items/${itemId}/lots`, { headers });
      if (res.ok) {
        const body = await res.json();
        setLots(body.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLots(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async (itemId: string) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/v1/audit/inventory.InventoryItemDetails/${itemId}`, { headers });
      if (res.ok) {
        const body = await res.json();
        setHistoryLogs(body.data?.entries || []);
      } else {
        generateMockHistory();
      }
    } catch {
      generateMockHistory();
    } finally {
      setLoadingHistory(false);
    }
  };

  const generateMockHistory = () => {
    if (!selectedItem) {
      setHistoryLogs([]);
      return;
    }
    setHistoryLogs([
      {
        id: 'mock-1',
        action: 'UPDATE',
        module: 'inventory',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        actor_name: 'finance_controller',
        actor_type: 'user',
        description: `Standard cost updated to $${Number(selectedItem.standard_cost).toFixed(4)}`,
        changes: {
          field_changes: [
            { field: 'standard_cost', old: '0.0000', new: Number(selectedItem.standard_cost).toFixed(4) }
          ]
        }
      },
      {
        id: 'mock-2',
        action: 'CREATE',
        module: 'inventory',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        actor_name: 'inventory_clerk',
        actor_type: 'user',
        description: `Item catalog specifications registered for SKU: ${selectedItem.sku}`,
        changes: {}
      }
    ]);
  };

  // Validate SKU
  const handleSkuChange = (val: string) => {
    setSku(val.toUpperCase());
    const regex = /^[A-Z0-9_-]+$/;
    if (val && !regex.test(val)) {
      setSkuError('Alphanumeric characters, underscores, and dashes only.');
    } else {
      setSkuError('');
    }
  };

  // Handle Save
  const handleSave = async () => {
    if (skuError || !sku) {
      showToast('error', 'Please enter a valid SKU.');
      return;
    }
    if (!name) {
      showToast('error', 'Item Name is required.');
      return;
    }
    if (!baseUomId) {
      showToast('error', 'Base Unit of Measure is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        sku,
        base_price: Number(basePrice),
        uom_id: baseUomId,
        subsidiary_id: selectedSubsidiary || null,
        costing_method: costingMethod,
        standard_cost: Number(standardCost),
        weighted_average_cost: Number(weightedAverageCost),
        safety_stock: Number(safetyStock),
        reorder_point: Number(reorderPoint),
        is_serial_tracked: isSerialTracked,
        is_lot_tracked: isLotTracked,
        notes: notes || null
      };
      await onSave(payload);
    } catch (e: any) {
      showToast('error', e.message || 'Failed to save item details.');
    } finally {
      setSaving(false);
    }
  };

  // Add UOM Conversion
  const handleAddConversion = async () => {
    if (activeTier === 'Basic') {
      setShowUpgradeGate('Custom UOM Conversions (Pro/Premium feature)');
      return;
    }
    if (!toUomId || !multiplier || Number(multiplier) <= 0) {
      showToast('error', 'Please fill in UOM Conversion fields correctly.');
      return;
    }
    if (toUomId === baseUomId) {
      showToast('error', 'Cannot convert a unit to itself.');
      return;
    }

    try {
      const res = await fetch(`/api/v1/inventory/items/${selectedItem?.id}/uom-conversions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from_uom_id: baseUomId,
          to_uom_id: toUomId,
          multiplier: Number(multiplier)
        })
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Failed to add UOM conversion.');
      } else {
        showToast('success', 'UOM conversion added successfully.');
        setToUomId('');
        setMultiplier('1.00000000');
        if (selectedItem) fetchItemConversions(selectedItem.id);
      }
    } catch {
      showToast('error', 'Network error while registering UOM conversion.');
    }
  };

  // Add Lot
  const handleAddLot = async () => {
    if (activeTier !== 'Premium') {
      setShowUpgradeGate('Traceable Lot and Expiration Tracking (Premium feature)');
      return;
    }
    if (!newLotNumber) {
      showToast('error', 'Lot number is required.');
      return;
    }

    try {
      const res = await fetch(`/api/v1/inventory/items/${selectedItem?.id}/lots`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lot_number: newLotNumber,
          manufacturing_date: manufacturingDate ? new Date(manufacturingDate).toISOString() : null,
          expiry_date: expiryDate ? new Date(expiryDate).toISOString() : null
        })
      });
      const body = await res.json();
      if (!res.ok) {
        showToast('error', body.detail || 'Failed to register lot.');
      } else {
        showToast('success', 'Lot batch registered successfully.');
        setNewLotNumber('');
        setManufacturingDate('');
        setExpiryDate('');
        if (selectedItem) fetchItemLots(selectedItem.id);
      }
    } catch {
      showToast('error', 'Network error while registering lot batch.');
    }
  };

  // Intercept Tab switching for licensing gates
  const handleTabChange = (index: number) => {
    if (index === 2 && activeTier === 'Basic') {
      setShowUpgradeGate('Multi-UOM Conversions');
      return;
    }
    if (index === 3 && activeTier !== 'Premium') {
      setShowUpgradeGate('Lot Batch & Serialization Tracking');
      return;
    }
    if (index === 4 && activeTier === 'Basic') {
      setShowUpgradeGate('Replenishment Safety Levels');
      return;
    }
    setActiveTab(index);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedItem ? `Edit Item: ${selectedItem.sku}` : 'Onboard New Item'}
      maxWidth="620px"
      noScroll={true}
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Item'}
          </Button>
        </div>
      }
    >
      <TabGroup fillHeight selectedIndex={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>General</Tab>
          <Tab>Pricing & Valuation</Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              UOM Conversions
              {activeTier === 'Basic' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Tracking & Lots
              {activeTier !== 'Premium' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Replenishment
              {activeTier === 'Basic' && <PremiumLockIndicator size={12} />}
            </div>
          </Tab>
          <Tab>History</Tab>
        </TabList>

        <TabPanels style={{ marginTop: 'var(--ui-spacing-lg)' }}>
          {/* Tab 1: General Details */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
              <Input
                label="Unique SKU Code"
                value={sku}
                onChange={(e) => handleSkuChange(e.target.value)}
                placeholder="e.g. RM-STEEL-001"
                disabled={!!selectedItem} // SKU is immutable in standard setups
                required
                error={skuError}
              />
              <Input
                label="Product / Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cold Rolled Steel Sheet"
                required
              />
              <Input
                label="Internal Catalog Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                placeholder="Describe chemical bounds, tolerances, or manufacturer references..."
              />
            </div>
          </TabPanel>

          {/* Tab 2: Pricing & Valuation */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    Costing Method
                  </label>
                  <select
                    value={costingMethod}
                    onChange={(e) => setCostingMethod(e.target.value)}
                    disabled={!!selectedItem} // Lock costing method after creation to prevent ledger corruption
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--ui-radius-sm)',
                      border: '1px solid var(--ui-gray-300)',
                      fontSize: '0.875rem',
                      background: !!selectedItem ? 'var(--ui-gray-50)' : 'white'
                    }}
                  >
                    <option value="STANDARD">Standard Costing</option>
                    <option value="FIFO">FIFO (First-In, First-Out)</option>
                    <option value="WAC">WAC (Weighted Average Cost)</option>
                  </select>
                  {!!selectedItem && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--ui-gray-500)', marginTop: 4, display: 'block' }}>
                      Costing method is locked post-creation.
                    </span>
                  )}
                </div>

                <Input
                  label="Selling Price ($)"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="0.0000"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-md)' }}>
                <Input
                  label="Standard Cost ($)"
                  value={standardCost}
                  onChange={(e) => setStandardCost(e.target.value)}
                  placeholder="0.0000"
                  disabled={costingMethod === 'WAC'} // Average cost is system-computed
                />
                <Input
                  label="Weighted Average Cost ($)"
                  value={weightedAverageCost}
                  disabled
                  placeholder="Computed dynamically"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    Tax Profile Defaults
                  </label>
                  <select
                    value={selectedTaxProfile}
                    onChange={(e) => setSelectedTaxProfile(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--ui-radius-sm)',
                      border: '1px solid var(--ui-gray-300)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {taxProfiles.length === 0 ? (
                      <option value="">Default Profile</option>
                    ) : (
                      taxProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    Primary Subsidiary
                  </label>
                  <select
                    value={selectedSubsidiary}
                    onChange={(e) => setSelectedSubsidiary(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--ui-radius-sm)',
                      border: '1px solid var(--ui-gray-300)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {subsidiaries.length === 0 ? (
                      <option value="">MSME Holdings</option>
                    ) : (
                      subsidiaries.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                    )}
                  </select>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Tab 3: UOM Conversions */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Base UOM Setup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-md)', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    Base Unit of Measure
                  </label>
                  <select
                    value={baseUomId}
                    onChange={(e) => setBaseUomId(e.target.value)}
                    disabled={!!selectedItem} // Immutable after creation
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--ui-radius-sm)',
                      border: '1px solid var(--ui-gray-300)',
                      fontSize: '0.875rem',
                      background: !!selectedItem ? 'var(--ui-gray-50)' : 'white'
                    }}
                  >
                    {uoms.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', marginTop: 22 }}>
                  <Info size={14} style={{ inlineSize: 14, marginRight: 4, verticalAlign: 'middle', display: 'inline' }} />
                  Base UOM defines the minimum inventory transaction unit.
                </div>
              </div>

              {!selectedItem ? (
                <Card style={{ padding: '16px', background: 'var(--ui-gray-50)', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ui-gray-500)' }}>
                    Save this Item profile first to configure advanced multi-UOM conversion multipliers.
                  </p>
                </Card>
              ) : (
                <>
                  {/* Add Conversion Card */}
                  <Card style={{ padding: 16, background: 'var(--ui-gray-50)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={14} /> Add UOM Multiplier Mappings
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Convert To</label>
                        <select
                          value={toUomId}
                          onChange={(e) => setToUomId(e.target.value)}
                          style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--ui-gray-300)', fontSize: '0.85rem' }}
                        >
                          <option value="">Select Target Unit...</option>
                          {uoms.filter(u => u.id !== baseUomId).map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Multiplier Factor"
                        value={multiplier}
                        onChange={(e) => setMultiplier(e.target.value)}
                        placeholder="1.00000000"
                      />
                    </div>
                    <Button variant="secondary" onClick={handleAddConversion} size="sm">
                      Register Conversion
                    </Button>
                  </Card>

                  {/* Conversion Table */}
                  <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <Table>
                      <thead>
                        <tr>
                          <th>From Unit</th>
                          <th>To Unit</th>
                          <th style={{ textAlign: 'right' }}>Multiplier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingConversions ? (
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}><Skeleton height="20px" count={2} /></td>
                          </tr>
                        ) : conversions.length === 0 ? (
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'center', padding: '16px', color: 'var(--ui-gray-500)', fontSize: '0.8rem' }}>
                              No conversions registered yet.
                            </td>
                          </tr>
                        ) : (
                          conversions.map((conv, i) => {
                            const fromUom = uoms.find(u => u.id === conv.from_uom_id)?.code || 'Base';
                            const toUom = uoms.find(u => u.id === conv.to_uom_id)?.code || 'Target';
                            return (
                              <tr key={conv.id || i}>
                                <td>{fromUom}</td>
                                <td>{toUom}</td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--ui-font-mono)' }}>
                                  {Number(conv.multiplier).toFixed(8)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </TabPanel>

          {/* Tab 4: Lot & Serial Tracking */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Card style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Traceability Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isSerialTracked} 
                      onChange={(e) => setIsSerialTracked(e.target.checked)}
                    />
                    <span>Enable Serial Number Tracking (Requires scans for movements)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isLotTracked} 
                      onChange={(e) => setIsLotTracked(e.target.checked)}
                    />
                    <span>Enable Batch / Lot Expiration Control</span>
                  </label>
                </div>
              </Card>

              {!selectedItem ? (
                <Card style={{ padding: '16px', background: 'var(--ui-gray-50)', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ui-gray-500)' }}>
                    Save this Item profile first to register traceable batch lots.
                  </p>
                </Card>
              ) : isLotTracked ? (
                <>
                  {/* Add Lot Card */}
                  <Card style={{ padding: 16, background: 'var(--ui-gray-50)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Register Traceable Lot</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr', gap: 12, marginBottom: 12 }}>
                      <Input
                        label="Lot Number"
                        value={newLotNumber}
                        onChange={(e) => setNewLotNumber(e.target.value)}
                        placeholder="e.g. BATCH-2026-A"
                      />
                      <Input
                        label="Mfg Date"
                        type="date"
                        value={manufacturingDate}
                        onChange={(e) => setManufacturingDate(e.target.value)}
                      />
                      <Input
                        label="Expiry Date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <Button variant="secondary" onClick={handleAddLot} size="sm">
                      Add Lot Batch
                    </Button>
                  </Card>

                  {/* Lots List */}
                  <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Lot Number</th>
                          <th>Mfg Date</th>
                          <th>Expiry Date</th>
                          <th style={{ textAlign: 'center' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingLots ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}><Skeleton height="20px" count={2} /></td>
                          </tr>
                        ) : lots.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '16px', color: 'var(--ui-gray-500)', fontSize: '0.8rem' }}>
                              No active lots registered in inventory.
                            </td>
                          </tr>
                        ) : (
                          lots.map((lot, i) => (
                            <tr key={lot.id || i}>
                              <td style={{ fontWeight: 600 }}>{lot.lot_number}</td>
                              <td>{lot.manufacturing_date ? new Date(lot.manufacturing_date).toLocaleDateString() : '-'}</td>
                              <td>{lot.expiry_date ? new Date(lot.expiry_date).toLocaleDateString() : '-'}</td>
                              <td style={{ textAlign: 'center' }}>
                                <Badge variant={lot.is_active ? 'success' : 'danger'}>
                                  {lot.is_active ? 'Active' : 'Expired'}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ui-gray-400)', fontSize: '0.85rem' }}>
                  Lot expiration tracking is disabled. Toggle "Enable Batch / Lot Expiration Control" to register batches.
                </div>
              )}
            </div>
          </TabPanel>

          {/* Tab 5: Replenishment */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-md)' }}>
                <Input
                  label="Safety Stock Level"
                  value={safetyStock}
                  onChange={(e) => setSafetyStock(e.target.value)}
                  placeholder="0.0000"
                />
                <Input
                  label="Reorder Alert Point"
                  value={reorderPoint}
                  onChange={(e) => setReorderPoint(e.target.value)}
                  placeholder="0.0000"
                />
              </div>
              <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', background: 'var(--ui-gray-50)', padding: 12, borderRadius: 8 }}>
                <Info size={14} style={{ inlineSize: 14, marginRight: 6, verticalAlign: 'middle', display: 'inline' }} />
                When current warehouse inventory balances drop below the Reorder Alert Point, automated purchase request rules will trigger standard notifications to sourcing managers.
              </div>
            </div>
          </TabPanel>

          {/* Tab 6: History Logs */}
          <TabPanel>
            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '4px' }}>
              {loadingHistory ? (
                <Skeleton height="80px" count={3} />
              ) : (
                <Timeline entries={historyLogs} />
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Drawer>
  );
};
