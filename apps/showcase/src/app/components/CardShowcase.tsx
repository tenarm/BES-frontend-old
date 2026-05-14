import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, Button } from '@erp/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const CardShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Card</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Cards provide a flexible and extensible content container with multiple variants and options.
      </p>

      <ShowcaseSection title="Simple Card (Using Props)">
        <ShowcaseDemo>
          <div style={{ width: '400px' }}>
            <Card title="Sales Report" subtitle="Monthly overview" headerAction={<Button size="sm" variant="outline">Export</Button>}>
              Total sales this month are up by 15%. Keep up the good work!
            </Card>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Complex Card (Using Sub-components)">
        <ShowcaseDemo>
          <div style={{ width: '400px' }}>
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>View and edit customer information</CardDescription>
              </CardHeader>
              <CardBody>
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> john@example.com</p>
                <p><strong>Status:</strong> Active</p>
              </CardBody>
              <CardFooter>
                <Button variant="primary">Edit Profile</Button>
                <Button variant="ghost" style={{ marginLeft: '8px' }}>Cancel</Button>
              </CardFooter>
            </Card>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference (Card)">
        <PropsTable props={[
          { name: 'title', type: 'ReactNode', description: 'The title displayed in the header.' },
          { name: 'subtitle', type: 'ReactNode', description: 'The subtitle displayed below the title.' },
          { name: 'headerAction', type: 'ReactNode', description: 'Action element displayed on the right side of the header.' },
          { name: 'children', type: 'ReactNode', description: 'The body content of the card.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
