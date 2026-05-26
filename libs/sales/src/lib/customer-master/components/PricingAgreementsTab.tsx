import React, { useState } from 'react';
import { Card, Table, Badge, Button, Input } from '@bes/shared-ui';
import { CustomerCommercialData } from '../types';
import { Percent, Plus, Trash2 } from 'lucide-react';

interface PricingAgreementsTabProps {
  customers: CustomerCommercialData[];
  showToast: (type: 'success' | 'error', msg: string) => void;
}

interface PriceAgreement {
  id: string;
  customerName: string;
  agreementType: string;
  discount: number;
  minOrder: number;
  status: 'Active' | 'Draft' | 'Expired';
  validUntil: string;
}

export const PricingAgreementsTab: React.FC<PricingAgreementsTabProps> = ({ customers, showToast }) => {
  const [agreements, setAgreements] = useState<PriceAgreement[]>([
    {
      id: 'a1',
      customerName: 'Acme Corporation',
      agreementType: 'Contract Price List',
      discount: 15.0,
      minOrder: 1000,
      status: 'Active',
      validUntil: '2026-12-31'
    },
    {
      id: 'a2',
      customerName: 'Globex Holdings',
      agreementType: 'Volume Tier Discount',
      discount: 22.5,
      minOrder: 5000,
      status: 'Active',
      validUntil: '2026-09-30'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCust, setSelectedCust] = useState('');
  const [type, setType] = useState('Contract Price List');
  const [discount, setDiscount] = useState(10);
  const [minOrder, setMinOrder] = useState(500);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleAddAgreement = () => {
    if (!selectedCust) {
      showToast('error', 'Please select a customer.');
      return;
    }
    const newAgre: PriceAgreement = {
      id: crypto.randomUUID(),
      customerName: selectedCust,
      agreementType: type,
      discount: Number(discount),
      minOrder: Number(minOrder),
      status: 'Active',
      validUntil: validUntil
    };
    setAgreements([...agreements, newAgre]);
    setShowAddForm(false);
    showToast('success', `Pricing agreement for ${selectedCust} added successfully.`);
  };

  const handleDelete = (id: string, name: string) => {
    setAgreements(agreements.filter(a => a.id !== id));
    showToast('success', `Pricing agreement for ${name} removed.`);
  };

  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Custom Pricing & Promotion Matrix</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)', marginTop: 4 }}>
            Manage custom contracts, contract pricing tiers, and client discount structures.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} style={{ marginRight: 6 }} /> Create Price Agreement
        </Button>
      </div>

      {showAddForm && (
        <Card style={{ padding: 16, background: 'var(--ui-gray-50)', marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700 }}>Add Price Agreement</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Customer</label>
              <select
                value={selectedCust}
                onChange={(e) => setSelectedCust(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ui-gray-300)', fontSize: '0.875rem' }}
              >
                <option value="">-- Select Customer --</option>
                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Agreement Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ui-gray-300)', fontSize: '0.875rem' }}
              >
                <option value="Contract Price List">Contract Price List</option>
                <option value="Volume Tier Discount">Volume Tier Discount</option>
                <option value="Promotional Agreement">Promotional Agreement</option>
              </select>
            </div>
            <Input
              label="Discount Percentage (%)"
              type="number"
              value={discount.toString()}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Input
              label="Minimum Order Value ($)"
              type="number"
              value={minOrder.toString()}
              onChange={(e) => setMinOrder(Number(e.target.value) || 0)}
            />
            <Input
              label="Valid Until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={handleAddAgreement} size="sm">Save Agreement</Button>
            <Button variant="secondary" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
          </div>
        </Card>
      )}

      <Table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Agreement Type</th>
            <th>Discount Value</th>
            <th>Min Order Value</th>
            <th>Status</th>
            <th>Valid Until</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agreements.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: 'var(--ui-gray-400)' }}>
                No custom pricing agreements active.
              </td>
            </tr>
          ) : (
            agreements.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.customerName}</td>
                <td>{a.agreementType}</td>
                <td style={{ fontWeight: 600, color: 'var(--ui-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Percent size={14} /> {a.discount}%
                  </div>
                </td>
                <td>${a.minOrder.toLocaleString()}</td>
                <td>
                  <Badge variant={a.status === 'Active' ? 'success' : a.status === 'Draft' ? 'info' : 'danger'}>
                    {a.status}
                  </Badge>
                </td>
                <td>{a.validUntil}</td>
                <td style={{ textAlign: 'right' }}>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(a.id, a.customerName)}>
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};
