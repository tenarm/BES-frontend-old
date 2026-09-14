import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  User as UserIcon, 
  AlertCircle, 
  FileText, 
  Check, 
  DollarSign, 
  Calendar, 
  Clock, 
  X,
  CreditCard,
  Building,
  Activity
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Table, 
  THead, 
  TBody, 
  TR, 
  TH, 
  TD, 
  Badge, 
  Skeleton,
  SlideOutDrawer,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@bes/shared-ui';


interface Customer {
  id: string;
  name: string;
  tax_id: string | null;
  primary_email: string | null;
  credit_limit: string;
  outstanding_balance: string;
  created_at: string;
}

interface SalesOrder {
  id: string;
  ref_number: string;
  customer_id: string;
  total_amount: string;
  status: string;
  created_at: string;
}

interface Invoice {
  id: string;
  ref_number: string;
  customer_id: string;
  total_amount: string;
  status: string;
  created_at: string;
}

const API_BASE = '/api/v1';

export default function CustomersPage() {
  const token = localStorage.getItem('bes_token');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer & Selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // New Customer Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTaxId, setNewTaxId] = useState('');
  const [newCreditLimit, setNewCreditLimit] = useState('5000.0000');
  const [addingCustomer, setAddingCustomer] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_BASE}/customers`, { headers });
      if (res.ok) {
        const json = await res.json();
        setCustomers(json.data || []);
      }
    } catch (e) {
      console.error('Error fetching customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  // Load customer timeline data (orders & invoices) when selection changes
  useEffect(() => {
    if (!selectedCustomer) return;

    const fetchTimeline = async () => {
      setLoadingTimeline(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        // Fetch all orders and invoices
        const [ordersRes, invoicesRes] = await Promise.all([
          fetch(`${API_BASE}/sales/orders`, { headers }),
          fetch(`${API_BASE}/finance/invoices`, { headers })
        ]);

        let customerOrders: SalesOrder[] = [];
        let customerInvoices: Invoice[] = [];

        if (ordersRes.ok) {
          const json = await ordersRes.json();
          customerOrders = (json.data || []).filter(
            (o: SalesOrder) => o.customer_id === selectedCustomer.id
          );
        }

        if (invoicesRes.ok) {
          const json = await invoicesRes.json();
          customerInvoices = (json.data || []).filter(
            (i: Invoice) => i.customer_id === selectedCustomer.id
          );
        }

        setOrders(customerOrders);
        setInvoices(customerInvoices);
      } catch (e) {
        console.error('Error fetching customer timeline', e);
      } finally {
        setLoadingTimeline(false);
      }
    };

    fetchTimeline();
  }, [selectedCustomer, token]);

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    setAddingCustomer(true);
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const res = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newName,
          primary_email: newEmail || null,
          tax_id: newTaxId || null,
          credit_limit: parseFloat(newCreditLimit || '0').toFixed(4),
          outstanding_balance: '0.0000'
        })
      });

      if (res.ok) {
        // Reset form & reload
        setNewName('');
        setNewEmail('');
        setNewTaxId('');
        setNewCreditLimit('5000.0000');
        setIsAddOpen(false);
        await fetchCustomers();
      } else {
        alert('Failed to add customer.');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating customer.');
    } finally {
      setAddingCustomer(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const query = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(query) ||
        (c.primary_email?.toLowerCase() || '').includes(query) ||
        (c.tax_id?.toLowerCase() || '').includes(query)
      );
    });
  }, [customers, searchQuery]);

  // Combine orders & invoices into a beautiful timeline
  const timelineEvents = useMemo(() => {
    const events: Array<{
      id: string;
      type: 'order' | 'invoice';
      title: string;
      ref: string;
      amount: string;
      status: string;
      date: string;
    }> = [];

    orders.forEach(o => {
      events.push({
        id: o.id,
        type: 'order',
        title: 'Sales Order Confirmed',
        ref: o.ref_number,
        amount: o.total_amount,
        status: o.status,
        date: o.created_at
      });
    });

    invoices.forEach(i => {
      events.push({
        id: i.id,
        type: 'invoice',
        title: 'Invoice Issued',
        ref: i.ref_number,
        amount: i.total_amount,
        status: i.status,
        date: i.created_at
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, invoices]);

  return (
    <div style={{ padding: 'var(--wp-spacing-xl, 32px)', fontFamily: 'var(--wp-font-body)' }}>
      {/* Page Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
            Customers Hub
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--wp-stone-500)', fontSize: '14px' }}>
            Browse master data accounts, credit parameters, and full order ledger history.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Customer
        </Button>
      </header>

      {/* Search Input Bar */}
      <div style={{
        position: 'relative',
        marginBottom: '24px',
        maxWidth: '480px'
      }}>
        <Search size={18} color="var(--wp-stone-400)" style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }} />
        <input 
          type="text"
          placeholder="Search customers by name, email, tax ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px 12px 42px',
            borderRadius: '10px',
            border: '1px solid var(--wp-stone-200)',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--wp-accent)';
            e.target.style.boxShadow = '0 0 0 3px var(--wp-accent-muted)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--wp-stone-200)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Main Customers List Card */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton height="40px" />
          <Skeleton height="200px" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div style={{
          border: '2px dashed var(--wp-stone-200)',
          borderRadius: '12px',
          padding: '64px 24px',
          textAlign: 'center',
          color: 'var(--wp-stone-500)',
          background: 'var(--wp-surface-base)'
        }}>
          <UserIcon size={32} style={{ marginBottom: 12 }} />
          <h4 style={{ margin: 0, fontWeight: 600 }}>No Customers Found</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--wp-stone-400)' }}>
            Try adjusting your search query or add a new customer above.
          </p>
        </div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--wp-shadow-sm)', border: '1px solid var(--wp-stone-200)' }}>
          <Table>
            <THead>
              <TR>
                <TH>Account Name</TH>
                <TH>Primary Email</TH>
                <TH>Tax Registration</TH>
                <TH style={{ textAlign: 'right' }}>Credit Limit</TH>
                <TH style={{ textAlign: 'right' }}>Outstanding Balance</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {filteredCustomers.map((cust) => {
                const limit = parseFloat(cust.credit_limit || '0');
                const bal = parseFloat(cust.outstanding_balance || '0');
                const isBreached = bal > limit && limit > 0;

                return (
                  <TR key={cust.id} onClick={() => handleRowClick(cust)}>
                    <TD>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--wp-accent-muted)',
                          color: 'var(--wp-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}>
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--wp-stone-900)' }}>{cust.name}</span>
                      </div>
                    </TD>
                    <TD style={{ color: 'var(--wp-stone-600)' }}>{cust.primary_email || '—'}</TD>
                    <TD style={{ color: 'var(--wp-stone-500)', fontSize: '13px', fontFamily: 'monospace' }}>{cust.tax_id || '—'}</TD>
                    <TD style={{ textAlign: 'right', fontWeight: 500 }}>${limit.toFixed(4)}</TD>
                    <TD style={{ 
                      textAlign: 'right', 
                      fontWeight: 600,
                      color: isBreached ? 'var(--wp-error, #ef4444)' : 'var(--wp-stone-900)' 
                    }}>
                      ${bal.toFixed(4)}
                    </TD>
                    <TD>
                      <Badge variant={isBreached ? 'error' : 'success'}>
                        {isBreached ? 'Credit Breach' : 'Active'}
                      </Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      )}

      {/* Slide-over Profile Detail Panel */}
      <SlideOutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCustomer?.name || 'Customer Account Detail'}
        size="lg"
      >
        {selectedCustomer && (
          <TabGroup defaultIndex={0}>
            <TabList style={{
              display: 'flex',
              borderBottom: '1px solid var(--wp-stone-200)',
              marginBottom: '20px',
              gap: '24px'
            }}>
              <Tab style={{
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--wp-stone-500)',
                cursor: 'pointer',
                borderBottom: '2px solid transparent',
                outline: 'none'
              }}>Overview</Tab>
              <Tab style={{
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--wp-stone-500)',
                cursor: 'pointer',
                borderBottom: '2px solid transparent',
                outline: 'none'
              }}>Timeline</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Panel */}
              <TabPanel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Financial Metrics Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{
                      background: 'var(--wp-stone-50, #f5f5f4)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--wp-stone-100)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wp-stone-500)', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        <Building size={14} /> TAX REGISTRATION
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--wp-stone-800)' }}>
                        {selectedCustomer.tax_id || 'Not Registered'}
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--wp-stone-50, #f5f5f4)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--wp-stone-100)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wp-stone-500)', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        <Clock size={14} /> ACCOUNT SINCE
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wp-stone-800)' }}>
                        {new Date(selectedCustomer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{
                      background: 'var(--wp-stone-50, #f5f5f4)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--wp-stone-100)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wp-stone-500)', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        <CreditCard size={14} /> CREDIT LIMIT
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--wp-stone-800)' }}>
                        ${parseFloat(selectedCustomer.credit_limit || '0').toFixed(4)}
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--wp-stone-50, #f5f5f4)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--wp-stone-100)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wp-stone-500)', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        <DollarSign size={14} /> OUTSTANDING BALANCE
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 800, 
                        color: parseFloat(selectedCustomer.outstanding_balance || '0') > parseFloat(selectedCustomer.credit_limit || '0')
                          ? 'var(--wp-error, #ef4444)'
                          : 'var(--wp-stone-800)'
                      }}>
                        ${parseFloat(selectedCustomer.outstanding_balance || '0').toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Profile details */}
                  <Card title="Account Overview Details" style={{ border: '1px solid var(--wp-stone-100)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--wp-stone-100)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--wp-stone-500)', fontWeight: 500 }}>Customer Name</span>
                        <span style={{ fontWeight: 600, color: 'var(--wp-stone-800)' }}>{selectedCustomer.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--wp-stone-100)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--wp-stone-500)', fontWeight: 500 }}>Primary Email Address</span>
                        <span style={{ fontWeight: 600, color: 'var(--wp-stone-800)' }}>{selectedCustomer.primary_email || '—'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--wp-stone-100)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--wp-stone-500)', fontWeight: 500 }}>Credit Breaches allowed?</span>
                        <span style={{ fontWeight: 600, color: 'var(--wp-stone-800)' }}>Yes (Soft Warnings only)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--wp-stone-500)', fontWeight: 500 }}>Available Credit</span>
                        <span style={{ 
                          fontWeight: 700, 
                          color: parseFloat(selectedCustomer.credit_limit) - parseFloat(selectedCustomer.outstanding_balance) < 0
                            ? 'var(--wp-error, #ef4444)'
                            : 'var(--wp-success, #22c55e)'
                        }}>
                          ${(parseFloat(selectedCustomer.credit_limit) - parseFloat(selectedCustomer.outstanding_balance)).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabPanel>

              {/* Timeline Panel */}
              <TabPanel>
                {loadingTimeline ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Skeleton height="30px" />
                    <Skeleton height="80px" />
                    <Skeleton height="80px" />
                  </div>
                ) : timelineEvents.length === 0 ? (
                  <div style={{
                    border: '2px dashed var(--wp-stone-200)',
                    borderRadius: '12px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: 'var(--wp-stone-500)',
                    background: 'var(--wp-surface-base)'
                  }}>
                    <Activity size={24} style={{ marginBottom: 12, color: 'var(--wp-stone-400)' }} />
                    <h4 style={{ margin: 0, fontWeight: 600 }}>No Timeline Events</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--wp-stone-400)' }}>
                      There are no confirmed sales orders or invoices logged for this account.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '16px', position: 'relative' }}>
                    {/* Vertical timeline line */}
                    <div style={{
                      position: 'absolute',
                      left: '7px',
                      top: '12px',
                      bottom: '12px',
                      width: '2px',
                      background: 'var(--wp-stone-200)'
                    }} />

                    {timelineEvents.map((evt) => (
                      <div key={evt.id} style={{
                        position: 'relative',
                        paddingLeft: '32px',
                        paddingBottom: '24px'
                      }}>
                        {/* Circle point */}
                        <div style={{
                          position: 'absolute',
                          left: '0px',
                          top: '2px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: evt.type === 'order' ? 'var(--wp-primary)' : 'var(--wp-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: '0 0 0 4px white'
                        }}>
                          {evt.type === 'order' ? <FileText size={8} /> : <DollarSign size={8} />}
                        </div>

                        {/* Content */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: 'var(--wp-stone-850, #2d2a29)' }}>
                              {evt.title}
                            </h4>
                            <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)' }}>
                              {new Date(evt.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--wp-stone-500)' }}>
                            Reference: <strong style={{ color: 'var(--wp-stone-700)' }}>{evt.ref}</strong> | Amount: <strong style={{ color: 'var(--wp-stone-700)' }}>${parseFloat(evt.amount).toFixed(4)}</strong>
                          </p>
                          <div style={{ marginTop: '8px' }}>
                            <Badge variant={
                              evt.status === 'completed' || evt.status === 'paid' || evt.status === 'shipped' || evt.status === 'confirmed'
                                ? 'success'
                                : 'warning'
                            }>
                              {evt.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        )}
      </SlideOutDrawer>

      {/* Add Customer Dialog/Drawer */}
      {isAddOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28, 25, 23, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setIsAddOpen(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: 'var(--wp-shadow-lg)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--wp-font-display)', margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--wp-stone-900)' }}>
                Add New Customer Account
              </h2>
              <button 
                onClick={() => setIsAddOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-stone-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '6px' }}>
                  Account Name <span style={{ color: 'var(--wp-error)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  required
                  placeholder="e.g. Acme Corp Inc."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--wp-stone-200)', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '6px' }}>
                  Primary Email
                </label>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="billing@acme.com"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--wp-stone-200)', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '6px' }}>
                  Tax ID / Registration Number
                </label>
                <input 
                  type="text" 
                  value={newTaxId} 
                  onChange={(e) => setNewTaxId(e.target.value)} 
                  placeholder="US-1234567"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--wp-stone-200)', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '6px' }}>
                  Approved Credit Limit ($)
                </label>
                <input 
                  type="number" 
                  value={newCreditLimit} 
                  onChange={(e) => setNewCreditLimit(e.target.value)} 
                  placeholder="5000.0000"
                  step="0.0001"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--wp-stone-200)', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <Button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)} 
                  variant="secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={addingCustomer}
                  style={{ flex: 1 }}
                >
                  {addingCustomer ? 'Adding...' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
