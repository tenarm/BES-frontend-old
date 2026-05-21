import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button, Badge, Avatar } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const CardShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Card"
        description="Cards are the primary surface for grouping related content and actions. They support a flexible header-body-footer composition pattern."
        badge="Shared UI"
      />

      <ShowcaseSection
        title="Simple Card"
        description="Use the shorthand props API for straightforward cards."
      >
        <ShowcaseDemo title="With title, subtitle, and header action">
          <div style={{ width: '380px' }}>
            <Card
              title="Monthly Sales Report"
              subtitle="May 2026 · Finance Module"
              headerAction={<Button size="sm" variant="outline">Export CSV</Button>}
            >
              <p style={{ color: 'var(--ui-gray-600)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Revenue is up <strong style={{ color: '#10b981' }}>+18.3%</strong> month-over-month.
                Total invoiced: <strong>$2,145,800</strong>. Outstanding AR: $312,000.
              </p>
            </Card>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        title="Composed Card"
        description="Use CardHeader, CardBody, and CardFooter sub-components for full control over card layout."
      >
        <ShowcaseDemo title="User profile card">
          <div style={{ width: '380px' }}>
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar initials="JD" color="#4f46e5" size="lg" />
                  <div>
                    <CardTitle>John Doe</CardTitle>
                    <CardDescription>Finance Manager · Acme Corp</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--ui-gray-600)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Department</span><strong>Finance & Accounting</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Role</span><strong>Finance Manager</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Status</span><Badge variant="success">Active</Badge>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm">Edit Profile</Button>
                <Button variant="ghost" size="sm" style={{ marginLeft: '8px' }}>View Audit Log</Button>
              </CardFooter>
            </Card>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@bes/shared-ui';

// Simple shorthand API
<Card title="Sales Report" subtitle="May 2026" headerAction={<Button size="sm">Export</Button>}>
  Revenue up 18% MoM.
</Card>

// Full composition
<Card>
  <CardHeader>
    <CardTitle>Customer Details</CardTitle>
    <CardDescription>View and manage account info</CardDescription>
  </CardHeader>
  <CardBody>
    <p>Name: John Doe</p>
  </CardBody>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference (Card)">
        <PropsTable props={[
          { name: 'title', type: 'ReactNode', description: 'Shorthand title for the card header.' },
          { name: 'subtitle', type: 'ReactNode', description: 'Shorthand subtitle displayed below the title.' },
          { name: 'headerAction', type: 'ReactNode', description: 'Element displayed on the right side of the card header.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'The main body content or sub-components.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
