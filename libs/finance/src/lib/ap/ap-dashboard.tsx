import React, { useState, useEffect } from 'react';
import { Users, FileText, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';
import { Button, Card } from '@bes/shared-ui';
import { VendorForm } from './vendor-form';
import { PurchaseInvoiceForm } from './purchase-invoice-form';
import { PaymentForm } from './payment-form';
import { AgingReportStub } from './aging-report-stub';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const APDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPayable: 0,
    overdueInvoices: 0,
    vendorCount: 0,
    pendingPayments: 0,
  });

  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAgingOpen, setIsAgingOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/finance/ap/summary`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStats(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch AP summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const statCards = [
    { label: 'Total Payable', value: `$${stats.totalPayable.toLocaleString()}`, icon: <CreditCard size={20} />, color: 'var(--ui-primary)' },
    { label: 'Overdue Invoices', value: stats.overdueInvoices, icon: <AlertCircle size={20} />, color: 'var(--ui-error)' },
    { label: 'Active Vendors', value: stats.vendorCount, icon: <Users size={20} />, color: 'var(--ui-success)' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: <FileText size={20} />, color: 'var(--ui-warning)' },
  ];

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)' }}>
      <header style={{ marginBottom: 'var(--ui-spacing-xl)' }}>
        <h2 style={{ fontSize: 'var(--ui-text-2xl)', fontWeight: '700', color: 'var(--ui-gray-900)', margin: 0 }}>Account Payables (AP)</h2>
        <p style={{ fontSize: 'var(--ui-text-base)', color: 'var(--ui-gray-500)', marginTop: '4px' }}>Track what you owe to your suppliers and manage payments.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--ui-spacing-lg)', marginBottom: 'var(--ui-spacing-xl)' }}>
        {statCards.map((stat, i) => (
          <Card key={i} style={{ padding: 'var(--ui-spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-lg)' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--ui-radius-md)', 
              background: `${stat.color}15`, 
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-500)', fontWeight: '500' }}>{stat.label}</p>
              <h3 style={{ margin: '4px 0 0', fontSize: 'var(--ui-text-xl)', fontWeight: '700', color: 'var(--ui-gray-900)' }}>{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-lg)' }}>
        <Card style={{ padding: 'var(--ui-spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-lg)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ui-text-lg)', fontWeight: '600' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-spacing-md)' }}>
            <Button variant="outline" style={{ justifyContent: 'space-between' }} onClick={() => setIsVendorOpen(true)}>
              Add New Vendor <ArrowRight size={16} />
            </Button>
            <Button variant="outline" style={{ justifyContent: 'space-between' }} onClick={() => setIsInvoiceOpen(true)}>
              Record Purchase Invoice <ArrowRight size={16} />
            </Button>
            <Button variant="outline" style={{ justifyContent: 'space-between' }} onClick={() => setIsPaymentOpen(true)}>
              Make a Payment <ArrowRight size={16} />
            </Button>
            <Button variant="outline" style={{ justifyContent: 'space-between' }} onClick={() => setIsAgingOpen(true)}>
              View AP Aging Report <ArrowRight size={16} />
            </Button>
          </div>
        </Card>

        <Card style={{ padding: 'var(--ui-spacing-lg)' }}>
           <h3 style={{ margin: 0, fontSize: 'var(--ui-text-lg)', fontWeight: '600', marginBottom: 'var(--ui-spacing-lg)' }}>Recent Activity</h3>
           <div style={{ color: 'var(--ui-gray-400)', textAlign: 'center', padding: 'var(--ui-spacing-xl) 0' }}>
              <p>No recent activity in the last 24 hours.</p>
           </div>
        </Card>
      </div>

      {/* Drawers */}
      <VendorForm 
        isOpen={isVendorOpen} 
        onClose={() => setIsVendorOpen(false)} 
        onSuccess={() => { setIsVendorOpen(false); fetchSummary(); }} 
      />
      <PurchaseInvoiceForm 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
        onSuccess={() => { setIsInvoiceOpen(false); fetchSummary(); }} 
      />
      <PaymentForm 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={() => { setIsPaymentOpen(false); fetchSummary(); }} 
      />
      <AgingReportStub 
        isOpen={isAgingOpen} 
        onClose={() => setIsAgingOpen(false)} 
      />
    </div>
  );
};
