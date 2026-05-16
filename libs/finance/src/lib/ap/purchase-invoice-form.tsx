import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, Table, THead, TBody, TR, TH, TD } from '@bes/shared-ui';
import { Plus, Trash2 } from 'lucide-react';

interface PurchaseInvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export const PurchaseInvoiceForm: React.FC<PurchaseInvoiceFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    vendor_id: '',
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'Unpaid'
  });
  
  const [lines, setLines] = useState([{ account_id: '', description: '', amount: '' }]);
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
      fetchAccounts();
    }
  }, [isOpen]);

  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/vendors?limit=100`);
      const json = await res.json();
      setVendors(json.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/accounts?limit=100`);
      const json = await res.json();
      // Filter out Account Payable itself, or only show expenses/assets
      setAccounts((json.data || []).filter((a: any) => a.type === 'Expense' || a.type === 'Asset'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLineChange = (index: number, field: string, value: string) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const addLine = () => {
    setLines([...lines, { account_id: '', description: '', amount: '' }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate
      if (!formData.vendor_id) throw new Error("Please select a vendor");
      if (lines.length === 0) throw new Error("Please add at least one line item");
      if (lines.some(l => !l.account_id || !l.amount)) throw new Error("Please fill in all line item details");

      const payload = {
        ...formData,
        lines: lines.map(l => ({
          ...l,
          amount: parseFloat(l.amount)
        }))
      };

      const res = await fetch(`${API_BASE}/api/v1/finance/purchase-invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (!res.ok || json.status === 'error') {
        throw new Error(json.error || json.detail || 'Failed to record invoice');
      }

      // Reset
      setFormData({ vendor_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: '', status: 'Unpaid' });
      setLines([{ account_id: '', description: '', amount: '' }]);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Record Purchase Invoice"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
          <span style={{ marginRight: 'auto', fontWeight: 600, fontSize: '16px' }}>Total: ${totalAmount.toLocaleString()}</span>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Record Invoice'}
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Invoice Number *</label>
            <Input 
              name="invoice_number" 
              value={formData.invoice_number} 
              onChange={handleChange} 
              placeholder="e.g. INV-2024-001"
              required
            />
          </div>

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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Due Date</label>
            <Input 
              type="date"
              name="due_date" 
              value={formData.due_date} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Line Items</h4>
            <Button variant="outline" size="sm" onClick={addLine} type="button">
              <Plus size={14} style={{ marginRight: '4px' }} /> Add Line
            </Button>
          </div>

          <div style={{ border: '1px solid var(--ui-gray-200)', borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <THead style={{ background: 'var(--ui-gray-50)' }}>
                <TR>
                  <TH>Expense Account</TH>
                  <TH>Description</TH>
                  <TH>Amount</TH>
                  <TH style={{ width: '40px' }}></TH>
                </TR>
              </THead>
              <TBody>
                {lines.map((line, index) => (
                  <TR key={index}>
                    <TD style={{ padding: '8px' }}>
                      <select 
                        value={line.account_id} 
                        onChange={(e) => handleLineChange(index, 'account_id', e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ui-gray-200)' }}
                      >
                        <option value="">Select Account</option>
                        {accounts.map(a => (
                          <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                        ))}
                      </select>
                    </TD>
                    <TD style={{ padding: '8px' }}>
                      <input 
                        value={line.description} 
                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                        placeholder="Description"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ui-gray-200)' }}
                      />
                    </TD>
                    <TD style={{ padding: '8px' }}>
                      <input 
                        type="number"
                        step="0.01"
                        value={line.amount} 
                        onChange={(e) => handleLineChange(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ui-gray-200)' }}
                      />
                    </TD>
                    <TD style={{ padding: '8px', textAlign: 'center' }}>
                      {lines.length > 1 && (
                        <button type="button" onClick={() => removeLine(index)} style={{ background: 'none', border: 'none', color: 'var(--ui-error)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </div>
      </form>
    </Drawer>
  );
};
