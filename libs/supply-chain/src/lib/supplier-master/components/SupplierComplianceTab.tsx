import React from 'react';
import { Card, Table, Badge } from '@bes/shared-ui';
import { Calendar, AlertCircle } from 'lucide-react';
import { SupplierCommercialData } from '../types';

interface SupplierComplianceTabProps {
  suppliers: SupplierCommercialData[];
}

export const SupplierComplianceTab: React.FC<SupplierComplianceTabProps> = ({ suppliers }) => {
  const getExpiryBadge = (expiryStr: string) => {
    const expiry = new Date(expiryStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return (
        <Badge variant="danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={12} /> Expired
        </Badge>
      );
    }
    if (diffDays <= 30) {
      return (
        <Badge variant="warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={12} /> Expiring soon ({diffDays}d)
        </Badge>
      );
    }
    return <Badge variant="success">Active (Compliant)</Badge>;
  };

  const getSupplierCerts = () => {
    const certsList: Array<{ vendorName: string; type: string; num: string; authority: string; expiry: string }> = [];
    suppliers.forEach(s => {
      if (s.certifications) {
        s.certifications.forEach(c => {
          certsList.push({
            vendorName: s.name,
            type: c.cert_type,
            num: c.cert_number,
            authority: c.issuing_authority,
            expiry: c.expiry_date
          });
        });
      }
    });
    return certsList;
  };

  const certs = getSupplierCerts();

  return (
    <Card style={{ padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 'var(--ui-text-lg)', fontWeight: 700 }}>Corporate Auditing & Expiration Hub</h3>
      <Table>
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Document Type</th>
            <th>License Number</th>
            <th>Issuing Body</th>
            <th>Expiry Date</th>
            <th>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {certs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--ui-gray-500)' }}>
                No compliance certification documents uploaded.
              </td>
            </tr>
          ) : (
            certs.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{c.vendorName}</td>
                <td><Badge variant="info">{c.type.replace('_', ' ')}</Badge></td>
                <td>{c.num}</td>
                <td>{c.authority}</td>
                <td style={{ fontWeight: 500 }}>{c.expiry}</td>
                <td>{getExpiryBadge(c.expiry)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};
