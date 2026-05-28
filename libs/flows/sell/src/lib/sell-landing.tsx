import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Check, 
  AlertCircle, 
  FileText, 
  Truck, 
  FileCheck, 
  CreditCard,
  Building,
  DollarSign,
  TrendingUp,
  Inbox,
  ArrowRight,
  ClipboardList
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
  ComponentRegistry
} from '@tenarm/shared-ui';


// --- TS Types ---
interface Product {
  id: string;
  name: string;
  sku: string;
  base_price: string;
}

interface Customer {
  id: string;
  name: string;
  primary_email: string;
  credit_limit: string;
  outstanding_balance: string;
}

interface LineItem {
  product_id: string;
  product_name: string;
  sku: string;
  qty: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  line_total: number;
}

interface FlowState {
  activeStep: 'landing' | 'create_quote' | 'confirm_order' | 'ship_order' | 'generate_invoice' | 'collect_payment';
  quotation_id: string | null;
  order_id: string | null;
  shipment_id: string | null;
  invoice_id: string | null;
  payment_id: string | null;
  customer: Customer | null;
  payment_terms: string;
  line_items: LineItem[];
  credit_warning: boolean;
  ref_numbers: {
    quotation?: string;
    order?: string;
    shipment?: string;
    invoice?: string;
    payment?: string;
  };
}

const API_BASE = '/api/v1';

