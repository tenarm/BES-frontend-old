import { Badge, PremiumLockIndicator } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const BadgeShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Badge & Lock Indicator"
        description="Badges highlight category status, while lock indicators identify features requiring active premium subscription elevation."
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

        <ShowcaseDemo title="Premium Lock Indicators">
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--ui-gray-700)', alignItems: 'center' }}>
            <span>Profile & Settings</span>
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              Fiscal Calendars <PremiumLockIndicator />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              Intercompany Sharing <PremiumLockIndicator size={16} tooltip="Enterprise plan required" />
            </span>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>


      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Badge, PremiumLockIndicator } from '@bes/shared-ui';

// Status badge
<Badge variant="success">Paid</Badge>

// Locked Premium Tab / Action Indicator
<Tab>
  Fiscal Calendars <PremiumLockIndicator />
</Tab>

// Custom Tooltip & Size
<Button disabled>
  Post Ledger <PremiumLockIndicator size={16} tooltip="Requires Premium Plan" />
</Button>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference (Badge)">
        <PropsTable props={[
          { name: 'variant', type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline'", default: "'default'", description: 'The color variant of the badge.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'The label text or content.' },
        ]} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference (PremiumLockIndicator)">
        <PropsTable props={[
          { name: 'size', type: 'number', default: '14', description: 'Size of the lock icon in pixels.' },
          { name: 'tooltip', type: 'string', default: "'Premium Upgrade Required'", description: 'Tooltip message shown on hover.' },
          { name: 'className', type: 'string', default: 'undefined', description: 'Additional CSS classes.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
