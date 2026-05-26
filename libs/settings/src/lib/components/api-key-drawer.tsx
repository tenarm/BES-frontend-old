import React from 'react';
import { Drawer, Button, Input, Card } from '@bes/shared-ui';
import { ShieldCheck } from 'lucide-react';

interface APIKeyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  newKeyExpires: string;
  setNewKeyExpires: (expires: string) => void;
  plaintextKey: string | null;
  onGenerate: (e: React.FormEvent) => void;
}

export const APIKeyDrawer: React.FC<APIKeyDrawerProps> = ({
  isOpen,
  onClose,
  newKeyName,
  setNewKeyName,
  newKeyExpires,
  setNewKeyExpires,
  plaintextKey,
  onGenerate,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Client API Key"
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {!plaintextKey && <Button variant="primary" onClick={onGenerate}>Generate Access Token</Button>}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {!plaintextKey ? (
          <>
            <Input 
              label="Integration Description / Name" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. PowerBI Connector"
              required
            />
            <Input 
              label="Expiration Date (Optional)" 
              type="date"
              value={newKeyExpires}
              onChange={(e) => setNewKeyExpires(e.target.value)}
            />
          </>
        ) : (
          <Card style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 20 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#166534', fontWeight: 600, marginBottom: 8 }}>
              <ShieldCheck size={18} /> Plaintext Key Generated
            </div>
            <p style={{ fontSize: '0.8rem', color: '#166534', margin: '0 0 12px 0' }}>
              Copy this key now. For security purposes, it will never be displayed again.
            </p>
            <textarea 
              readOnly 
              value={plaintextKey} 
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 6,
                border: '1px solid #bbf7d0',
                background: 'white',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                resize: 'none',
                height: 60
              }}
            />
          </Card>
        )}
      </div>
    </Drawer>
  );
};
