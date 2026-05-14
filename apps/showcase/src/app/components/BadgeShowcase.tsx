import React from 'react';
import { Badge } from '@erp/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const BadgeShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Badge</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Badges are used to highlight an item's status for quick recognition.
      </p>

      <ShowcaseSection title="Variants">
        <ShowcaseDemo title="Default, Primary, Success, Warning, Error, Info, Outline">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'variant', type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline'", default: "'default'", description: 'The color variant of the badge.' },
          { name: 'children', type: 'ReactNode', description: 'The content of the badge.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
