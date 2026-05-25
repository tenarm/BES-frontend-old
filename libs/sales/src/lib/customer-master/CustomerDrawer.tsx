import React, { useEffect, useState } from 'react';
import { useCustomerStore, Customer, CustomerAddress, CustomerContact } from './store';
import { useAuthStore } from '../../../../../apps/shell/src/store/auth-store';
import {
  SlideOutDrawer,
  Button,
  Input,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  PremiumLockIndicator,
  UpgradeGateOverlay,
  FeedbackAlert,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Timeline
} from '@bes/shared-ui';
import styles from './customer-master.module.css';

interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({ isOpen, onClose, mode }) => {
  const activeModules = useAuthStore((s) => s.activeModules) || [];
  const {
    customers,
    selectedCustomer,
    selectedCustomerCredit,
    selectedCustomerAddresses,
    selectedCustomerContacts,
    conflictDetails,
    createCustomer,
    updateCustomer,
    addAddress,
    deleteAddress,
    addContact,
    deleteContact,
    updateCredit,
    resolveConflict
  } = useCustomerStore();

  const [activeTab, setActiveTab] = useState(0);

  // Form states: Profile
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [parentId, setParentId] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  // Form states: New Address
  const [addrType, setAddrType] = useState('SHIPPING');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('US');
  const [isAddrDefault, setIsAddrDefault] = useState(false);

  // Form states: New Contact
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dept, setDept] = useState('');

  // Form states: Credit Limits
  const [creditLimit, setCreditLimit] = useState(0);
  const [terms, setTerms] = useState('NET30');

  // Load selected customer into form states
  useEffect(() => {
    if (selectedCustomer && mode === 'edit') {
      setName(selectedCustomer.name);
      setTaxId(selectedCustomer.tax_id || '');
      setEmail(selectedCustomer.primary_email || '');
      setParentId(selectedCustomer.parent_customer_id || '');
      setStatus(selectedCustomer.status);
    } else {
      setName('');
      setTaxId('');
      setEmail('');
      setParentId('');
      setStatus('ACTIVE');
    }
  }, [selectedCustomer, mode]);

  useEffect(() => {
    if (selectedCustomerCredit) {
      setCreditLimit(Number(selectedCustomerCredit.credit_limit));
      setTerms(selectedCustomerCredit.payment_terms_code || 'NET30');
    } else {
      setCreditLimit(0);
      setTerms('NET30');
    }
  }, [selectedCustomerCredit]);

  const hasCreditManagement = activeModules.includes('sales_pro') || activeModules.includes('sales_premium');
  const hasContactsGated = activeModules.includes('sales_pro') || activeModules.includes('sales_premium');
  const hasMultipleAddresses = activeModules.includes('sales_pro') || activeModules.includes('sales_premium');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      tax_id: taxId || null,
      primary_email: email || null,
      parent_customer_id: parentId || null,
      status
    };

    try {
      if (mode === 'create') {
        await createCustomer(payload);
        onClose();
      } else if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, {
          ...payload,
          version_id: selectedCustomer.version_id
        });
      }
    } catch (err) {
      // Conflict alert or validation error handled by store
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const payload = {
      address_type: addrType,
      street_address: street,
      city,
      state: state || null,
      postal_code: postal || null,
      country_code: country,
      is_default: isAddrDefault
    };

    try {
      await addAddress(selectedCustomer.id, payload);
      setStreet('');
      setCity('');
      setState('');
      setPostal('');
      setIsAddrDefault(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const payload = {
      first_name: firstName,
      last_name: lastName || null,
      email: contactEmail || null,
      phone: phone || null,
      department: dept || null
    };

    try {
      await addContact(selectedCustomer.id, payload);
      setFirstName('');
      setLastName('');
      setContactEmail('');
      setPhone('');
      setDept('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedCustomerCredit) return;

    const payload = {
      credit_limit: creditLimit,
      payment_terms_code: terms,
      version_id: selectedCustomerCredit.version_id
    };

    try {
      await updateCredit(selectedCustomer.id, payload);
    } catch (e) {
      console.error(e);
    }
  };

  // Mock Timeline entries
  const mockActivityEntries = selectedCustomer ? [
    {
      id: 'act-1',
      module: 'sales',
      action: 'CUSTOMER_CREATED',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      description: `Customer card registered for "${selectedCustomer.name}" by sales account.`,
      actor_type: 'user' as const,
      actor_name: 'John Sales'
    },
    {
      id: 'act-2',
      module: 'sales',
      action: 'CUSTOMER_CREDIT_HOLD',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      description: 'Credit limits breach: sales order #SO-882 placed on hold.',
      actor_type: 'system' as const,
      actor_name: 'System Engine',
      changes: {
        triggered_event: 'CUSTOMER_CREDIT_HOLD',
        field_changes: [
          { field: 'outstanding_balance', old: '12,450.00', new: '52,300.00', context: 'Outstanding Balance' },
          { field: 'status', old: 'ACTIVE', new: 'CREDIT_HOLD', context: 'Status' }
        ]
      }
    }
  ] : [];

  return (
    <SlideOutDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Register New Customer' : `Customer Details: ${name}`}
      size="large"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
        
        {/* Concurrency Conflict Overlays (HTTP 409) */}
        {conflictDetails && (
          <FeedbackAlert
            variant="warning"
            title="Update Conflict Detected"
            style={{ marginBottom: 'var(--ui-spacing-sm)' }}
          >
            <div>
              Another user has updated this customer profile. Please choose whether to overwrite their changes or discard yours and refresh.
            </div>
            <div className={styles.conflictDiffGrid} style={{ marginTop: 'var(--ui-spacing-xs)' }}>
              <div className={styles.conflictCol}>
                <span className={styles.conflictTitle}>Local Changes (Your Form)</span>
                <span className={styles.conflictValue}>Name: {conflictDetails.local.name}</span>
                <span className={styles.conflictValue}>Email: {conflictDetails.local.primary_email || '—'}</span>
              </div>
              <div className={styles.conflictCol}>
                <span className={styles.conflictTitle}>Server Changes (Other User)</span>
                <span className={styles.conflictValue}>Name: {conflictDetails.server.name}</span>
                <span className={styles.conflictValue}>Email: {conflictDetails.server.primary_email || '—'}</span>
              </div>
            </div>
            <div className={styles.conflictActions} style={{ marginTop: 'var(--ui-spacing-xs)' }}>
              <Button variant="primary" onClick={() => resolveConflict('overwrite')}>
                Overwrite Server
              </Button>
              <Button variant="secondary" onClick={() => resolveConflict('discard')}>
                Discard & Refresh
              </Button>
            </div>
          </FeedbackAlert>
        )}

        <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>Profile</Tab>
            {mode === 'edit' && (
              <>
                <Tab>
                  Addresses
                  {!hasMultipleAddresses && selectedCustomerAddresses.length >= 1 && <PremiumLockIndicator style={{ marginLeft: '4px' }} />}
                </Tab>
                <Tab>
                  Contacts
                  {!hasContactsGated && <PremiumLockIndicator style={{ marginLeft: '4px' }} />}
                </Tab>
                <Tab>
                  Credit & Finance
                  {!hasCreditManagement && <PremiumLockIndicator style={{ marginLeft: '4px' }} />}
                </Tab>
                <Tab>Activity</Tab>
              </>
            )}
          </TabList>

          <TabPanels style={{ marginTop: 'var(--ui-spacing-md)' }}>
            {/* Tab 1: Profile Info Form */}
            <TabPanel>
              <form onSubmit={handleSaveProfile} className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.label}>Customer Name / Company Name</label>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tax Registry ID / VAT Code</label>
                  <input
                    className={styles.input}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. VAT-GB987654321"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primary Billing Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@acme.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Parent Customer Account</label>
                  <select
                    className={styles.select}
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <option value="">-- Independent Account (No Parent) --</option>
                    {customers
                      .filter(c => selectedCustomer ? c.id !== selectedCustomer.id : true)
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Customer Status</label>
                  <select
                    className={styles.select}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="ACTIVE">Active (Trading Enabled)</option>
                    <option value="INACTIVE">Inactive (Trading Suspended)</option>
                    {mode === 'edit' && <option value="CREDIT_HOLD">Credit Hold (Orders Blocked)</option>}
                  </select>
                </div>

                <div className={styles.stickyFooter} style={{ gridColumn: 'span 2' }}>
                  <Button variant="secondary" onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Save Profile
                  </Button>
                </div>
              </form>
            </TabPanel>

            {mode === 'edit' && (
              <>
                {/* Tab 2: Addresses Tab (Gated if adding multiple) */}
                <TabPanel>
                  <div className={styles.tabLockedContainer}>
                    {!hasMultipleAddresses && selectedCustomerAddresses.length >= 1 && (
                      <UpgradeGateOverlay moduleName="Multi-Site Address Directories" requiredTier="Pro" />
                    )}
                    <div style={!hasMultipleAddresses && selectedCustomerAddresses.length >= 1 ? { opacity: 0.3, pointerEvents: 'none' } : {}} className={styles.drawerTabContent}>
                      <form onSubmit={handleAddAddress} className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Address Type</label>
                          <select className={styles.select} value={addrType} onChange={(e) => setAddrType(e.target.value)}>
                            <option value="BILLING">Billing Address</option>
                            <option value="SHIPPING">Shipping Location</option>
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Street Address</label>
                          <input className={styles.input} value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="123 Industrial Way" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>City</label>
                          <input className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Birmingham" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>State / Region</label>
                          <input className={styles.input} value={state} onChange={(e) => setState(e.target.value)} placeholder="Midlands" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Postal / Zip Code</label>
                          <input className={styles.input} value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="B1 1AA" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Country Code (2 Letters)</label>
                          <input className={styles.input} value={country} onChange={(e) => setCountry(e.target.value)} required maxLength={2} placeholder="GB" />
                        </div>
                        <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--ui-spacing-xs)', gridColumn: 'span 2' }}>
                          <input type="checkbox" checked={isAddrDefault} onChange={(e) => setIsAddrDefault(e.target.checked)} id="is_default" />
                          <label htmlFor="is_default" className={styles.label}>Set as default location for this type</label>
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                          <Button variant="secondary" type="submit">+ Add Location</Button>
                        </div>
                      </form>

                      <div className={styles.sectionHeader} style={{ marginTop: 'var(--ui-spacing-md)' }}>
                        <h4 className={styles.sectionTitle}>Registered Locations</h4>
                      </div>

                      <Table>
                        <THead>
                          <TR>
                            <TH>Type</TH>
                            <TH>Street Address</TH>
                            <TH>City & Country</TH>
                            <TH>Default</TH>
                            <TH>Action</TH>
                          </TR>
                        </THead>
                        <TBody>
                          {selectedCustomerAddresses.length === 0 ? (
                            <TR><TD colSpan={5} style={{ textAlign: 'center' }}>No addresses registered.</TD></TR>
                          ) : (
                            selectedCustomerAddresses.map(addr => (
                              <TR key={addr.id}>
                                <TD><Badge variant="secondary">{addr.address_type}</Badge></TD>
                                <TD>{addr.street_address}</TD>
                                <TD>{addr.city}, {addr.country_code}</TD>
                                <TD>{addr.is_default ? '✅ Yes' : '—'}</TD>
                                <TD>
                                  <Button variant="danger" size="small" onClick={() => deleteAddress(addr.id)}>
                                    Delete
                                  </Button>
                                </TD>
                              </TR>
                            ))
                          )}
                        </TBody>
                      </Table>
                    </div>
                  </div>
                </TabPanel>

                {/* Tab 3: Contacts Tab (Gated behind Pro) */}
                <TabPanel>
                  <div className={styles.tabLockedContainer}>
                    {!hasContactsGated && (
                      <UpgradeGateOverlay moduleName="Representative & Contacts Directories" requiredTier="Pro" />
                    )}
                    <div style={!hasContactsGated ? { opacity: 0.3, pointerEvents: 'none' } : {}} className={styles.drawerTabContent}>
                      <form onSubmit={handleAddContact} className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>First Name</label>
                          <input className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jane" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Last Name</label>
                          <input className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Email Address</label>
                          <input className={styles.input} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="jane@acme.com" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Phone Number</label>
                          <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 121 555 0199" />
                        </div>
                        <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.label}>Department / Role</label>
                          <input className={styles.input} value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Finance, Procurement Director" />
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                          <Button variant="secondary" type="submit">+ Save Contact</Button>
                        </div>
                      </form>

                      <div className={styles.sectionHeader} style={{ marginTop: 'var(--ui-spacing-md)' }}>
                        <h4 className={styles.sectionTitle}>Contact Directory</h4>
                      </div>

                      <Table>
                        <THead>
                          <TR>
                            <TH>Name</TH>
                            <TH>Email</TH>
                            <TH>Department</TH>
                            <TH>Action</TH>
                          </TR>
                        </THead>
                        <TBody>
                          {selectedCustomerContacts.length === 0 ? (
                            <TR><TD colSpan={4} style={{ textAlign: 'center' }}>No contact representatives registered.</TD></TR>
                          ) : (
                            selectedCustomerContacts.map(cont => (
                              <TR key={cont.id}>
                                <TD style={{ fontWeight: 'var(--ui-weight-semibold)' }}>{cont.first_name} {cont.last_name || ''}</TD>
                                <TD>{cont.email || '—'}</TD>
                                <TD>{cont.department || '—'}</TD>
                                <TD>
                                  <Button variant="danger" size="small" onClick={() => deleteContact(cont.id)}>
                                    Delete
                                  </Button>
                                </TD>
                              </TR>
                            ))
                          )}
                        </TBody>
                      </Table>
                    </div>
                  </div>
                </TabPanel>

                {/* Tab 4: Credit & Finance (Gated behind Pro) */}
                <TabPanel>
                  <div className={styles.tabLockedContainer}>
                    {!hasCreditManagement && (
                      <UpgradeGateOverlay moduleName="Credit Limits & Authorization Scopes" requiredTier="Pro" />
                    )}
                    <div style={!hasCreditManagement ? { opacity: 0.3, pointerEvents: 'none' } : {}} className={styles.drawerTabContent}>
                      <form onSubmit={handleSaveCredit} className={styles.formGrid}>
                        <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.label}>Outstanding Balance (Receivables ledger)</label>
                          <input
                            className={styles.input}
                            value={selectedCustomerCredit ? `$${selectedCustomerCredit.outstanding_balance.toFixed(4)}` : '$0.0000'}
                            disabled
                            style={{ background: 'var(--ui-gray-100)', color: 'var(--ui-gray-600)' }}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Authorized Credit Limit ($)</label>
                          <input
                            className={styles.input}
                            type="number"
                            step="0.0001"
                            value={creditLimit}
                            onChange={(e) => setCreditLimit(Number(e.target.value))}
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Payment Terms Code</label>
                          <select className={styles.select} value={terms} onChange={(e) => setTerms(e.target.value)}>
                            <option value="COD">Cash On Delivery (COD)</option>
                            <option value="NET15">Net 15 Days</option>
                            <option value="NET30">Net 30 Days</option>
                            <option value="NET60">Net 60 Days</option>
                          </select>
                        </div>
                        
                        <div className={styles.stickyFooter} style={{ gridColumn: 'span 2' }}>
                          <Button variant="primary" type="submit">
                            Save Credit limits
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </TabPanel>

                {/* Tab 5: Activity Chronological Timeline */}
                <TabPanel>
                  <Timeline entries={mockActivityEntries} />
                </TabPanel>
              </>
            )}
          </TabPanels>
        </TabGroup>
      </div>
    </SlideOutDrawer>
  );
};
