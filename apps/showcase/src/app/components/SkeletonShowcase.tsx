import React, { useState } from 'react';
import { Skeleton } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Simulates a card with avatar + title + subtitle + two body lines */
const CardSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px' }}>
    {/* Header row: avatar + name/subtitle */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Skeleton width={48} height={48} style={{ borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    {/* Body lines */}
    <Skeleton width="100%" height={12} />
    <Skeleton width="90%" height={12} />
    <Skeleton width="75%" height={12} />
    {/* Image/banner placeholder */}
    <Skeleton width="100%" height={120} style={{ borderRadius: '8px' }} />
    {/* Action row */}
    <div style={{ display: 'flex', gap: '8px' }}>
      <Skeleton width={80} height={32} style={{ borderRadius: '6px' }} />
      <Skeleton width={80} height={32} style={{ borderRadius: '6px' }} />
    </div>
  </div>
);

/** Simulates a loaded card with real content */
const CardContent = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
      maxWidth: '360px',
      border: '1px solid var(--ui-gray-200)',
      borderRadius: '10px',
      padding: '16px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
        }}
      >
        JD
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ui-gray-900)' }}>Jane Doe</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--ui-gray-400)' }}>Product Designer</div>
      </div>
    </div>
    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ui-gray-600)', lineHeight: 1.6 }}>
      Passionate about crafting delightful user experiences with clean, accessible interfaces.
    </p>
    <div
      style={{
        height: 120,
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6366f1',
        fontSize: '0.8rem',
        fontWeight: 600,
      }}
    >
      Cover Image
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        style={{
          padding: '6px 18px',
          borderRadius: '6px',
          border: 'none',
          background: '#6366f1',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.8rem',
        }}
      >
        Follow
      </button>
      <button
        style={{
          padding: '6px 18px',
          borderRadius: '6px',
          border: '1px solid var(--ui-gray-200)',
          background: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.8rem',
          color: 'var(--ui-gray-700)',
        }}
      >
        Message
      </button>
    </div>
  </div>
);

// ─── Table Skeleton ───────────────────────────────────────────────────────────

const TABLE_ROWS = 5;
const TABLE_COLS = [140, 100, 200, 90, 70];

