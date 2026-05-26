import React from 'react';
import { Card, Button, Table } from '@bes/shared-ui';
import { Plus } from 'lucide-react';
import { APIKeyData } from '../types';

interface APIKeysTabProps {
  apiKeys: APIKeyData[];
  onAdd: () => void;
  onRevoke: (id: string) => void;
}

export const APIKeysTab: React.FC<APIKeysTabProps> = ({
  apiKeys,
  onAdd,
  onRevoke,
}) => {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>API & Integration Access Tokens</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)', marginTop: 4 }}>Generate long-lived keys to authorize external software pipelines.</p>
        </div>
        <Button variant="primary" onClick={onAdd}>
          <Plus size={16} style={{ marginRight: 6 }} /> Generate Token
        </Button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Token Description</th>
            <th>Key Prefix</th>
            <th>Created At</th>
            <th style={{ textAlign: 'right' }}>Security controls</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((k) => (
            <tr key={k.id}>
              <td style={{ fontWeight: 600 }}>{k.name}</td>
              <td><code>{k.key_prefix}</code></td>
              <td>{new Date(k.created_at).toLocaleDateString()}</td>
              <td style={{ textAlign: 'right' }}>
                <Button variant="secondary" size="sm" onClick={() => onRevoke(k.id)}>
                  Revoke Access
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};
