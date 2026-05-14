import React from 'react';

export const ShowcaseSection = ({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) => (
  <section style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--ui-gray-900)', marginBottom: '8px' }}>{title}</h2>
    {description && <p style={{ color: 'var(--ui-gray-600)', fontSize: '1rem', marginBottom: '24px', lineHeight: 1.5 }}>{description}</p>}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {children}
    </div>
  </section>
);

export const ShowcaseDemo = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div style={{ border: '1px solid var(--ui-gray-200)', borderRadius: '8px', overflow: 'hidden' }}>
    {title && (
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ui-gray-200)', backgroundColor: 'var(--ui-gray-50)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ui-gray-700)', margin: 0 }}>{title}</h3>
      </div>
    )}
    <div style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', backgroundColor: '#fff' }}>
      {children}
    </div>
  </div>
);

export const PropsTable = ({ props }: { props: Array<{name: string, type: string, default?: string, description: string}> }) => (
  <div style={{ overflowX: 'auto', border: '1px solid var(--ui-gray-200)', borderRadius: '8px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
      <thead style={{ backgroundColor: 'var(--ui-gray-50)', borderBottom: '1px solid var(--ui-gray-200)' }}>
        <tr>
          <th style={{ padding: '12px 16px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Prop</th>
          <th style={{ padding: '12px 16px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Type</th>
          <th style={{ padding: '12px 16px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Default</th>
          <th style={{ padding: '12px 16px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((p, i) => (
          <tr key={p.name} style={{ borderBottom: i !== props.length - 1 ? '1px solid var(--ui-gray-100)' : 'none' }}>
            <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ui-gray-900)' }}>
              <code style={{ backgroundColor: 'var(--ui-gray-100)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em', color: 'var(--ui-primary)' }}>{p.name}</code>
            </td>
            <td style={{ padding: '12px 16px', color: 'var(--ui-gray-600)' }}>
              <code style={{ color: '#d97706', fontSize: '0.85em' }}>{p.type}</code>
            </td>
            <td style={{ padding: '12px 16px', color: 'var(--ui-gray-500)' }}>
              {p.default ? <code>{p.default}</code> : '-'}
            </td>
            <td style={{ padding: '12px 16px', color: 'var(--ui-gray-600)' }}>{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
