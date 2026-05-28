import React from 'react';
import { Button } from '@tenarm/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

// ─── Code Examples ────────────────────────────────────────────────────────────

const basicUsageSnippet = `import { Button } from '@tenarm/shared-ui';

// Primary (default)
<Button onClick={handleSave}>Save Changes</Button>

// Secondary with size
<Button variant="secondary" size="sm">Cancel</Button>

// Outline with loading state
<Button variant="outline" isLoading>Submitting…</Button>

// Ghost (text-like, no background)
<Button variant="ghost">Learn More</Button>

// Disabled
<Button disabled>Unavailable</Button>`;

// ─── Component ────────────────────────────────────────────────────────────────

export const ButtonShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Button"
        badge="@tenarm/shared-ui"
        description="Buttons allow users to take actions and make choices with a single tap. They come in multiple variants, sizes, and states to cover every use case in the application."
      />

      {/* ── Basic Usage ── */}
      <ShowcaseSection
        title="Basic Usage"
        description="Import Button from @bes/shared-ui and compose with variant, size, and state props."
      >
        <CodeSnippet code={basicUsageSnippet} />
      </ShowcaseSection>

      {/* ── Variants ── */}
      <ShowcaseSection
        title="Variants"
        description="Buttons come in different variants to indicate their hierarchical importance within a UI."
      >
        <ShowcaseDemo title="Primary, Secondary, Outline, and Ghost">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Sizes ── */}
      <ShowcaseSection
        title="Sizes"
        description="Three sizes are available to suit different layout densities and contexts."
      >
        <ShowcaseDemo>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── States ── */}
      <ShowcaseSection
        title="States"
        description="Buttons reflect loading and disabled states automatically, keeping interactions safe and consistent."
      >
        <ShowcaseDemo>
          <Button isLoading>Loading…</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Props Reference ── */}
      <ShowcaseSection title="Props Reference">
        <PropsTable
          props={[
            {
              name: 'variant',
              type: "'primary' | 'secondary' | 'outline' | 'ghost'",
              default: "'primary'",
              description: 'The visual style of the button.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'The size of the button.',
            },
            {
              name: 'isLoading',
              type: 'boolean',
              default: 'false',
              description: 'Shows a loading spinner and disables interaction.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Standard HTML disabled attribute — prevents interaction.',
            },
          ]}
        />
      </ShowcaseSection>
    </div>
  );
};
