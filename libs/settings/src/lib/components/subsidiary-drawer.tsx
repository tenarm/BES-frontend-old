import React from 'react';
import { Drawer, Button, Input } from '@bes/shared-ui';
import { SubsidiaryData } from '../types';

interface SubsidiaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubsidiary: SubsidiaryData | null;
  setSelectedSubsidiary: (sub: SubsidiaryData) => void;
  fieldErrors: Record<string, string>;
  onSave: (e: React.FormEvent) => void;
}

export const SubsidiaryDrawer: React.FC<SubsidiaryDrawerProps> = ({
  isOpen,
  onClose,
  selectedSubsidiary,
  setSelectedSubsidiary,
  fieldErrors,
  onSave,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedSubsidiary?.id ? "Edit Subsidiary branch Profile" : "Add Subsidiary legal branch"}
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Save Subsidiary branch</Button>
        </div>
      }
    >
      {selectedSubsidiary && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input 
            label="Legal Name" 
            value={selectedSubsidiary.name} 
            onChange={(e) => setSelectedSubsidiary({ ...selectedSubsidiary, name: e.target.value })}
            required
          />
          <Input 
            label="Base Currency" 
            value={selectedSubsidiary.base_currency} 
            onChange={(e) => setSelectedSubsidiary({ ...selectedSubsidiary, base_currency: e.target.value })}
            placeholder="e.g. USD, EUR"
            required
          />
          <Input 
            label="Tax Registration Identifier" 
            value={selectedSubsidiary.tax_identifier} 
            onChange={(e) => setSelectedSubsidiary({ ...selectedSubsidiary, tax_identifier: e.target.value })}
            error={fieldErrors.tax_identifier}
          />
          <Input 
            label="Billing Address" 
            value={selectedSubsidiary.address_billing} 
            onChange={(e) => setSelectedSubsidiary({ ...selectedSubsidiary, address_billing: e.target.value })}
            multiline
          />
          <Input 
            label="Shipping Address" 
            value={selectedSubsidiary.address_shipping} 
            onChange={(e) => setSelectedSubsidiary({ ...selectedSubsidiary, address_shipping: e.target.value })}
            multiline
          />
        </form>
      )}
    </Drawer>
  );
};
