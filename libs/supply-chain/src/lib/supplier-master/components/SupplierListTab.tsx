import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button, Table, Badge, Card, Skeleton } from '@bes/shared-ui';
import { SupplierCommercialData } from '../types';

interface SupplierListTabProps {
  suppliers: SupplierCommercialData[];
  search: string;
  setSearch: (s: string) => void;
  loading: boolean;
  onOnboard: () => void;
  onEdit: (supplier: SupplierCommercialData) => void;
  onToggleHold: (supplier: SupplierCommercialData, type: 'purchasing' | 'payment') => void;
}

export const SupplierListTab: React.FC<SupplierListTabProps> = ({
  suppliers,
  search,
  setSearch,
  loading,
  onOnboard,
  onEdit,
  onToggleHold
}) => {
  const getSupplierStatus = (s: SupplierCommercialData) => {
    if (s.purchasing_hold && s.payment_hold) {
      return <Badge variant="danger">Full Block</Badge>;
    }
    if (s.purchasing_hold) {
      return <Badge variant="warning">PO Blocked</Badge>;
    }
    if (s.payment_hold) {
      return <Badge variant="warning">Payment Blocked</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  const getOtifBadgeVariant = (score: number) => {
    if (score >= 95) return 'success';
    if (score >= 85) return 'info';
    return 'danger';
  };

  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ui-gray-400)' }} />
          <input 
            type="text" 
            placeholder="Search suppliers by corporate name, tax ID, or email..."
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
          <Plus size={16} style={{ marginRight: 6 }} /> Onboard Supplier
        </Button>
      </div>

      {loading ? (
        <Skeleton count={5} height={40} />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Tax ID</th>
              <th>Default Currency</th>
              <th>Lead Time</th>
              <th>OTIF Score</th>
              <th>Sourcing Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--ui-gray-500)' }}>
                  No supplier records found matching search.
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td style={{ color: 'var(--ui-gray-600)' }}>{s.tax_id || '-'}</td>
                  <td><Badge variant="info">{s.currency}</Badge></td>
                  <td style={{ fontWeight: 500 }}>{s.lead_time_days} days</td>
                  <td>
                    <Badge variant={getOtifBadgeVariant(s.otif_score || 100)}>
                      {s.otif_score !== undefined ? `${Number(s.otif_score).toFixed(1)}%` : '100.0%'}
                    </Badge>
                  </td>
                  <td>{getSupplierStatus(s)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <Button variant="secondary" size="sm" onClick={() => onEdit(s)}>
                        Edit Profile
                      </Button>
                      <Button 
                        variant={s.purchasing_hold ? 'primary' : 'secondary'} 
                        size="sm" 
                        onClick={() => onToggleHold(s, 'purchasing')}
                      >
                        {s.purchasing_hold ? 'Unlock PO' : 'Hold PO'}
                      </Button>
                      <Button 
                        variant={s.payment_hold ? 'primary' : 'secondary'} 
                        size="sm" 
                        onClick={() => onToggleHold(s, 'payment')}
                      >
                        {s.payment_hold ? 'Unlock Pay' : 'Hold Pay'}
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
