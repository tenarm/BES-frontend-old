import React from 'react';
import { Card, Input, Button } from '@bes/shared-ui';

interface SSOConfigTabProps {
  ssoConfig: {
    sso_enabled: boolean;
    provider: string;
    client_id: string;
    client_secret: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
  };
  setSsoConfig: (config: any) => void;
  onSave: (e: React.FormEvent) => void;
}

export const SSOConfigTab: React.FC<SSOConfigTabProps> = ({
  ssoConfig,
  setSsoConfig,
  onSave,
}) => {
  return (
    <Card style={{ padding: '20px' }}>
      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>SSO & SAML2 Integration</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)', marginTop: 4 }}>Outsource authentication validations to your enterprise identity provider.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--ui-gray-50)', borderRadius: 8 }}>
          <input 
            type="checkbox" 
            id="sso_enabled" 
            checked={ssoConfig.sso_enabled}
            onChange={(e) => setSsoConfig({ ...ssoConfig, sso_enabled: e.target.checked })}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="sso_enabled" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Enable Single Sign-On (SSO) Bypass for Operator Logins
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Input 
            label="OAuth/SAML Client ID" 
            value={ssoConfig.client_id}
            onChange={(e) => setSsoConfig({ ...ssoConfig, client_id: e.target.value })}
            disabled={!ssoConfig.sso_enabled}
          />
          <Input 
            label="Client Secret key" 
            value={ssoConfig.client_secret}
            onChange={(e) => setSsoConfig({ ...ssoConfig, client_secret: e.target.value })}
            type="password"
            disabled={!ssoConfig.sso_enabled}
          />
          <Input 
            label="Authorize endpoint URL" 
            value={ssoConfig.authorization_endpoint}
            onChange={(e) => setSsoConfig({ ...ssoConfig, authorization_endpoint: e.target.value })}
            disabled={!ssoConfig.sso_enabled}
          />
          <Input 
            label="Token exchange endpoint" 
            value={ssoConfig.token_endpoint}
            onChange={(e) => setSsoConfig({ ...ssoConfig, token_endpoint: e.target.value })}
            disabled={!ssoConfig.sso_enabled}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <Button variant="primary" type="submit">Save SSO Configuration</Button>
        </div>
      </form>
    </Card>
  );
};
