import React from 'react';
import { Button, Drawer } from '@bes/shared-ui';
import { AlertCircle } from 'lucide-react';

interface AgingReportStubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgingReportStub: React.FC<AgingReportStubProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="AP Aging Report"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', color: 'var(--ui-gray-500)' }}>
        <AlertCircle size={48} color="var(--ui-primary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
        <h3 style={{ margin: '0 0 8px', color: 'var(--ui-gray-900)' }}>Under Construction</h3>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          The full AP Aging Report (bucketed into 30/60/90 days) requires complex analytics. 
          This feature will be available in an upcoming release.
        </p>
      </div>
    </Drawer>
  );
};
