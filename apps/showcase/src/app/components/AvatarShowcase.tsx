import React from 'react';
import { Avatar } from '@tenarm/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const AvatarShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Avatar"
        description="Avatars visually identify users, system actors, and entities throughout the application using initials and color coding."
        badge="Shared UI"
      />

      <ShowcaseSection title="Sizes" description="Three sizes to fit different layout contexts.">
        <ShowcaseDemo title="sm / md / lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar initials="SM" size="sm" />
            <Avatar initials="MD" size="md" />
            <Avatar initials="LG" size="lg" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Custom Colors" description="Map initials to module- or role-specific colors for identity at a glance.">
        <ShowcaseDemo title="Role-colored avatars">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar initials="JD" color="#4f46e5" />
            <Avatar initials="SK" color="#10b981" />
            <Avatar initials="RA" color="#ef4444" />
            <Avatar initials="MB" color="#f59e0b" />
            <Avatar initials="TS" color="#0ea5e9" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Avatar Stack" description="Stacked avatars represent a group, team, or list of collaborators.">
        <ShowcaseDemo title="Team members">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { initials: 'JD', color: '#4f46e5' },
              { initials: 'SK', color: '#10b981' },
              { initials: 'RA', color: '#ef4444' },
              { initials: 'MB', color: '#f59e0b' },
            ].map((a, i) => (
              <div key={a.initials} style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: 4 - i }}>
                <Avatar initials={a.initials} color={a.color} size="md" />
              </div>
            ))}
            <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--ui-gray-500)', fontWeight: 500 }}>
              +3 more
            </span>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Avatar } from '@tenarm/shared-ui';

// Default
<Avatar initials="JD" />

// With size and custom color
<Avatar initials="SK" size="lg" color="#10b981" />`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'initials', type: 'string', required: true, description: 'Text displayed inside the avatar, typically 1–2 characters.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The size of the avatar circle.' },
          { name: 'color', type: 'string', description: 'Background color. Defaults to the primary accent color.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
