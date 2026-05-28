import React from 'react';
import { Alert } from '@tenarm/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const AlertShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Alert"
        description="Alerts display important, contextual messages to users — such as confirmations, warnings, and errors — without interrupting their workflow."
        badge="Shared UI"
      />

      <ShowcaseSection
        title="Variants"
        description="Each variant uses semantic color coding to communicate the intent of the message."
      >
        <ShowcaseDemo title="All Variants">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Alert variant="info" title="Informational">
              Your session will expire in 30 minutes. Save your work to avoid losing progress.
            </Alert>
            <Alert variant="success" title="Changes Saved">
              The journal entry has been posted and ledger balances have been updated successfully.
            </Alert>
            <Alert variant="warning" title="Approaching Credit Limit">
              This customer has used 90% of their approved credit limit. Proceed with caution.
            </Alert>
            <Alert variant="error" title="Validation Failed">
              Debit total ($12,500) does not match credit total ($12,000). Double-entry rule violated.
            </Alert>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Without Title" description="Alerts can be used without a title for brief, inline messages.">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Alert variant="info">
              A new software update is available. Refresh the page to apply the latest changes.
            </Alert>
            <Alert variant="warning">
              Module sync is running in the background. Performance may be slightly reduced.
            </Alert>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Alert } from '@tenarm/shared-ui';

// Info with title
<Alert variant="info" title="FYI">
  Your session will expire in 30 minutes.
</Alert>

// Error without title
<Alert variant="error">
  Debit / credit totals do not match.
</Alert>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", required: true, description: 'The semantic variant of the alert.' },
          { name: 'title', type: 'string', description: 'Optional bold title displayed above the content.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'The body content of the alert.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