const TableSkeleton = () => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--ui-gray-200)' }}>
          {TABLE_COLS.map((w, i) => (
            <th key={i} style={{ padding: '10px 16px', textAlign: 'left' }}>
              <Skeleton width={w * 0.55} height={13} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: TABLE_ROWS }).map((_, rowIdx) => (
          <tr
            key={rowIdx}
            style={{
              borderBottom: rowIdx < TABLE_ROWS - 1 ? '1px solid var(--ui-gray-100)' : 'none',
              opacity: 1 - rowIdx * 0.08,
            }}
          >
            {TABLE_COLS.map((w, colIdx) => (
              <td key={colIdx} style={{ padding: '12px 16px' }}>
                <Skeleton width={w} height={12} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableContent = () => {
  const rows = [
    { name: 'Alice Martin', role: 'Admin', email: 'alice@example.com', status: 'Active', joined: '2024-01' },
    { name: 'Bob Chen', role: 'Editor', email: 'bob@example.com', status: 'Active', joined: '2024-03' },
    { name: 'Carol Singh', role: 'Viewer', email: 'carol@example.com', status: 'Inactive', joined: '2023-11' },
    { name: 'David Kim', role: 'Editor', email: 'david@example.com', status: 'Active', joined: '2025-01' },
    { name: 'Eve Torres', role: 'Admin', email: 'eve@example.com', status: 'Pending', joined: '2025-05' },
  ];

  const badgeColor: Record<string, string> = {
    Active: '#dcfce7',
    Inactive: '#fee2e2',
    Pending: '#fef9c3',
  };
  const badgeText: Record<string, string> = {
    Active: '#16a34a',
    Inactive: '#dc2626',
    Pending: '#ca8a04',
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr
            style={{
              borderBottom: '2px solid var(--ui-gray-200)',
              color: 'var(--ui-gray-500)',
              fontWeight: 600,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {['Name', 'Role', 'Email', 'Status', 'Joined'].map((h) => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--ui-gray-100)' : 'none' }}>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--ui-gray-800)' }}>{r.name}</td>
              <td style={{ padding: '12px 16px', color: 'var(--ui-gray-500)' }}>{r.role}</td>
              <td style={{ padding: '12px 16px', color: 'var(--ui-gray-500)' }}>{r.email}</td>
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    background: badgeColor[r.status],
                    color: badgeText[r.status],
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {r.status}
                </span>
              </td>
              <td style={{ padding: '12px 16px', color: 'var(--ui-gray-400)', fontSize: '0.8rem' }}>{r.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Toggle Button ────────────────────────────────────────────────────────────

const ToggleButton = ({
  isLoading,
  onToggle,
}: {
  isLoading: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      background: isLoading
        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        : 'linear-gradient(135deg, #10b981, #059669)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}
  >
    {isLoading ? (
      <>
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        Show Loaded State
      </>
    ) : (
      <>
        <span>⟳</span>
        Show Loading State
      </>
    )}
  </button>
);

// ─── Props definition ─────────────────────────────────────────────────────────

const SKELETON_PROPS = [
  {
    name: 'width',
    type: 'string | number',
    default: '100%',
    description: 'Width of the skeleton. Numbers are treated as pixels; strings accept any CSS value.',
    required: false,
  },
  {
    name: 'height',
    type: 'string | number',
    default: '16px',
    description: 'Height of the skeleton. Numbers are treated as pixels; strings accept any CSS value.',
    required: false,
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS class names to apply to the root element.',
    required: false,
  },
  {
    name: 'style',
    type: 'React.CSSProperties',
    description: 'Inline styles merged on top of the default skeleton styles — useful for border-radius overrides.',
    required: false,
  },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export const SkeletonShowcase: React.FC = () => {
  const [cardLoading, setCardLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  return (
    <div>
      {/* Spinner keyframe — injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <PageHeader
        title="Skeleton"
        badge="@bes/shared-ui"
        description="Skeleton is a placeholder component used to represent content while data is loading. It prevents layout shift and gives users an instant sense of what is coming."
      />

      {/* ── 1. Basic Sizes ─────────────────────────────────────────────────── */}
      <ShowcaseSection
        title="Basic Shapes & Sizes"
        description="Use width and height props to match the dimensions of the real content you are replacing."
        tag="Primitives"
      >
        <ShowcaseDemo title="Text Lines" subtitle="height 12–20px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: 480 }}>
            <Skeleton width="80%" height={20} />
            <Skeleton width="65%" height={16} />
            <Skeleton width="55%" height={12} />
          </div>
        </ShowcaseDemo>

        <ShowcaseDemo title="Avatar / Circle" subtitle="style={{ borderRadius: '50%' }}">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {[32, 40, 48, 64, 80].map((size) => (
              <Skeleton key={size} width={size} height={size} style={{ borderRadius: '50%' }} />
            ))}
          </div>
        </ShowcaseDemo>

        <ShowcaseDemo title="Rectangles / Blocks" subtitle="Various widths × heights">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <Skeleton width={120} height={36} style={{ borderRadius: '6px' }} />
            <Skeleton width={240} height={24} />
            <Skeleton width="50%" height={80} style={{ borderRadius: '8px' }} />
            <Skeleton width="100%" height={160} style={{ borderRadius: '10px' }} />
          </div>
        </ShowcaseDemo>

        <CodeSnippet
          code={`// Text line
<Skeleton width="80%" height={20} />

// Circle avatar
<Skeleton width={48} height={48} style={{ borderRadius: '50%' }} />

// Rounded block
<Skeleton width="100%" height={160} style={{ borderRadius: '10px' }} />`}
        />
      </ShowcaseSection>

      {/* ── 2. Card Skeleton ───────────────────────────────────────────────── */}
      <ShowcaseSection
        title="Card Loading Skeleton"
        description="Compose individual Skeleton primitives to mirror the layout of a real card — avatar, name, subtitle, body text, image, and action buttons."
        tag="Composition"
      >
        <ShowcaseDemo
          title="User Profile Card"
          subtitle={cardLoading ? 'loading…' : 'loaded'}
          background="var(--ui-gray-50)"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div>{cardLoading ? <CardSkeleton /> : <CardContent />}</div>
            <ToggleButton isLoading={cardLoading} onToggle={() => setCardLoading((v) => !v)} />
          </div>
        </ShowcaseDemo>

        <CodeSnippet
          code={`const CardSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {/* Avatar + name row */}
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Skeleton width={48} height={48} style={{ borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    {/* Body lines */}
    <Skeleton width="100%" height={12} />
    <Skeleton width="90%"  height={12} />
    <Skeleton width="75%"  height={12} />
    {/* Image placeholder */}
    <Skeleton width="100%" height={120} style={{ borderRadius: '8px' }} />
    {/* CTA buttons */}
    <div style={{ display: 'flex', gap: '8px' }}>
      <Skeleton width={80} height={32} style={{ borderRadius: '6px' }} />
      <Skeleton width={80} height={32} style={{ borderRadius: '6px' }} />
    </div>
  </div>
);`}
        />
      </ShowcaseSection>

      {/* ── 3. Table Skeleton ──────────────────────────────────────────────── */}
      <ShowcaseSection
        title="Table Loading Skeleton"
        description="Replace data rows with skeleton cells while fetching. Using decreasing opacity per row gives a natural depth fade effect."
        tag="Composition"
      >
        <ShowcaseDemo
          title="Users Table"
          subtitle={tableLoading ? 'fetching rows…' : '5 records loaded'}
          noPad
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
            <div style={{ padding: '20px 24px 16px' }}>
              {tableLoading ? <TableSkeleton /> : <TableContent />}
            </div>
            <div
              style={{
                borderTop: '1px solid var(--ui-gray-100)',
                padding: '12px 24px',
                background: 'var(--ui-gray-50)',
              }}
            >
              <ToggleButton isLoading={tableLoading} onToggle={() => setTableLoading((v) => !v)} />
            </div>
          </div>
        </ShowcaseDemo>

        <CodeSnippet
          code={`const TableSkeleton = () => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ borderBottom: '2px solid var(--ui-gray-200)' }}>
        {[80, 55, 110, 50].map((w, i) => (
          <th key={i} style={{ padding: '10px 16px' }}>
            <Skeleton width={w} height={13} />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 5 }).map((_, row) => (
        <tr key={row} style={{ opacity: 1 - row * 0.08 }}>
          {[140, 100, 200, 90].map((w, col) => (
            <td key={col} style={{ padding: '12px 16px' }}>
              <Skeleton width={w} height={12} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);`}
        />
      </ShowcaseSection>

      {/* ── 4. Props Table ─────────────────────────────────────────────────── */}
      <ShowcaseSection title="Props" description="All props accepted by the Skeleton component.">
        <PropsTable props={SKELETON_PROPS} />
      </ShowcaseSection>
    </div>
  );
};

export default SkeletonShowcase;
