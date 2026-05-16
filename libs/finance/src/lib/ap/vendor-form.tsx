import React, { useState } from 'react';
import { Button, Drawer, Input } from '@bes/shared-ui';

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export const VendorForm: React.FC<VendorFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    primary_email: '',
    payment_terms: 'Net 30'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (!res.ok || json.status === 'error') {
        throw new Error(json.error || json.detail || 'Failed to create vendor');
      }

      setFormData({ name: '', tax_id: '', primary_email: '', payment_terms: 'Net 30' });
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
      title="Add New Vendor"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Vendor'}
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
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Vendor Name *</label>
          <Input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. Acme Supplies Ltd."
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Tax ID</label>
          <Input 
            name="tax_id" 
            value={formData.tax_id} 
            onChange={handleChange} 
            placeholder="e.g. TAX-987654321"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Primary Email</label>
          <Input 
            type="email"
            name="primary_email" 
            value={formData.primary_email} 
            onChange={handleChange} 
            placeholder="billing@example.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Payment Terms</label>
          <select 
            name="payment_terms" 
            value={formData.payment_terms} 
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              borderRadius: '6px', 
              border: '1px solid var(--ui-gray-200)',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 45">Net 45</option>
            <option value="Net 60">Net 60</option>
            <option value="Due on Receipt">Due on Receipt</option>
          </select>
        </div>
      </form>
    </Drawer>
  );
};
