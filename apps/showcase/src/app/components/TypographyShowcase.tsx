import React from 'react';
import { ShowcaseSection, ShowcaseDemo } from './ShowcaseSection';

export const TypographyShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Typography</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Typography styles are managed via global CSS and design tokens. Here are the standard HTML elements.
      </p>

      <ShowcaseSection title="Headings">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <h1>h1. Heading 1</h1>
            <h2>h2. Heading 2</h2>
            <h3>h3. Heading 3</h3>
            <h4>h4. Heading 4</h4>
            <h5>h5. Heading 5</h5>
            <h6>h6. Heading 6</h6>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Paragraphs & Text">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <p>
              This is a standard paragraph. It uses the default font size and line height. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--ui-gray-500)' }}>
              This is small, secondary text often used for helper text or captions.
            </p>
            <p>
              You can also use <strong>strong</strong> text, <em>emphasized</em> text, or <mark>highlighted</mark> text.
            </p>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  );
};
