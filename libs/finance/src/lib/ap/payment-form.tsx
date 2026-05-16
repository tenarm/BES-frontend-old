import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input } from '@bes/shared-ui';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export const PaymentForm: React.FC<PaymentFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    vendor_id: '',
    purchase_invoice_id: '',
    account_id: '', // Bank or Cash
    date: new Date().toISOString().split('T')[0],
    amount: '',
    reference: ''
  });
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
      fetchAccounts();
    }
  }, [isOpen]);

  // When vendor changes, fetch their unpaid invoices
  useEffect(() => {
    if (formData.vendor_id) {
      fetchInvoices(formData.vendor_id);
    } else {
      setInvoices([]);
    }
  }, [formData.vendor_id]);

  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/vendors?limit=100`);
      const json = await res.json();
      setVendors(json.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/accounts?limit=100`);
      const json = await res.json();
      // Filter out non-asset accounts for payment sources (e.g. Bank, Cash)
      setAccounts((json.data || []).filter((a: any) => a.type === 'Asset'));
    } catch (e) { console.error(e); }
  };

  const fetchInvoices = async (vendorId: string) => {
    try {
      // In a real app, we might add a query param to filter by vendor and status
      const res = await fetch(`${API_BASE}/api/v1/finance/purchase-invoices?limit=100`);
      const json = await res.json();
      setInvoices((json.data || []).filter((inv: any) => inv.vendor_id === vendorId && parseFloat(inv.outstanding_amount) > 0));
    } catch (e) { console.error(e); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill amount if an invoice is selected
    if (name === 'purchase_invoice_id' && value) {
      const selectedInvoice = invoices.find(inv => inv.id === value);
      if (selectedInvoice) {
        setFormData(prev => ({ ...prev, amount: selectedInvoice.outstanding_amount.toString() }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.vendor_id) throw new Error("Please select a vendor");
      if (!formData.account_id) throw new Error("Please select a payment account");
      if (!formData.amount || parseFloat(formData.amount) <= 0) throw new Error("Please enter a valid amount");

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        purchase_invoice_id: formData.purchase_invoice_id || null
      };

      const res = await fetch(`${API_BASE}/api/v1/finance/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (!res.ok || json.status === 'error') {
        throw new Error(json.error || json.detail || 'Failed to record payment');
      }

      setFormData({ vendor_id: '', purchase_invoice_id: '', account_id: '', date: new Date().toISOString().split('T')[0], amount: '', reference: '' });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Make a Payment"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Record Payment'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
        {error && (
          <div style={{ padding: '12px', background: 'var(--ui-error-50)', color: 'var(--ui-error)', borderRadius: '6px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Vendor *</label>
          <select 
            name="vendor_id" 
            value={formData.vendor_id} 
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--ui-gray-200)', fontSize: '14px', background: 'white' }}
          >
            <option value="">Select Vendor</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Apply to Invoice (Optional)</label>
          <select 
            name="purchase_invoice_id" 
            value={formData.purchase_invoice_id} 
            onChange={handleChange}
            disabled={!formData.vendor_id || invoices.length === 0}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--ui-gray-200)', fontSize: '14px', background: 'white' }}
          >
            <option value="">Do not apply to specific invoice</option>
            {invoices.map(inv => (
              <option key={inv.id} value={inv.id}>{inv.invoice_number} (Owe: ${parseFloat(inv.outstanding_amount).toLocaleString()})</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Payment Account (Bank/Cash) *</label>
          <select 
            name="account_id" 
            value={formData.account_id} 
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--ui-gray-200)', fontSize: '14px', background: 'white' }}
          >
            <option value="">Select Account</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Date *</label>
            <Input 
              type="date"
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Amount *</label>
            <Input 
              type="number"
              step="0.01"
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Reference</label>
          <Input 
            name="reference" 
            value={formData.reference} 
            onChange={handleChange} 
            placeholder="e.g. Check #1001 or Wire Tx ID"
          />
        </div>

      </form>
    </Drawer>
  );
};
