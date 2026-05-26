import React from 'react';
import { Card, Button, Table, Badge, PremiumLockIndicator } from '@bes/shared-ui';
import { SubsidiaryData } from '../types';

interface SubsidiariesTabProps {
  subsidiaries: SubsidiaryData[];
  activeTier: 'Basic' | 'Pro' | 'Premium';
  onAdd: () => void;
  onEdit: (sub: SubsidiaryData) => void;
}

export const SubsidiariesTab: React.FC<SubsidiariesTabProps> = ({
  subsidiaries,
  activeTier,
  onAdd,
  onEdit,
}) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Registered Operating Branches</h3>
        <Button variant="primary" onClick={onAdd}>
          Add Subsidiary {activeTier === 'Basic' && <PremiumLockIndicator size={12} style={{ marginLeft: 6 }} />}
        </Button>
      </div>
      
      <Table>
        <thead>
          <tr>
            <th>Subsidiary Name</th>
            <th>Tax ID</th>
            <th>Base Currency</th>
            <th>Billing Address</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subsidiaries.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ui-gray-500)' }}>
                No operating branches registered. Click "Add Subsidiary" to bootstrap your tree.
              </td>
            </tr>
          ) : (
            subsidiaries.map((sub) => (
              <tr key={sub.id}>
                <td style={{ fontWeight: 600 }}>{sub.name}</td>
                <td>{sub.tax_identifier || '-'}</td>
                <td><Badge variant="info">{sub.base_currency}</Badge></td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.address_billing}</td>
                <td>
                  <Badge variant={sub.is_active ? 'success' : 'warning'}>
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onEdit(sub)}
                  >
                    Edit Profile
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