export default function SellLanding() {
  const token = localStorage.getItem('bes_token');

  // --- Flow State ---
  const [activeStep, setActiveStep] = useState<FlowState['activeStep']>('landing');
  const [quotationId, setQuotationId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [creditWarning, setCreditWarning] = useState<boolean>(false);
  const [refNumbers, setRefNumbers] = useState<FlowState['ref_numbers']>({});

  // --- Landing Metadata ---
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [metrics, setMetrics] = useState({
    openQuotes: 0,
    pendingOrders: 0,
    monthRevenue: '0.0000',
  });

  // --- Form Selectors data ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingSelectors, setLoadingSelectors] = useState(true);

  // --- Quick Add Customer State ---
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickTaxId, setQuickTaxId] = useState('');
  const [quickCreditLimit, setQuickCreditLimit] = useState('5000.0000');
  const [savingQuickCustomer, setSavingQuickCustomer] = useState(false);

  const handleQuickAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName) return;
    setSavingQuickCustomer(true);
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const res = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: quickName,
          primary_email: quickEmail || null,
          tax_id: quickTaxId || null,
          credit_limit: parseFloat(quickCreditLimit || '0').toFixed(4),
          outstanding_balance: '0.0000'
        })
      });

      if (res.ok) {
        const json = await res.json();
        const newCustomer = json.data;

        // Reset form
        setQuickName('');
        setQuickEmail('');
        setQuickTaxId('');
        setQuickCreditLimit('5000.0000');
        setIsQuickAddOpen(false);

        // Refresh selectors
        await loadSelectorData();

        // Select the newly added customer immediately
        setCustomer(newCustomer);
      } else {
        alert('Failed to add customer.');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating customer.');
    } finally {
      setSavingQuickCustomer(false);
    }
  };

  // --- Draftrecovery ---
  useEffect(() => {
    const saved = localStorage.getItem('bes_sell_draft');
    if (saved) {
      try {
        const draft: FlowState = JSON.parse(saved);
        if (draft.activeStep !== 'landing') {
          setActiveStep(draft.activeStep);
          setQuotationId(draft.quotation_id);
          setOrderId(draft.order_id);
          setShipmentId(draft.shipment_id);
          setInvoiceId(draft.invoice_id);
          setPaymentId(draft.payment_id);
          setCustomer(draft.customer);
          setPaymentTerms(draft.payment_terms);
          setLineItems(draft.line_items);
          setCreditWarning(draft.credit_warning);
          setRefNumbers(draft.ref_numbers);
        }
      } catch (e) {
        console.error('Failed to parse sell draft', e);
      }
    }
  }, []);

  // --- Auto-Save draft ---
  useEffect(() => {
    if (activeStep !== 'landing') {
      const state: FlowState = {
        activeStep,
        quotation_id: quotationId,
        order_id: orderId,
        shipment_id: shipmentId,
        invoice_id: invoiceId,
        payment_id: paymentId,
        customer,
        payment_terms: paymentTerms,
        line_items: lineItems,
        credit_warning: creditWarning,
        ref_numbers: refNumbers,
      };
      localStorage.setItem('bes_sell_draft', JSON.stringify(state));
    } else {
      localStorage.removeItem('bes_sell_draft');
    }
  }, [activeStep, quotationId, orderId, shipmentId, invoiceId, paymentId, customer, paymentTerms, lineItems, creditWarning, refNumbers]);

  const loadLandingData = async () => {
    setLoadingActivities(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch Quotes & Orders
      const qRes = await fetch(`${API_BASE}/sales/quotations`, { headers });
      const oRes = await fetch(`${API_BASE}/sales/orders`, { headers });
      const invRes = await fetch(`${API_BASE}/finance/invoices`, { headers });

      const qData = qRes.ok ? await qRes.json() : { data: [] };
      const oData = oRes.ok ? await oRes.json() : { data: [] };
      const invData = invRes.ok ? await invRes.json() : { data: [] };

      const quotes = qData.data || [];
      const orders = oData.data || [];
      const invoices = invData.data || [];

      // Combine for recent activities
      const combined = [
        ...quotes.map((q: any) => ({ ...q, type: 'Quotation', date: q.created_at })),
        ...orders.map((o: any) => ({ ...o, type: 'Sales Order', date: o.created_at })),
        ...invoices.map((i: any) => ({ ...i, type: 'Invoice', date: i.created_at })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setRecentActivities(combined.slice(0, 10));

      // Calculate Metrics
      const openQ = quotes.filter((q: any) => q.status === 'draft' || q.status === 'active').length;
      const pendO = orders.filter((o: any) => o.status === 'confirmed').length;
      const rev = invoices
        .filter((i: any) => i.status === 'paid' || i.status === 'partially_paid')
        .reduce((sum: number, i: any) => sum + parseFloat(i.total_amount || '0'), 0)
        .toFixed(4);

      setMetrics({
        openQuotes: openQ,
        pendingOrders: pendO,
        monthRevenue: rev,
      });

    } catch (e) {
      console.error('Error fetching landing details', e);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (activeStep === 'landing') {
      loadLandingData();
    }
  }, [activeStep, token]);

  const loadSelectorData = async () => {
    setLoadingSelectors(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const cRes = await fetch(`${API_BASE}/customers`, { headers });
      const pRes = await fetch(`${API_BASE}/products`, { headers });

      const cData = cRes.ok ? await cRes.json() : { data: [] };
      const pData = pRes.ok ? await pRes.json() : { data: [] };

      // Ensure mock customer if empty (for seamless dev experience)
      let customerList = cData.data || [];
      if (customerList.length === 0) {
        // Auto seed mock customer
        const seedRes = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Apex Global Enterprises',
            tax_id: 'US-9988223',
            primary_email: 'billing@apex.com',
            credit_limit: '15000.0000',
            outstanding_balance: '0.0000'
          })
        });
        if (seedRes.ok) {
          const seeded = await seedRes.json();
          customerList = [seeded.data];
        }
      }

      // Ensure mock products if empty
      let productList = pData.data || [];
      if (productList.length === 0) {
        const seedProd = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Premium Cloud License A',
            sku: 'SKU-CLD-PREM',
            base_price: '450.0000'
          })
        });
        if (seedProd.ok) {
          const seeded = await seedProd.json();
          productList = [seeded.data];
        }
      }

      setCustomers(customerList);
      setProducts(productList);
    } catch (e) {
      console.error('Error fetching customers/products list', e);
    } finally {
      setLoadingSelectors(false);
    }
  };

  useEffect(() => {
    if (activeStep !== 'landing') {
      loadSelectorData();
    }
  }, [activeStep, token]);

  const resetFlow = () => {
    setActiveStep('landing');
    setQuotationId(null);
    setOrderId(null);
    setShipmentId(null);
    setInvoiceId(null);
    setPaymentId(null);
    setCustomer(null);
    setLineItems([]);
    setCreditWarning(false);
    setRefNumbers({});
    localStorage.removeItem('bes_sell_draft');
  };

  // --- Inline Pricing Calculations ---
  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    lineItems.forEach(line => {
      const lineTotal = line.qty * line.unit_price - line.discount_amount;
      subtotal += lineTotal;
      tax += lineTotal * line.tax_rate;
    });
    return {
      subtotal: subtotal.toFixed(4),
      tax: tax.toFixed(4),
      total: (subtotal + tax).toFixed(4)
    };
  }, [lineItems]);

  // --- Step 1: Create Quote ---
  const handleCreateQuotation = async () => {
    if (!customer || lineItems.length === 0) return;
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const payload = {
        customer_id: customer.id,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: lineItems.map(l => ({
          product_id: l.product_id,
          qty: l.qty.toString(),
          unit_price: l.unit_price.toString(),
          discount_amount: l.discount_amount.toString(),
          tax_rate: l.tax_rate.toString()
        }))
      };

      const res = await fetch(`${API_BASE}/sales/quotations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Quotation creation failed');
      const data = await res.json();
      setQuotationId(data.data.id);
      setRefNumbers(prev => ({ ...prev, quotation: data.data.ref_number }));
      setActiveStep('confirm_order');
    } catch (e) {
      console.error(e);
      alert('Error creating quotation.');
    }
  };

  // --- Step 2: Confirm Order ---
  const handleConfirmOrder = async () => {
    if (!customer || lineItems.length === 0) return;
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const payload = {
        customer_id: customer.id,
        payment_terms: paymentTerms,
        quotation_id: quotationId || undefined,
        line_items: lineItems.map(l => ({
          product_id: l.product_id,
          qty: l.qty.toString(),
          unit_price: l.unit_price.toString(),
          discount_amount: l.discount_amount.toString(),
          tax_rate: l.tax_rate.toString()
        }))
      };

      // Create Sales Order in Draft
      const res = await fetch(`${API_BASE}/sales/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Order creation failed');
      const data = await res.json();
      const newOrderId = data.data.id;
      setOrderId(newOrderId);
      setRefNumbers(prev => ({ ...prev, order: data.data.ref_number }));
      setCreditWarning(data.data.credit_warning);

      // Instantly confirm Sales Order (Basic flow)
      const confirmRes = await fetch(`${API_BASE}/sales/orders/${newOrderId}/confirm`, {
        method: 'POST',
        headers
      });

      if (!confirmRes.ok) throw new Error('Order confirmation failed');
      setActiveStep('ship_order');
    } catch (e) {
      console.error(e);
      alert('Error confirming order.');
    }
  };

  // --- Step 3: Ship Order ---
  const handleShipOrder = async (skip: boolean = false) => {
    if (skip) {
      // resolved design decision: skip shipping always progresses straight to invoicing
      setActiveStep('generate_invoice');
      return;
    }
    if (!orderId) return;

    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Create Draft Shipment
      const payload = {
        order_id: orderId,
        line_items: lineItems.map(l => ({
          product_id: l.product_id,
          qty: l.qty.toString()
        }))
      };

      const res = await fetch(`${API_BASE}/inventory/shipments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Shipment creation failed');
      const data = await res.json();
      const newShipId = data.data.id;
      setShipmentId(newShipId);
      setRefNumbers(prev => ({ ...prev, shipment: data.data.ref_number }));

      // Dispatch Shipment
      const dispatchRes = await fetch(`${API_BASE}/inventory/shipments/${newShipId}/dispatch`, {
        method: 'POST',
        headers
      });

      if (!dispatchRes.ok) throw new Error('Shipment dispatch failed');
      setActiveStep('generate_invoice');
    } catch (e) {
      console.error(e);
      alert('Error dispatching shipment.');
    }
  };

  // --- Step 4: Generate Invoice ---
  const handleGenerateInvoice = async () => {
    if (!orderId || !customer) return;
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const payload = {
        order_id: orderId,
        customer_id: customer.id,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: lineItems.map(l => ({
          product_id: l.product_id,
          qty: l.qty.toString(),
          unit_price: l.unit_price.toString(),
          discount_amount: l.discount_amount.toString(),
          tax_rate: l.tax_rate.toString()
        }))
      };

      // Create Draft Invoice
      const res = await fetch(`${API_BASE}/finance/invoices`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Invoice creation failed');
      const data = await res.json();
      const newInvId = data.data.id;
      setInvoiceId(newInvId);
      setRefNumbers(prev => ({ ...prev, invoice: data.data.ref_number }));

      // Issue Invoice
      const issueRes = await fetch(`${API_BASE}/finance/invoices/${newInvId}/issue`, {
        method: 'POST',
        headers
      });

      if (!issueRes.ok) throw new Error('Invoice issuing failed');
      setActiveStep('collect_payment');
    } catch (e) {
      console.error(e);
      alert('Error issuing invoice.');
    }
  };

  // --- Step 5: Collect Payment ---
  const handleCollectPayment = async (method: string) => {
    if (!invoiceId) return;
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const payload = {
        invoice_id: invoiceId,
        amount: totals.total,
        payment_method: method
      };

      // Record & Capture Payment
      const res = await fetch(`${API_BASE}/finance/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Payment recording failed');
      const data = await res.json();
      setPaymentId(data.data.id);
      setRefNumbers(prev => ({ ...prev, payment: data.data.ref_number }));

      alert('Payment collected successfully! Outbound Sales flow complete.');
      resetFlow();
    } catch (e) {
      console.error(e);
      alert('Error collecting payment.');
    }
  };

  // --- FlowStepper Component ---
  const renderStepper = () => {
    const steps = [
      { id: 'create_quote', label: '1. Create Quote' },
      { id: 'confirm_order', label: '2. Confirm Order' },
      { id: 'ship_order', label: '3. Ship Order' },
      { id: 'generate_invoice', label: '4. Invoice' },
      { id: 'collect_payment', label: '5. Collect Cash' }
    ];

    const currentIdx = steps.findIndex(s => s.id === activeStep);

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        border: '1px solid var(--wp-stone-200)',
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '28px',
        boxShadow: 'var(--wp-shadow-sm)',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: '16px'
      }}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                border: isCompleted 
                  ? 'none' 
                  : isActive 
                    ? '2px solid var(--wp-accent)' 
                    : '2px solid var(--wp-stone-300)',
                background: isCompleted 
                  ? 'var(--wp-primary)' 
                  : isActive 
                    ? 'var(--wp-accent-muted)' 
                    : 'transparent',
                color: isCompleted 
                  ? 'white' 
                  : isActive 
                    ? 'var(--wp-accent)' 
                    : 'var(--wp-stone-500)'
              }}>
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--wp-stone-900)' : 'var(--wp-stone-500)',
                fontFamily: 'var(--wp-font-display)'
              }}>
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <ChevronRight size={16} color="var(--wp-stone-300)" style={{ marginLeft: '12px' }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // --- Landing View ---
  if (activeStep === 'landing') {
    return (
      <div style={{ padding: '28px', fontFamily: 'var(--wp-font-body)' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
              Outbound Sales Flow
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--wp-stone-500)', fontSize: '14px' }}>
              Guided multi-role pipeline from customer quotation to payment capture.
            </p>
          </div>
          <Button onClick={() => setActiveStep('create_quote')} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Start New Sell
          </Button>
        </header>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase' }}>Open Quotations</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0', fontFamily: 'var(--wp-font-display)' }}>{metrics.openQuotes}</h3>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12 }}>
                <FileText size={22} color="var(--wp-stone-600)" />
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase' }}>Confirmed Orders</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0', fontFamily: 'var(--wp-font-display)' }}>{metrics.pendingOrders}</h3>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12 }}>
                <ClipboardList size={22} color="var(--wp-stone-600)" />
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase' }}>Collected Cash (Total)</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 0 0', fontFamily: 'var(--wp-font-display)' }}>${metrics.monthRevenue}</h3>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12 }}>
                <TrendingUp size={22} color="var(--wp-stone-600)" />
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Table */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-stone-900)', marginBottom: '16px' }}>
            Outbound Sales Ledger
          </h2>
          {loadingActivities ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton height="40px" />
              <Skeleton height="150px" />
            </div>
          ) : recentActivities.length === 0 ? (
            <div style={{
              border: '2px dashed var(--wp-stone-200)',
              borderRadius: '12px',
              padding: '64px 24px',
              textAlign: 'center',
              color: 'var(--wp-stone-500)',
              background: 'var(--wp-surface-base)'
            }}>
              <Inbox size={32} style={{ marginBottom: 12 }} />
              <h4 style={{ margin: 0, fontWeight: 600 }}>No Outbound Activity Found</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--wp-stone-400)' }}>
                Click 'Start New Sell' above to issue your first quotation!
              </p>
            </div>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <Table>
                <THead>
                  <TR>
                    <TH>Type</TH>
                    <TH>Reference</TH>
                    <TH>Created Date</TH>
                    <TH>Total Amount</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {recentActivities.map((act) => (
                    <TR key={act.id}>
                      <TD>
                        <strong style={{ color: 'var(--wp-stone-700)' }}>{act.type}</strong>
                      </TD>
                      <TD>{act.ref_number}</TD>
                      <TD>{new Date(act.date).toLocaleDateString()}</TD>
                      <TD>${parseFloat(act.total_amount || '0').toFixed(4)}</TD>
                      <TD>
                        <Badge variant={
                          act.status === 'completed' || act.status === 'paid' || act.status === 'won'
                            ? 'success' 
                            : act.status === 'cancelled' 
                              ? 'error' 
                              : 'warning'
                        }>
                          {act.status}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // --- Guided Stepper Views ---
  return (
    <div style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--wp-font-body)' }}>
      {/* Back Button */}
      <button 
        onClick={resetFlow} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          color: 'var(--wp-stone-500)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '20px',
          padding: 0
        }}
      >
        <ChevronLeft size={16} /> Quit Active Flow
      </button>

      {/* Horizonal Stepper Progress */}
      {renderStepper()}

      {/* STEP 1: CREATE QUOTATION */}
      {activeStep === 'create_quote' && (
        <Card title="Step 1: Outbound Quotation Draft">
          {loadingSelectors ? (
            <Skeleton height="200px" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Customer Selector */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', margin: 0 }}>
                    Select Customer Account
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--wp-accent)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Quick Add Customer
                  </button>
                </div>
                <select 
                  value={customer?.id || ''} 
                  onChange={(e) => {
                    const c = customers.find(cust => cust.id === e.target.value);
                    setCustomer(c || null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--wp-stone-200)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="">Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.primary_email}) - Credit Limit: ${parseFloat(c.credit_limit).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items Editor */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wp-stone-800)', margin: '0 0 12px 0', fontFamily: 'var(--wp-font-display)' }}>
                  Pricing Line Items
                </h3>
                
                {/* Product Add Row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select 
                    id="product-selector"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--wp-stone-200)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Choose item to add...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku}) - Price: ${parseFloat(p.base_price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const sel = document.getElementById('product-selector') as HTMLSelectElement;
                      if (!sel || !sel.value) return;
                      const prod = products.find(p => p.id === sel.value);
                      if (!prod) return;
                      
                      const existing = lineItems.find(l => l.product_id === prod.id);
                      if (existing) {
                        setLineItems(lineItems.map(l => l.product_id === prod.id ? { ...l, qty: l.qty + 1 } : l));
                      } else {
                        setLineItems([...lineItems, {
                          product_id: prod.id,
                          product_name: prod.name,
                          sku: prod.sku,
                          qty: 1,
                          unit_price: parseFloat(prod.base_price),
                          discount_amount: 0,
                          tax_rate: 0.10, // 10% standard tax
                          line_total: parseFloat(prod.base_price)
                        }]);
                      }
                      sel.value = '';
                    }}
                  >
                    Add Line
                  </Button>
                </div>

                {/* Lines Table */}
                {lineItems.length > 0 && (
                  <div style={{ border: '1px solid var(--wp-stone-200)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                    <Table>
                      <THead>
                        <TR>
                          <TH>Product SKU</TH>
                          <TH>Qty</TH>
                          <TH>Unit Price</TH>
                          <TH>Tax Rate</TH>
                          <TH>Line Total</TH>
                          <TH style={{ width: '40px' }}></TH>
                        </TR>
                      </THead>
                      <TBody>
                        {lineItems.map((line, idx) => (
                          <TR key={line.product_id}>
                            <TD>
                              <div>
                                <strong style={{ color: 'var(--wp-stone-700)', display: 'block' }}>{line.product_name}</strong>
                                <span style={{ fontSize: '11px', color: 'var(--wp-stone-400)' }}>SKU: {line.sku}</span>
                              </div>
                            </TD>
                            <TD>
                              <input 
                                type="number" 
                                value={line.qty} 
                                min="1"
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setLineItems(lineItems.map((l, i) => i === idx ? { ...l, qty: val } : l));
                                }}
                                style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid var(--wp-stone-200)' }}
                              />
                            </TD>
                            <TD>
                              <input 
                                type="number" 
                                value={line.unit_price} 
                                step="0.01"
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setLineItems(lineItems.map((l, i) => i === idx ? { ...l, unit_price: val } : l));
                                }}
                                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid var(--wp-stone-200)' }}
                              />
                            </TD>
                            <TD>{(line.tax_rate * 100).toFixed(0)}%</TD>
                            <TD>${(line.qty * line.unit_price - line.discount_amount).toFixed(4)}</TD>
                            <TD>
                              <button 
                                onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}
                                style={{ background: 'none', border: 'none', color: 'var(--wp-stone-400)', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  </div>
                )}

                {/* Price Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', borderTop: '1px solid var(--wp-stone-100)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--wp-stone-500)' }}>Subtotal: <strong>${totals.subtotal}</strong></div>
                  <div style={{ fontSize: '14px', color: 'var(--wp-stone-500)' }}>Tax (10%): <strong>${totals.tax}</strong></div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--wp-stone-900)' }}>Total Due: <strong>${totals.total}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <Button 
                  variant="primary" 
                  disabled={!customer || lineItems.length === 0} 
                  onClick={handleCreateQuotation}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Confirm & Issue Quotation <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STEP 2: CONFIRM SALES ORDER */}
      {activeStep === 'confirm_order' && (
        <Card title={`Step 2: Confirm Order (QT Ref: ${refNumbers.quotation || 'ConvertedDirect'})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)', textTransform: 'uppercase' }}>Customer Account</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 700 }}>{customer?.name}</h4>
                <span style={{ fontSize: '13px', color: 'var(--wp-stone-500)' }}>{customer?.primary_email}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)', textTransform: 'uppercase' }}>Credit Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '4px' }}>
                  <Badge variant="success">Good Credit Position</Badge>
                  <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)' }}>Limit: ${parseFloat(customer?.credit_limit || '0').toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Payment Terms Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '8px' }}>
                Select Payment Terms
              </label>
              <select 
                value={paymentTerms} 
                onChange={(e) => setPaymentTerms(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--wp-stone-200)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 60">Net 60 Days</option>
              </select>
            </div>

            {/* Read-Only Lines Review */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--wp-stone-700)', margin: '0 0 10px 0' }}>Order Details Review</h4>
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                  <THead>
                    <TR>
                      <TH>Product SKU</TH>
                      <TH>Qty</TH>
                      <TH>Price</TH>
                      <TH>Total</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {lineItems.map(l => (
                      <TR key={l.product_id}>
                        <TD>{l.product_name}</TD>
                        <TD>{l.qty}</TD>
                        <TD>${l.unit_price.toFixed(4)}</TD>
                        <TD>${(l.qty * l.unit_price - l.discount_amount).toFixed(4)}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </Card>

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <div style={{ fontSize: '14px', color: 'var(--wp-stone-500)' }}>Subtotal: <strong>${totals.subtotal}</strong></div>
                <div style={{ fontSize: '14px', color: 'var(--wp-stone-500)' }}>Tax (10%): <strong>${totals.tax}</strong></div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--wp-stone-900)' }}>Order Total: <strong>${totals.total}</strong></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '12px' }}>
              <Button variant="outline" onClick={() => setActiveStep('create_quote')}>
                Back to Quote
              </Button>
              <Button variant="primary" onClick={handleConfirmOrder} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Confirm Sales Order <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: SHIP ORDER */}
      {activeStep === 'ship_order' && (
        <Card title={`Step 3: Warehousing & Stock Shipment (Order Ref: ${refNumbers.order})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Credit Warning Banner if applicable */}
            {creditWarning && (
              <div style={{
                background: 'var(--wp-warning-light)',
                border: '1px solid var(--wp-warning)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                gap: '12px',
                color: 'var(--wp-stone-800)'
              }}>
                <AlertCircle size={20} color="var(--wp-warning)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>Credit Limit Exceeded Warning</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                    This customer has exceeded their credit limit. The order was confirmed successfully per Basic tier rules, but has been flagged for audit review.
                  </p>
                </div>
              </div>
            )}

            <div>
              <p style={{ fontSize: '14px', color: 'var(--wp-stone-600)', margin: 0 }}>
                Warehouse staff can compile and dispatch line items. If this is a digital license or service-only order, you can skip shipment entirely.
              </p>
            </div>

            {/* Shipment Lines */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <Table>
                <THead>
                  <TR>
                    <TH>Item SKU</TH>
                    <TH>Ordered Qty</TH>
                    <TH>Fulfillment Location</TH>
                  </TR>
                </THead>
                <TBody>
                  {lineItems.map(l => (
                    <TR key={l.product_id}>
                      <TD>{l.product_name}</TD>
                      <TD>{l.qty}</TD>
                      <TD>Main Warehouse Location (Aisle 3)</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>

            {/* Shipping Inputs */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '8px' }}>
                Tracking Identifier / Dispatch Note
              </label>
              <input 
                type="text" 
                placeholder="e.g. UPS-8899221 or MOCK-DISPATCH-01"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--wp-stone-200)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '12px' }}>
              <Button variant="outline" onClick={() => handleShipOrder(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Skip Shipping (Service Order) <ArrowRight size={16} />
              </Button>
              <Button variant="primary" onClick={() => handleShipOrder(false)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={16} /> Dispatch Shipment <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: GENERATE INVOICE */}
      {activeStep === 'generate_invoice' && (
        <Card title={`Step 4: Accounts Receivable & Billing (Order Ref: ${refNumbers.order})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--wp-stone-600)', margin: 0 }}>
                Verify billing details to post Accounts Receivable ledgers and issue the customer document.
              </p>
            </div>

            {/* Invoice Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)', textTransform: 'uppercase' }}>Billed To</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: 700 }}>{customer?.name}</h4>
                <span style={{ fontSize: '13px', color: 'var(--wp-stone-500)' }}>{customer?.primary_email}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)', textTransform: 'uppercase' }}>Payment terms & Due date</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: 700 }}>{paymentTerms}</h4>
                <span style={{ fontSize: '13px', color: 'var(--wp-stone-500)' }}>Due in 30 Days</span>
              </div>
            </div>

            {/* Invoice Totals */}
            <div style={{ background: 'var(--wp-stone-50)', padding: '20px', borderRadius: '12px', border: '1px solid var(--wp-stone-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--wp-stone-600)' }}>
                <span>Subtotal:</span>
                <span>${totals.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--wp-stone-600)' }}>
                <span>Sales Tax (10%):</span>
                <span>${totals.tax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--wp-stone-200)', paddingTop: '12px', fontSize: '18px', fontWeight: 800, color: 'var(--wp-stone-900)' }}>
                <span>Invoice Total:</span>
                <span>${totals.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <Button variant="primary" onClick={handleGenerateInvoice} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileCheck size={16} /> Post & Issue Invoice <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 5: COLLECT PAYMENT */}
      {activeStep === 'collect_payment' && (
        <Card title={`Step 5: Collect Cash & Reconciliation (Invoice Ref: ${refNumbers.invoice})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <span style={{ fontSize: '12px', color: 'var(--wp-stone-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount to Collect</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-primary)', margin: '6px 0 0 0' }}>
                ${totals.total}
              </h2>
              <Badge variant="warning" style={{ marginTop: '8px' }}>Awaiting Payment</Badge>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '8px' }}>
                Select Payment Collection Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <button 
                  onClick={() => handleCollectPayment('bank_transfer')}
                  style={{
                    padding: '24px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--wp-stone-200)',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--wp-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--wp-stone-200)'}
                >
                  <Building size={24} color="var(--wp-stone-600)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--wp-stone-800)' }}>Bank Transfer</span>
                </button>
                <button 
                  onClick={() => handleCollectPayment('credit_card')}
                  style={{
                    padding: '24px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--wp-stone-200)',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--wp-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--wp-stone-200)'}
                >
                  <CreditCard size={24} color="var(--wp-stone-600)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--wp-stone-800)' }}>Credit Card</span>
                </button>
                <button 
                  onClick={() => handleCollectPayment('cash')}
                  style={{
                    padding: '24px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--wp-stone-200)',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--wp-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--wp-stone-200)'}
                >
                  <DollarSign size={24} color="var(--wp-stone-600)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--wp-stone-800)' }}>Cash / Check</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Add Customer Dialog */}
      {isQuickAddOpen && (
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
        }} onClick={() => setIsQuickAddOpen(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: 'var(--wp-shadow-lg)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--wp-font-display)', margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--wp-stone-900)' }}>
                Quick Add Customer Account
              </h2>
              <button 
                onClick={() => setIsQuickAddOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-stone-400)', fontSize: '20px' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleQuickAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--wp-stone-700)', marginBottom: '6px' }}>
                  Account Name <span style={{ color: 'var(--wp-error)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={quickName} 
                  onChange={(e) => setQuickName(e.target.value)} 
                  required
                  placeholder="e.g. Acme Corporation"
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
                  value={quickEmail} 
                  onChange={(e) => setQuickEmail(e.target.value)} 
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
                  value={quickTaxId} 
                  onChange={(e) => setQuickTaxId(e.target.value)} 
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
                  Credit Limit ($)
                </label>
                <input 
                  type="number" 
                  value={quickCreditLimit} 
                  onChange={(e) => setQuickCreditLimit(e.target.value)} 
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
                  onClick={() => setIsQuickAddOpen(false)} 
                  variant="secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={savingQuickCustomer}
                  style={{ flex: 1 }}
                >
                  {savingQuickCustomer ? 'Saving...' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
