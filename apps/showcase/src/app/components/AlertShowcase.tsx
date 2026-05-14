import React from 'react';
import { Alert } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const AlertShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Alert</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Alerts communicate important messages to users.
      </p>

      <ShowcaseSection title="Variants">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <Alert variant="info" title="Information">
              This is an informational alert to let you know about something.
            </Alert>
            <Alert variant="success" title="Success">
              The operation completed successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please be careful, this action might have side effects.
            </Alert>
            <Alert variant="error" title="Error">
              An error occurred while processing your request.
            </Alert>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Without Title">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <Alert variant="info">
              This alert has no title, just content.
            </Alert>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'The visual style and icon of the alert.' },
          { name: 'title', type: 'string', description: 'The title displayed in bold.' },
          { name: 'children', type: 'ReactNode', description: 'The content of the alert.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
