import React from 'react';
import { Card, Table, Badge } from '@bes/shared-ui';
import { Award, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { SupplierCommercialData } from '../types';

interface SupplierPerformanceTabProps {
  suppliers: SupplierCommercialData[];
}

export const SupplierPerformanceTab: React.FC<SupplierPerformanceTabProps> = ({ suppliers }) => {
  const getSourcingTierBadge = (score: number) => {
    if (score >= 95) {
      return (
        <Badge variant="success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={12} /> Strategic Partner
        </Badge>
      );
    }
    if (score >= 88) {
      return (
        <Badge variant="info" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Award size={12} /> Preferred Supplier
        </Badge>
      );
    }
    if (score >= 75) {
      return <Badge variant="warning">Standard Supplier</Badge>;
    }
    return (
      <Badge variant="danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ShieldAlert size={12} /> Under Probation
      </Badge>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Strategic Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 12, borderRadius: 12, color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Avg Monitored OTIF</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ui-gray-800)' }}>94.6%</div>
          </div>
        </Card>

        <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 12, color: '#ef4444' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Defective Shipments</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ui-gray-800)' }}>0.82%</div>
          </div>
        </Card>
      </div>

      {/* Detail Performance Metrics Table */}
      <Card style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 'var(--ui-text-lg)', fontWeight: 700 }}>Rolling 90-Day Sourcing Scorecard</h3>
        <Table>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>OTIF Target</th>
              <th>Current OTIF Score</th>
              <th>Defect Rate</th>
              <th>Performance Tier</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--ui-gray-500)' }}>
                  No active performance logs recorded.
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.otif_target !== undefined ? `${Number(s.otif_target).toFixed(1)}%` : '95.0%'}</td>
                  <td style={{ fontWeight: 700, color: (s.otif_score || 100) >= (s.otif_target || 95) ? '#10b981' : '#ef4444' }}>
                    {s.otif_score !== undefined ? `${Number(s.otif_score).toFixed(1)}%` : '100.0%'}
                  </td>
                  <td>{s.defect_rate !== undefined ? `${Number(s.defect_rate).toFixed(2)}%` : '0.00%'}</td>
                  <td>{getSourcingTierBadge(s.otif_score || 100)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
