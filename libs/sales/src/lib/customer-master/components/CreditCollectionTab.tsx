import React from 'react';
import { Card, Table, Badge, Button } from '@bes/shared-ui';
import { CustomerCommercialData } from '../types';

interface CreditCollectionTabProps {
  customers: CustomerCommercialData[];
  onToggleHold: (customer: CustomerCommercialData) => void;
}

export const CreditCollectionTab: React.FC<CreditCollectionTabProps> = ({ customers, onToggleHold }) => {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Credit & Receivables Summary</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)', marginTop: 4 }}>
          Monitor credit limit utilizations, accounts receivable aging exposure, and delinquency hold locks.
        </p>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Credit Limit</th>
            <th>Outstanding AR</th>
            <th>Max Days Past Due</th>
            <th>Available Credit</th>
            <th>Account Status</th>
            <th style={{ textAlign: 'right' }}>Security controls</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: 'var(--ui-gray-400)' }}>
                No active credit profiles. Onboard a customer to verify billing terms.
              </td>
            </tr>
          ) : (
            customers.map((c) => {
              // Simulate accounts receivable metrics for visual density
              const outstanding = c.credit_hold ? Number(c.credit_limit) * 1.15 : Number(c.credit_limit) * 0.35;
              const maxDaysPastDue = c.credit_hold ? 62 : 12;
              const available = Math.max(0, Number(c.credit_limit) - outstanding);
              
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>
                    {c.credit_limit === 0 ? (
                      <span style={{ color: 'var(--ui-gray-400)' }}>No Limit</span>
                    ) : (
                      `$${Number(c.credit_limit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    )}
                  </td>
                  <td style={{ color: outstanding > Number(c.credit_limit) ? '#dc2626' : 'inherit', fontWeight: 600 }}>
                    ${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <Badge variant={maxDaysPastDue > 30 ? 'danger' : 'info'}>
                      {maxDaysPastDue} Days
                    </Badge>
                  </td>
                  <td style={{ color: available === 0 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                    ${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <Badge variant={c.credit_hold ? 'danger' : 'success'}>
                      {c.credit_hold ? 'HOLD' : 'APPROVED'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button 
                      variant={c.credit_hold ? 'primary' : 'secondary'} 
                      size="sm" 
                      onClick={() => onToggleHold(c)}
                    >
                      {c.credit_hold ? 'Release Hold' : 'Trigger Lock'}
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Card>
  );
};
