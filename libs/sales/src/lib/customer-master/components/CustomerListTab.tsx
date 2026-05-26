import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button, Table, Badge, Card, Skeleton } from '@bes/shared-ui';
import { CustomerCommercialData } from '../types';

interface CustomerListTabProps {
  customers: CustomerCommercialData[];
  search: string;
  setSearch: (s: string) => void;
  loading: boolean;
  onOnboard: () => void;
  onEdit: (customer: CustomerCommercialData) => void;
  onToggleHold: (customer: CustomerCommercialData) => void;
}

export const CustomerListTab: React.FC<CustomerListTabProps> = ({
  customers,
  search,
  setSearch,
  loading,
  onOnboard,
  onEdit,
  onToggleHold
}) => {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ui-gray-400)' }} />
          <input 
            type="text" 
            placeholder="Search customers by name, tax ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              border: '1px solid var(--ui-gray-300)',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <Button variant="primary" onClick={onOnboard}>
          <Plus size={16} style={{ marginRight: 6 }} /> Onboard Customer
        </Button>
      </div>

      {loading ? (
        <Skeleton count={5} height={40} />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Tax ID</th>
              <th>Default Currency</th>
              <th>Credit Limit</th>
              <th>Credit Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ui-gray-500)' }}>
                  No customer records found matching search.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--ui-gray-600)' }}>{c.tax_id || '-'}</td>
                  <td><Badge variant="info">{c.currency}</Badge></td>
                  <td style={{ fontWeight: 600 }}>
                    {c.credit_limit === 0 ? (
                      <span style={{ color: 'var(--ui-gray-400)' }}>No Limit</span>
                    ) : (
                      `$${Number(c.credit_limit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    )}
                  </td>
                  <td>
                    <Badge variant={c.credit_hold ? 'danger' : 'success'}>
                      {c.credit_hold ? 'Credit Locked' : 'Active Account'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <Button variant="secondary" size="sm" onClick={() => onEdit(c)}>
                        Edit Profile
                      </Button>
                      <Button 
                        variant={c.credit_hold ? 'primary' : 'secondary'} 
                        size="sm" 
                        onClick={() => onToggleHold(c)}
                      >
                        {c.credit_hold ? 'Unlock Credit' : 'Lock Credit'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Card>
  );
};
