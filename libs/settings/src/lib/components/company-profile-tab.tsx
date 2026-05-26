import React from 'react';
import { Card, Input, Button } from '@bes/shared-ui';
import { CompanyProfileData } from '../types';

interface CompanyProfileTabProps {
  profile: CompanyProfileData;
  onChange: (profile: CompanyProfileData) => void;
  fieldErrors: Record<string, string>;
  onSave: (e: React.FormEvent) => void;
}

export const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({
  profile,
  onChange,
  fieldErrors,
  onSave,
}) => {
  return (
    <Card>
      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--ui-gray-800)' }}>Legal Organization Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Input 
            label="Company Legal Name" 
            value={profile.legal_name}
            onChange={(e) => onChange({ ...profile, legal_name: e.target.value })}
            required
          />
          <Input 
            label="DBA / Trade Name" 
            value={profile.dba_name}
            onChange={(e) => onChange({ ...profile, dba_name: e.target.value })}
          />
          <Input 
            label="Corporate Tax Identifier" 
            value={profile.tax_identifier}
            onChange={(e) => onChange({ ...profile, tax_identifier: e.target.value })}
            error={fieldErrors.tax_identifier}
          />
          <Input 
            label="Contact Email" 
            value={profile.email}
            onChange={(e) => onChange({ ...profile, email: e.target.value })}
          />
          <Input 
            label="Contact Phone" 
            value={profile.phone}
            onChange={(e) => onChange({ ...profile, phone: e.target.value })}
          />
          <Input 
            label="Corporate Website" 
            value={profile.website}
            onChange={(e) => onChange({ ...profile, website: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <Button variant="primary" type="submit">Save Profile Settings</Button>
        </div>
      </form>
    </Card>
  );
};
