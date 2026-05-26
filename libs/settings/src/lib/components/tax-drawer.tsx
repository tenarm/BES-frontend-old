import React from 'react';
import { Drawer, Button, Input } from '@bes/shared-ui';
import { TaxProfileData } from '../types';

interface TaxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTax: TaxProfileData | null;
  setSelectedTax: (tax: TaxProfileData) => void;
  onSave: (e: React.FormEvent) => void;
}

export const TaxDrawer: React.FC<TaxDrawerProps> = ({
  isOpen,
  onClose,
  selectedTax,
  setSelectedTax,
  onSave,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Register Tax Jurisdiction"
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Save Profile</Button>
        </div>
      }
    >
      {selectedTax && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input 
            label="Tax Agency / Profile Name" 
            value={selectedTax.name}
            onChange={(e) => setSelectedTax({ ...selectedTax, name: e.target.value })}
            required
          />
          <Input 
            label="Jurisdiction / Region" 
            value={selectedTax.jurisdiction}
            onChange={(e) => setSelectedTax({ ...selectedTax, jurisdiction: e.target.value })}
            required
          />
          <Input 
            label="Tax Rate (Decimal fraction, e.g. 0.18 for 18%)" 
            value={selectedTax.tax_rate.toString()}
            onChange={(e) => setSelectedTax({ ...selectedTax, tax_rate: parseFloat(e.target.value) || 0 })}
            required
          />
        </form>
      )}
    </Drawer>
  );
};
