import React, { useState } from 'react';
import { Drawer, Button, Input } from '@bes/shared-ui';

interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: any) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');

  const handleSave = () => {
    // In a real app, this would be an API call to /api/v1/customers
    const newCustomer = { 
        id: crypto.randomUUID(), 
        name, 
        email,
        taxId
    };
    onSuccess(newCustomer);
    onClose();
    // Reset form
    setName('');
    setEmail('');
    setTaxId('');
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Quick Create: Customer"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save & Select</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input 
          label="Full Name / Company" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Acme Corp" 
          required
        />
        <Input 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="e.g. contact@acme.com" 
        />
        <Input 
          label="Tax ID / GSTIN" 
          value={taxId} 
          onChange={(e) => setTaxId(e.target.value)} 
          placeholder="e.g. 27AAACR1234A1Z1" 
        />
      </div>
    </Drawer>
  );
};
