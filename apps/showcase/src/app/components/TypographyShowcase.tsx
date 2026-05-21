import React from 'react';
import { ShowcaseSection, ShowcaseDemo, PageHeader } from './ShowcaseSection';

export const TypographyShowcase = () => {
  const token = (name: string, value: string, hex: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: hex, border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ui-gray-700)', fontFamily: 'monospace' }}>
          {name}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ui-gray-400)' }}>{value} — {hex}</div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Typography & Design Tokens"
        description="BES uses a curated type scale and semantic design tokens via CSS custom properties. All components inherit these values, ensuring visual consistency across modules."
        badge="Design System"
      />

      <ShowcaseSection title="Heading Scale" description="Six heading levels with progressively smaller font sizes and weights.">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {[
              { tag: 'h1', label: 'Display — Page Title', size: '2.25rem', weight: 800 },
              { tag: 'h2', label: 'Section Heading', size: '1.5rem', weight: 700 },
              { tag: 'h3', label: 'Subsection Heading', size: '1.25rem', weight: 700 },
              { tag: 'h4', label: 'Card Title', size: '1.1rem', weight: 600 },
              { tag: 'h5', label: 'Form Label / Meta', size: '0.95rem', weight: 600 },
              { tag: 'h6', label: 'Caption / Tag', size: '0.8rem', weight: 600 },
            ].map(({ tag, label, size, weight }) => (
              <div key={tag} style={{ display: 'flex', alignItems: 'baseline', gap: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--ui-gray-100)' }}>
                <span style={{ width: '28px', fontSize: '11px', color: 'var(--ui-gray-400)', fontFamily: 'monospace', flexShrink: 0 }}>&lt;{tag}&gt;</span>
                <span style={{ fontSize: size, fontWeight: weight, color: 'var(--ui-gray-900)', lineHeight: 1.2 }}>{label}</span>
              </div>
            ))}
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Body Text & Utilities" description="Standard paragraph styles, helper text, and emphasis.">
        <ShowcaseDemo>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <p style={{ margin: 0 }}>
              Standard body text at 16px / 1.6 line-height. Used for main content, descriptions, and reading-heavy areas.
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ui-gray-500)' }}>
              Secondary / helper text at 14px. Used for captions, meta labels, and contextual hints below form fields.
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ui-gray-400)', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 600 }}>
              Overline / Module Tag
            </p>
            <p style={{ margin: 0 }}>
              Inline emphasis: <strong>bold critical values</strong>, <em>italicized notes</em>,{' '}
              <code style={{ background: 'var(--ui-gray-100)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.9em', color: '#4338ca' }}>inline code</code>,{' '}
              and <mark style={{ background: '#fef9c3', padding: '0 2px' }}>highlighted text</mark>.
            </p>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Color Tokens" description="Semantic CSS custom properties used throughout all shared-ui components.">
        <ShowcaseDemo>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', width: '100%' }}>
            {token('--ui-primary', 'Brand Blue', '#2563eb')}
            {token('--ui-gray-900', 'Ink / Text', '#0f172a')}
            {token('--ui-gray-700', 'Secondary Text', '#334155')}
            {token('--ui-gray-500', 'Muted Text', '#64748b')}
            {token('--ui-gray-400', 'Placeholder', '#94a3b8')}
            {token('--ui-gray-200', 'Border', '#e2e8f0')}
            {token('--ui-gray-100', 'Divider', '#f1f5f9')}
            {token('--ui-gray-50', 'Surface BG', '#f8fafc')}
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  );
};
