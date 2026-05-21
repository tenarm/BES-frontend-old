import React from 'react';
import { Badge } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const BadgeShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Badge"
        description="Badges are compact labels used to highlight an item's status, category, or count for quick visual recognition."
        badge="Shared UI"
      />

      <ShowcaseSection
        title="Variants"
        description="Semantic color variants communicate the intent of the label at a glance."
      >
        <ShowcaseDemo title="All Variants — ERP status labels">
          <Badge variant="default">Draft</Badge>
          <Badge variant="primary">Processing</Badge>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Pending Review</Badge>
          <Badge variant="error">Overdue</Badge>
          <Badge variant="info">Scheduled</Badge>
          <Badge variant="outline">Archived</Badge>
        </ShowcaseDemo>

        <ShowcaseDemo title="In context — Invoice list">
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--ui-gray-700)', alignItems: 'center' }}>
            <span>INV-001</span><Badge variant="success">Paid</Badge>
            <span>INV-002</span><Badge variant="warning">Pending</Badge>
            <span>INV-003</span><Badge variant="error">Overdue</Badge>
            <span>INV-004</span><Badge variant="default">Draft</Badge>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Badge } from '@bes/shared-ui';

// Status badge
<Badge variant="success">Paid</Badge>

// In a table cell
<TD><Badge variant="warning">Pending</Badge></TD>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'variant', type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline'", default: "'default'", description: 'The color variant of the badge.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'The label text or content.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
