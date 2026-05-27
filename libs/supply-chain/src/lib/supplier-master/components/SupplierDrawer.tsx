import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, TabGroup, TabList, Tab, TabPanels, TabPanel, Card, Table, Badge } from '@bes/shared-ui';

import { SupplierCommercialData, SupplierAddressData, SupplierContactData, SupplierCertificationData } from '../types';

interface SupplierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSupplier: SupplierCommercialData | null;
  onSave: (supplier: SupplierCommercialData) => void;
  activePlan: 'Basic' | 'Pro' | 'Premium';
  onTriggerUpgradeGate: (feature: string) => void;
}

export const SupplierDrawer: React.FC<SupplierDrawerProps> = ({
  isOpen,
  onClose,
  selectedSupplier,
  onSave,
  activePlan,
  onTriggerUpgradeGate
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // Core Fields
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  
  // Extension Fields
  const [currency, setCurrency] = useState('USD');
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [otifTarget, setOtifTarget] = useState(95.0000);
  const [notes, setNotes] = useState('');

  // Collections
  const [addresses, setAddresses] = useState<SupplierAddressData[]>([]);
  const [contacts, setContacts] = useState<SupplierContactData[]>([]);
  const [certifications, setCertifications] = useState<SupplierCertificationData[]>([]);

  // Inline Form States
  const [newAddr, setNewAddr] = useState<SupplierAddressData>({
    address_type: 'BILLING_REMIT', address_line1: '', city: '', postal_code: '', country: 'US', is_primary: false
  });
  const [newContact, setNewContact] = useState<SupplierContactData>({
    full_name: '', email: '', phone: '', role: 'SOURCING', is_primary: false
  });
  const [newCert, setNewCert] = useState<SupplierCertificationData>({
    cert_type: 'ISO_9001', cert_number: '', issuing_authority: '', issue_date: '', expiry_date: ''
  });

  // Warning for sensitive coordinates modification
  const [routingModified, setRoutingModified] = useState(false);
  const [routingCode, setRoutingCode] = useState('123456789');

  useEffect(() => {
    if (selectedSupplier) {
      setName(selectedSupplier.name || '');
      setTaxId(selectedSupplier.tax_id || '');
      setEmail(selectedSupplier.primary_email || '');
      setPaymentTerms(selectedSupplier.payment_terms || 'Net 30');
      setCurrency(selectedSupplier.currency || 'USD');
      setLeadTimeDays(selectedSupplier.lead_time_days || 7);
      setOtifTarget(selectedSupplier.otif_target || 95);
      setNotes(selectedSupplier.notes || '');
      setAddresses(selectedSupplier.addresses || []);
      setContacts(selectedSupplier.contacts || []);
      setCertifications(selectedSupplier.certifications || []);
      setRoutingModified(false);
    } else {
      setName('');
      setTaxId('');
      setEmail('');
      setPaymentTerms('Net 30');
      setCurrency('USD');
      setLeadTimeDays(7);
      setOtifTarget(95);
      setNotes('');
      setAddresses([]);
      setContacts([]);
      setCertifications([]);
      setRoutingModified(false);
    }
    setActiveTab(0);
  }, [selectedSupplier, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SupplierCommercialData = {
      ...selectedSupplier,
      name,
      tax_id: taxId || undefined,
      primary_email: email || undefined,
      payment_terms: paymentTerms || undefined,
      currency,
      lead_time_days: Number(leadTimeDays),
      otif_target: Number(otifTarget),
      notes: notes || undefined,
      addresses,
      contacts,
      certifications,
      purchasing_hold: selectedSupplier?.purchasing_hold || false,
      payment_hold: selectedSupplier?.payment_hold || routingModified,  // Toggle hold if routing details modified!
      version_id: selectedSupplier?.version_id || 1
    };
    onSave(payload);
  };

  const handleAddAddress = () => {
    if (!newAddr.address_line1 || !newAddr.city || !newAddr.postal_code) return;
    setAddresses([...addresses, { ...newAddr, id: crypto.randomUUID() }]);
    setNewAddr({
      address_type: 'BILLING_REMIT', address_line1: '', city: '', postal_code: '', country: 'US', is_primary: false
    });
  };

  const handleAddContact = () => {
    if (!newContact.full_name) return;
    setContacts([...contacts, { ...newContact, id: crypto.randomUUID() }]);
    setNewContact({
      full_name: '', email: '', phone: '', role: 'SOURCING', is_primary: false
    });
  };

  const handleAddCert = () => {
    if (!newCert.cert_number || !newCert.issuing_authority || !newCert.issue_date || !newCert.expiry_date) return;
    setCertifications([...certifications, { ...newCert, id: crypto.randomUUID(), is_active: true }]);
    setNewCert({
      cert_type: 'ISO_9001', cert_number: '', issuing_authority: '', issue_date: '', expiry_date: ''
    });
  };

  const handleTabChange = (index: number) => {
    if (index === 4 && activePlan !== 'Premium') {
      onTriggerUpgradeGate('Compliance Certification Audits & Tracking');
      return;
    }
    if (index === 5 && activePlan !== 'Premium') {
      onTriggerUpgradeGate('Supplier Scorecard Performance Trends');
      return;
    }
    setActiveTab(index);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedSupplier?.id ? `Edit Supplier Profile: ${selectedSupplier.name}` : 'Onboard New Supplier'}
      maxWidth="620px"
      noScroll={true}
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Supplier</Button>
        </div>
      }
    >
      <TabGroup fillHeight selectedIndex={activeTab} onChange={handleTabChange}>
        <TabList>
          <Tab>General</Tab>
          <Tab>Purchasing</Tab>
          <Tab>Addresses</Tab>
          <Tab>Contacts</Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Certs {activePlan !== 'Premium' && '🔒'}
            </div>
          </Tab>
          <Tab>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Scorecard {activePlan !== 'Premium' && '🔒'}
            </div>
          </Tab>
        </TabList>

        <TabPanels style={{ marginTop: '20px' }}>
          {/* Tab 1: General */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Supplier Corporate Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Global Logistics Corp"
                required
              />
              <Input
                label="Tax Identification / VAT Number"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. VAT-99112233"
              />
              <Input
                label="Primary Sourcing Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sales@globalsourcing.com"
              />
              <Input
                label="Internal Account Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                placeholder="Negotiation summaries, warehouse logistics restrictions..."
              />
            </div>
          </TabPanel>

          {/* Tab 2: Purchasing & Financial */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  Default Sourcing Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8,
                    border: '1px solid var(--ui-gray-300)', fontSize: '0.875rem'
                  }}
                  disabled={activePlan === 'Basic'}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
                {activePlan === 'Basic' && <div style={{ fontSize: '0.75rem', color: 'var(--ui-gray-400)', marginTop: 4 }}><span role="img" aria-label="locked">🔒</span> Locked to USD in Basic Tier</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  Commercial Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8,
                    border: '1px solid var(--ui-gray-300)', fontSize: '0.875rem'
                  }}
                >
                  <option value="Net 30">Net 30 days</option>
                  <option value="Net 45">Net 45 days</option>
                  <option value="Net 60">Net 60 days</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              <Input
                label="Standard Lead Time (Days)"
                type="number"
                value={leadTimeDays.toString()}
                onChange={(e) => setLeadTimeDays(Number(e.target.value) || 0)}
                placeholder="7"
                disabled={activePlan === 'Basic'}
              />

              <Input
                label="Target rolling OTIF (%)"
                type="number"
                value={otifTarget.toString()}
                onChange={(e) => setOtifTarget(Number(e.target.value) || 0)}
                placeholder="95"
                disabled={activePlan === 'Basic'}
              />

              {/* Maker-Checker Sensitive Fields (ACH Routing Coordinates) */}
              <Card style={{ padding: 16, border: '1px solid #fecaca', background: '#fef2f2' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 700, color: '#991b1b' }}>ACH / Wire Banking Coordinates</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#7f1d1d' }}>
                  Sensitive Field Alert: Modifying vendor routing codes triggers a Maker-Checker process and automatically places the supplier on a <strong>Payment Hold</strong> until verified by a secondary administrator.
                </p>
                <Input
                  label="ACH Routing Transit Number"
                  value={routingCode}
                  onChange={(e) => {
                    setRoutingCode(e.target.value);
                    setRoutingModified(true);
                  }}
                  style={{ padding: 6 }}
                />
                {routingModified && (
                  <Badge variant="danger" style={{ marginTop: 8 }}>
                    <span role="img" aria-label="warning">⚠️</span> Triggers Payment Freeze On Save
                  </Badge>
                )}
              </Card>
            </div>
          </TabPanel>

          {/* Tab 3: Addresses */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Address Form */}
              <Card style={{ padding: 16, background: 'var(--ui-gray-55)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Add Address Record</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Type</label>
                    <select
                      value={newAddr.address_type}
                      onChange={(e) => setNewAddr({ ...newAddr, address_type: e.target.value })}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid var(--ui-gray-300)', fontSize: '0.8rem' }}
                    >
                      <option value="BILLING_REMIT">Remit-to Payment</option>
                      <option value="SHIP_FROM">Ship-from Warehouse</option>
                    </select>
                  </div>
                  <Input
                    label="Postal Code"
                    value={newAddr.postal_code}
                    onChange={(e) => setNewAddr({ ...newAddr, postal_code: e.target.value })}
                  />
                </div>
                <Input
                  label="Street Address Line 1"
                  value={newAddr.address_line1}
                  onChange={(e) => setNewAddr({ ...newAddr, address_line1: e.target.value })}
                  style={{ marginBottom: 12 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Input
                    label="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  />
                  <Input
                    label="Country"
                    value={newAddr.country}
                    onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                  />
                </div>
                <Button variant="secondary" onClick={handleAddAddress} size="sm">Add Address</Button>
              </Card>

              {/* Address List */}
              <Table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Street Address</th>
                    <th>City</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((a, i) => (
                    <tr key={a.id || i}>
                      <td><Badge variant="info">{a.address_type.replace('_', ' ')}</Badge></td>
                      <td>{a.address_line1}</td>
                      <td>{a.city}</td>
                      <td>{a.country}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </TabPanel>

          {/* Tab 4: Contacts */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Contact Form */}
              <Card style={{ padding: 16, background: 'var(--ui-gray-55)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Add Contact Card</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Input
                    label="Full Name"
                    value={newContact.full_name}
                    onChange={(e) => setNewContact({ ...newContact, full_name: e.target.value })}
                  />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Role</label>
                    <select
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid var(--ui-gray-300)', fontSize: '0.8rem' }}
                    >
                      <option value="SOURCING">Purchasing/Sourcing</option>
                      <option value="FINANCE">Finance/Accounts</option>
                      <option value="LOGISTICS">Logistics/Shipping</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Input
                    label="Email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>
                <Button variant="secondary" onClick={handleAddContact} size="sm">Add Contact</Button>
              </Card>

              {/* Contacts List */}
              <Table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Role</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr key={c.id || i}>
                      <td style={{ fontWeight: 600 }}>{c.full_name}</td>
                      <td><Badge variant="info">{c.role}</Badge></td>
                      <td>{c.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </TabPanel>

          {/* Tab 5: Certifications (Premium Gated) */}
          <TabPanel>
            {activePlan === 'Premium' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card style={{ padding: 16, background: 'var(--ui-gray-55)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Upload ISO / Regulatory Certificate</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Type</label>
                      <select
                        value={newCert.cert_type}
                        onChange={(e) => setNewCert({ ...newCert, cert_type: e.target.value })}
                        style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid var(--ui-gray-300)', fontSize: '0.8rem' }}
                      >
                        <option value="ISO_9001">ISO 9001 Quality</option>
                        <option value="ISO_14001">ISO 14001 Environment</option>
                        <option value="LIABILITY_INSURANCE">Liability Insurance</option>
                      </select>
                    </div>
                    <Input
                      label="Certificate Number"
                      value={newCert.cert_number}
                      onChange={(e) => setNewCert({ ...newCert, cert_number: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <Input
                      label="Issuing Authority"
                      value={newCert.issuing_authority}
                      onChange={(e) => setNewCert({ ...newCert, issuing_authority: e.target.value })}
                    />
                    <Input
                      label="Issue Date"
                      type="date"
                      value={newCert.issue_date}
                      onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                    />
                    <Input
                      label="Expiry Date"
                      type="date"
                      value={newCert.expiry_date}
                      onChange={(e) => setNewCert({ ...newCert, expiry_date: e.target.value })}
                    />
                  </div>
                  <Button variant="secondary" onClick={handleAddCert} size="sm">Add Certificate</Button>
                </Card>

                <Table>
                  <thead>
                    <tr>
                      <th>Cert Type</th>
                      <th>License Code</th>
                      <th>Authority</th>
                      <th>Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certifications.map((c, i) => (
                      <tr key={c.id || i}>
                        <td><Badge variant="info">{c.cert_type.replace('_', ' ')}</Badge></td>
                        <td>{c.cert_number}</td>
                        <td>{c.issuing_authority}</td>
                        <td style={{ fontWeight: 500 }}>{c.expiry_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </TabPanel>

          {/* Tab 6: Performance Analytics (Premium Gated) */}
          <TabPanel>
            {activePlan === 'Premium' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card style={{ padding: 16, border: '1px solid var(--ui-gray-200)', display: 'flex', gap: 12, flexDirection: 'column' }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>Active Rolling KPIs</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ padding: 12, background: 'var(--ui-gray-50)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ui-gray-400)', fontWeight: 600 }}>Rolling OTIF Rate</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                        {selectedSupplier?.otif_score ? `${Number(selectedSupplier.otif_score).toFixed(1)}%` : '100.0%'}
                      </div>
                    </div>
                    <div style={{ padding: 12, background: 'var(--ui-gray-50)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ui-gray-400)', fontWeight: 600 }}>Defect Rate</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginTop: 4 }}>
                        {selectedSupplier?.defect_rate ? `${Number(selectedSupplier.defect_rate).toFixed(2)}%` : '0.00%'}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Drawer>
  );
};
