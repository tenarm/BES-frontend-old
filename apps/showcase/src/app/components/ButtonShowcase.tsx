import React from 'react';
import { Button } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const ButtonShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Button</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Buttons allow users to take actions, and make choices, with a single tap.
      </p>

      <ShowcaseSection title="Variants" description="Buttons come in different variants to indicate their hierarchical importance.">
        <ShowcaseDemo title="Primary, Secondary, Outline, and Ghost">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes" description="Buttons can be different sizes to fit different contexts.">
        <ShowcaseDemo>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="States" description="Buttons can reflect different states like loading or disabled.">
        <ShowcaseDemo>
          <Button isLoading>Loading...</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost'", default: "'primary'", description: 'The visual style of the button.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The size of the button.' },
          { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a loading spinner and disables the button.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Standard HTML disabled prop.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
