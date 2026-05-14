import React from 'react';
import { Input } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';
import { Search } from 'lucide-react';

export const InputShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Input</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Inputs allow users to enter text into a UI.
      </p>

      <ShowcaseSection title="Basic Input">
        <ShowcaseDemo>
          <div style={{ width: '300px' }}>
            <Input placeholder="Enter something..." />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="With Label and Helper Text">
        <ShowcaseDemo>
          <div style={{ width: '300px' }}>
            <Input label="Email Address" type="email" placeholder="you@example.com" helperText="We'll never share your email." />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Error State">
        <ShowcaseDemo>
          <div style={{ width: '300px' }}>
            <Input label="Username" defaultValue="admin" error="Username is already taken" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="With Icon">
        <ShowcaseDemo>
          <div style={{ width: '300px' }}>
            <Input placeholder="Search..." icon={<Search size={16} color="var(--ui-gray-400)" />} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="With Action Button">
        <ShowcaseDemo>
          <div style={{ width: '300px' }}>
            <Input label="Customer" placeholder="Select customer..." onActionClick={() => alert('Add customer')} actionLabel="+" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'label', type: 'string', description: 'The label for the input.' },
          { name: 'error', type: 'string', description: 'Error message to display below the input. Also styles the input with error colors.' },
          { name: 'helperText', type: 'string', description: 'Helper text to display below the input.' },
          { name: 'icon', type: 'React.ReactNode', description: 'An icon to display inside the input.' },
          { name: 'onActionClick', type: '() => void', description: 'Callback for when the inline action button is clicked.' },
          { name: 'actionLabel', type: 'string', default: "'+'", description: 'Label for the action button.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
