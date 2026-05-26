import React from 'react';
import { Card, Button, Table, Badge } from '@bes/shared-ui';
import { TaxProfileData } from '../types';

interface TaxProfilesTabProps {
  taxProfiles: TaxProfileData[];
  onAdd: () => void;
}

export const TaxProfilesTab: React.FC<TaxProfilesTabProps> = ({
  taxProfiles,
  onAdd,
}) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Regional Tax Jurisdictions</h3>
        <Button variant="primary" onClick={onAdd}>
          Add Tax Profile
        </Button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Tax Name</th>
            <th>Jurisdiction</th>
            <th>Tax Rate (%)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {taxProfiles.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--ui-gray-500)' }}>
                No regional tax profiles registered.
              </td>
            </tr>
          ) : (
            taxProfiles.map((tax) => (
              <tr key={tax.id}>
                <td style={{ fontWeight: 600 }}>{tax.name}</td>
                <td>{tax.jurisdiction}</td>
                <td><Badge variant="success">{(tax.tax_rate * 100).toFixed(2)}%</Badge></td>
                <td>
                  <Badge variant={tax.is_active ? 'success' : 'warning'}>
                    {tax.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};
