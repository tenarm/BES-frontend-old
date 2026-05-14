import React from 'react';
import { Avatar } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const AvatarShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Avatar</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Avatars are used to represent a user or entity.
      </p>

      <ShowcaseSection title="Sizes">
        <ShowcaseDemo>
          <Avatar initials="JD" size="sm" />
          <Avatar initials="JD" size="md" />
          <Avatar initials="JD" size="lg" />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Custom Colors">
        <ShowcaseDemo>
          <Avatar initials="AB" color="#3b82f6" />
          <Avatar initials="CD" color="#ef4444" />
          <Avatar initials="EF" color="#10b981" />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'initials', type: 'string', description: 'The text/initials to display inside the avatar.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The size of the avatar.' },
          { name: 'color', type: 'string', description: 'Optional background color. Defaults to accent color.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
