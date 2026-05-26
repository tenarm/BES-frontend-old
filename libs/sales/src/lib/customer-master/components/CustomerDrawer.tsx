import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, TabGroup, TabList, Tab, TabPanels, TabPanel, Card, Table } from '@bes/shared-ui';
import { CustomerCommercialData, AddressData, ContactData } from '../types';

interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer: CustomerCommercialData | null;
  onSave: (customer: CustomerCommercialData) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  isOpen,
  onClose,
  selectedCustomer,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // Core Fields
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [creditLimit, setCreditLimit] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');

  // Collections
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [contacts, setContacts] = useState<ContactData[]>([]);

  // Inline Add Forms
  const [newAddr, setNewAddr] = useState<AddressData>({
    address_type: 'BILLING', address_line1: '', city: '', postal_code: '', country: 'US', is_primary: false
  });
  const [newContact, setNewContact] = useState<ContactData>({
    full_name: '', email: '', phone: '', role: 'BILLING'
  });

  useEffect(() => {
    if (selectedCustomer) {
      setName(selectedCustomer.name || '');
      setTaxId(selectedCustomer.tax_id || '');
      setEmail(selectedCustomer.primary_email || '');
      setCreditLimit(selectedCustomer.credit_limit || 0);
      setPaymentTerms(selectedCustomer.payment_terms || 'Net 30');
      setCurrency(selectedCustomer.currency || 'USD');
      setNotes(selectedCustomer.notes || '');
      setAddresses(selectedCustomer.addresses || []);
      setContacts(selectedCustomer.contacts || []);
    } else {
      setName('');
      setTaxId('');
      setEmail('');
      setCreditLimit(0);
      setPaymentTerms('Net 30');
      setCurrency('USD');
      setNotes('');
      setAddresses([]);
      setContacts([]);
    }
    setActiveTab(0);
  }, [selectedCustomer, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CustomerCommercialData = {
      ...selectedCustomer,
      name,
      tax_id: taxId || undefined,
      primary_email: email || undefined,
      credit_limit: Number(creditLimit),
      payment_terms: paymentTerms,
      currency: currency,
      credit_hold: selectedCustomer?.credit_hold || false,
      notes: notes || undefined,
      addresses,
      contacts,
      version_id: selectedCustomer?.version_id || 1
    };
    onSave(payload);
  };

  const handleAddAddress = () => {
    if (!newAddr.address_line1 || !newAddr.city || !newAddr.postal_code) return;
    setAddresses([...addresses, { ...newAddr, id: crypto.randomUUID() }]);
    setNewAddr({
      address_type: 'BILLING', address_line1: '', city: '', postal_code: '', country: 'US', is_primary: false
    });
  };

  const handleAddContact = () => {
    if (!newContact.full_name) return;
    setContacts([...contacts, { ...newContact, id: crypto.randomUUID() }]);
    setNewContact({
      full_name: '', email: '', phone: '', role: 'BILLING'
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedCustomer?.id ? `Edit Customer: ${selectedCustomer.name}` : 'Onboard New Customer'}
      maxWidth="620px"
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Customer</Button>
        </div>
      }
    >
      <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>General</Tab>
          <Tab>Commercials</Tab>
          <Tab>Addresses</Tab>
          <Tab>Contacts</Tab>
        </TabList>

        <TabPanels style={{ marginTop: '20px' }}>
          {/* Tab 1: General */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Customer Legal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
              />
              <Input
                label="Tax Identification / VAT Number"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. US-99887766"
              />
              <Input
                label="Primary Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. billing@acme.com"
              />
            </div>
          </TabPanel>

          {/* Tab 2: Commercials */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  Default Pricing Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--ui-gray-300)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  Commercial Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--ui-gray-300)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="Net 30">Net 30 days</option>
                  <option value="Net 45">Net 45 days</option>
                  <option value="Net 60">Net 60 days</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              <Input
                label="Credit Limit ($)"
                type="number"
                value={creditLimit.toString()}
                onChange={(e) => setCreditLimit(Number(e.target.value) || 0)}
                placeholder="0.00"
              />

              <Input
                label="Internal Account Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                placeholder="Specify credit rating details or VIP parameters..."
              />
            </div>
          </TabPanel>

          {/* Tab 3: Addresses */}
          <TabPanel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Address Form */}
              <Card style={{ padding: 16, background: 'var(--ui-gray-50)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Add Address Record</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Type</label>
                    <select
                      value={newAddr.address_type}
                      onChange={(e) => setNewAddr({ ...newAddr, address_type: e.target.value })}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid var(--ui-gray-300)', fontSize: '0.8rem' }}
                    >
                      <option value="BILLING">Billing Address</option>
                      <option value="SHIPPING">Shipping Address</option>
                    </select>
                  </div>
                  <Input
                    label="Postal Code"
                    value={newAddr.postal_code}
                    onChange={(e) => setNewAddr({ ...newAddr, postal_code: e.target.value })}
                    style={{ padding: 6 }}
                  />
                </div>
                <Input
                  label="Address Line 1"
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
                    <th>Street</th>
                    <th>City</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((a, i) => (
                    <tr key={a.id || i}>
                      <td><Badge variant="info">{a.address_type}</Badge></td>
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
              <Card style={{ padding: 16, background: 'var(--ui-gray-50)' }}>
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
                      <option value="BILLING">Billing/Accounts</option>
                      <option value="PURCHASING">Buyer/Purchasing</option>
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
        </TabPanels>
      </TabGroup>
    </Drawer>
  );
};
