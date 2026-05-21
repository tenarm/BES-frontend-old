import React, { useState } from 'react';

// ─── Section Wrapper ─────────────────────────────────────────────────────────

export const ShowcaseSection = ({
  title,
  description,
  children,
  tag,
}: {
  title: string;
  description?: string;
  tag?: string;
  children: React.ReactNode;
}) => (
  <section style={{ marginBottom: '56px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: description ? '8px' : '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', margin: 0 }}>{title}</h2>
      {tag && (
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
          color: '#4338ca',
          padding: '3px 10px',
          borderRadius: '20px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          {tag}
        </span>
      )}
    </div>
    {description && (
      <p style={{ color: 'var(--ui-gray-500)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6, maxWidth: '700px', margin: '0 0 24px 0' }}>
        {description}
      </p>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {children}
    </div>
  </section>
);

// ─── Demo Frame ───────────────────────────────────────────────────────────────

export const ShowcaseDemo = ({
  title,
  subtitle,
  background = 'white',
  children,
  noPad = false,
}: {
  title?: string;
  subtitle?: string;
  background?: string;
  noPad?: boolean;
  children: React.ReactNode;
}) => (
  <div style={{
    border: '1px solid var(--ui-gray-200)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  }}>
    {title && (
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--ui-gray-200)',
        backgroundColor: 'var(--ui-gray-50)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
      }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ui-gray-700)', margin: 0 }}>{title}</h3>
        {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--ui-gray-400)' }}>{subtitle}</span>}
      </div>
    )}
    <div style={{
      padding: noPad ? 0 : '28px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
      backgroundColor: background,
    }}>
      {children}
    </div>
  </div>
);

// ─── Code Snippet ─────────────────────────────────────────────────────────────

export const CodeSnippet = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1e293b' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
      }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>tsx</span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: copied ? '#10b981' : '#94a3b8',
            cursor: 'pointer',
            fontSize: '0.75rem',
            padding: '3px 10px',
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: '16px',
        background: '#0f172a',
        color: '#e2e8f0',
        fontSize: '0.82rem',
        lineHeight: 1.7,
        overflowX: 'auto',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: 'pre',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ─── Props Table ──────────────────────────────────────────────────────────────

export const PropsTable = ({
  props,
}: {
  props: Array<{ name: string; type: string; default?: string; description: string; required?: boolean }>;
}) => (
  <div style={{ overflowX: 'auto', border: '1px solid var(--ui-gray-200)', borderRadius: '10px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
      <thead style={{ backgroundColor: 'var(--ui-gray-50)', borderBottom: '1px solid var(--ui-gray-200)' }}>
        <tr>
          <th style={{ padding: '12px 20px', color: 'var(--ui-gray-700)', fontWeight: 600, whiteSpace: 'nowrap' }}>Prop</th>
          <th style={{ padding: '12px 20px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Type</th>
          <th style={{ padding: '12px 20px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Default</th>
          <th style={{ padding: '12px 20px', color: 'var(--ui-gray-700)', fontWeight: 600 }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((p, i) => (
          <tr key={p.name} style={{ borderBottom: i !== props.length - 1 ? '1px solid var(--ui-gray-100)' : 'none' }}>
            <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
              <code style={{
                background: '#f1f5f9',
                padding: '2px 8px',
                borderRadius: '5px',
                fontSize: '0.82em',
                color: '#4338ca',
                fontWeight: 600,
              }}>
                {p.name}
              </code>
              {p.required && (
                <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>*</span>
              )}
            </td>
            <td style={{ padding: '12px 20px', color: 'var(--ui-gray-500)' }}>
              <code style={{ color: '#d97706', fontSize: '0.82em' }}>{p.type}</code>
            </td>
            <td style={{ padding: '12px 20px', color: 'var(--ui-gray-400)', fontSize: '0.85em' }}>
              {p.default ? <code style={{ background: '#f8fafc', padding: '1px 6px', borderRadius: '4px' }}>{p.default}</code> : '—'}
            </td>
            <td style={{ padding: '12px 20px', color: 'var(--ui-gray-600)', lineHeight: 1.5 }}>{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Page Header ──────────────────────────────────────────────────────────────

export const PageHeader = ({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) => (
  <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--ui-gray-200)' }}>
    {badge && (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#f0fdf4',
        color: '#16a34a',
        border: '1px solid #bbf7d0',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginBottom: '14px',
        letterSpacing: '0.3px',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        {badge}
      </div>
    )}
    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--ui-gray-900)', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
      {title}
    </h1>
    <p style={{ fontSize: '1.05rem', color: 'var(--ui-gray-500)', margin: 0, maxWidth: '680px', lineHeight: 1.65 }}>
      {description}
    </p>
  </div>
);
