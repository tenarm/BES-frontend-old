import React, { useState } from 'react';
import { UpgradeGateOverlay } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

// ─── Tier badge helpers ───────────────────────────────────────────────────────

const TIER_META = {
  Pro: {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glow: 'rgba(99, 102, 241, 0.35)',
    badge: '#e0e7ff',
    badgeText: '#4338ca',
    icon: '⚡',
  },
  Premium: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    glow: 'rgba(245, 158, 11, 0.35)',
    badge: '#fef3c7',
    badgeText: '#92400e',
    icon: '👑',
  },
};

// ─── Fake locked content ──────────────────────────────────────────────────────

const FakeAnalyticsWidget = () => (
  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ui-gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      Revenue Analytics
    </div>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: 80 }}>
      {[45, 72, 55, 90, 65, 80, 95].map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            borderRadius: '4px 4px 0 0',
            background: i === 6
              ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
              : `rgba(99,102,241,${0.2 + i * 0.07})`,
          }}
        />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ui-gray-400)' }}>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
    </div>
    <div style={{ display: 'flex', gap: '20px', paddingTop: '8px', borderTop: '1px solid var(--ui-gray-100)' }}>
      {[{ label: 'Revenue', value: '$48,200' }, { label: 'Sessions', value: '12,540' }, { label: 'Conv.', value: '3.8%' }].map((m) => (
        <div key={m.label}>
          <div style={{ fontSize: '0.7rem', color: 'var(--ui-gray-400)' }}>{m.label}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ui-gray-800)' }}>{m.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const FakeAIReportWidget = () => (
  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ui-gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      AI Executive Report
    </div>
    {[
      { icon: '📈', title: 'Growth Trend', body: 'Revenue up 23% YoY. Key driver: enterprise tier adoption in APAC.' },
      { icon: '⚠️', title: 'Risk Signal', body: 'Churn rate elevated in SMB segment — recommend targeted retention outreach.' },
      { icon: '💡', title: 'Opportunity', body: 'Upsell potential identified in 340 accounts with high feature engagement.' },
    ].map((item) => (
      <div
        key={item.title}
        style={{
          display: 'flex',
          gap: '12px',
          padding: '12px',
          background: 'var(--ui-gray-50)',
          borderRadius: '8px',
          border: '1px solid var(--ui-gray-100)',
        }}
      >
        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ui-gray-700)', marginBottom: '4px' }}>{item.title}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ui-gray-500)', lineHeight: 1.5 }}>{item.body}</div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Demo tile ────────────────────────────────────────────────────────────────

interface DemoTileProps {
  tier: 'Pro' | 'Premium';
  moduleName: string;
  children: React.ReactNode;
}

const DemoTile: React.FC<DemoTileProps> = ({ tier, moduleName, children }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const meta = TIER_META[tier];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Tier label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: meta.badge,
            color: meta.badgeText,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {meta.icon} {tier}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--ui-gray-400)' }}>moduleName=&quot;{moduleName}&quot;</span>
      </div>

      {/* Container with the overlay */}
      <div
        style={{
          position: 'relative',
          border: '1px solid var(--ui-gray-200)',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: 220,
          background: '#fff',
        }}
      >
        {children}

        {overlayVisible && (
          <UpgradeGateOverlay
            moduleName={moduleName}
            requiredTier={tier}
            onClose={() => setOverlayVisible(false)}
          />
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setOverlayVisible(true)}
          disabled={overlayVisible}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: overlayVisible ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            background: overlayVisible ? 'var(--ui-gray-100)' : meta.gradient,
            color: overlayVisible ? 'var(--ui-gray-400)' : '#fff',
            boxShadow: overlayVisible ? 'none' : `0 2px 12px ${meta.glow}`,
            transition: 'all 0.2s',
          }}
        >
          🔒 Trigger Gate
        </button>
        {overlayVisible && (
          <button
            onClick={() => setOverlayVisible(false)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid var(--ui-gray-200)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: '#fff',
              color: 'var(--ui-gray-600)',
              transition: 'all 0.2s',
            }}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Props definition ─────────────────────────────────────────────────────────

const UPGRADE_GATE_PROPS = [
  {
    name: 'moduleName',
    type: 'string',
    description: 'The display name of the module or feature that requires an upgrade. Shown in the overlay headline.',
    required: true,
  },
  {
    name: 'requiredTier',
    type: "'Pro' | 'Premium'",
    default: "'Pro'",
    description: "The subscription tier required to unlock the feature. Controls the overlay's colour scheme and label.",
    required: false,
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Optional callback fired when the user dismisses the overlay. If omitted, no close action is rendered.',
    required: false,
  },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export const UpgradeGateShowcase: React.FC = () => (
  <div>
    <PageHeader
      title="UpgradeGateOverlay"
      badge="@bes/shared-ui"
      description="UpgradeGateOverlay renders an absolute-positioned paywall over any position:relative container. Drop it directly inside the feature widget and toggle its visibility when the user's subscription tier is insufficient."
    />

    {/* ── 1. Pro tier demo ───────────────────────────────────────────────── */}
    <ShowcaseSection
      title="Pro Tier Gate"
      description="Use requiredTier='Pro' (the default) to lock features that are available on Pro and above plans."
      tag="Pro"
    >
      <ShowcaseDemo title="Revenue Analytics Widget" subtitle="position: relative container, min-height: 220px">
        <DemoTile tier="Pro" moduleName="Revenue Analytics">
          <FakeAnalyticsWidget />
        </DemoTile>
      </ShowcaseDemo>

      <CodeSnippet
        code={`import { UpgradeGateOverlay } from '@bes/shared-ui';

const AnalyticsWidget = () => {
  const [locked, setLocked] = useState(!user.isPro);

  return (
    // position:relative is required — the overlay is position:absolute
    <div style={{ position: 'relative', minHeight: 220 }}>
      <RevenueChart />

      {locked && (
        <UpgradeGateOverlay
          moduleName="Revenue Analytics"
          requiredTier="Pro"
          onClose={() => setLocked(false)}
        />
      )}
    </div>
  );
};`}
      />
    </ShowcaseSection>

    {/* ── 2. Premium tier demo ───────────────────────────────────────────── */}
    <ShowcaseSection
      title="Premium Tier Gate"
      description="Use requiredTier='Premium' to lock high-value features exclusive to the top plan tier."
      tag="Premium"
    >
      <ShowcaseDemo title="AI Executive Report Widget" subtitle="position: relative container, min-height: 220px">
        <DemoTile tier="Premium" moduleName="AI Executive Report">
          <FakeAIReportWidget />
        </DemoTile>
      </ShowcaseDemo>

      <CodeSnippet
        code={`import { UpgradeGateOverlay } from '@bes/shared-ui';

const AIReportWidget = () => {
  const [locked, setLocked] = useState(!user.isPremium);

  return (
    <div style={{ position: 'relative', minHeight: 220 }}>
      <AIReport />

      {locked && (
        <UpgradeGateOverlay
          moduleName="AI Executive Report"
          requiredTier="Premium"
          onClose={() => setLocked(false)}
        />
      )}
    </div>
  );
};`}
      />
    </ShowcaseSection>

    {/* ── 3. Side-by-side comparison ─────────────────────────────────────── */}
    <ShowcaseSection
      title="Tier Comparison"
      description="Both gate variants side-by-side — notice how the colour scheme and tier label adapt automatically."
      tag="Reference"
    >
      <ShowcaseDemo
        title="Pro vs Premium"
        subtitle="Trigger each gate independently"
        background="var(--ui-gray-50)"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            width: '100%',
          }}
        >
          <DemoTile tier="Pro" moduleName="Advanced Filters">
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ui-gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Advanced Filters
              </div>
              {['Region', 'Segment', 'Product Line', 'Date Range'].map((f) => (
                <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--ui-gray-50)', borderRadius: '6px', border: '1px solid var(--ui-gray-100)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ui-gray-600)' }}>{f}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ui-gray-400)' }}>All</span>
                </div>
              ))}
            </div>
          </DemoTile>

          <DemoTile tier="Premium" moduleName="Predictive Insights">
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ui-gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Predictive Insights
              </div>
              {['Churn Forecast', 'Revenue Prediction', 'Anomaly Detection'].map((item) => (
                <div key={item} style={{ padding: '12px', background: 'var(--ui-gray-50)', borderRadius: '8px', border: '1px solid var(--ui-gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ui-gray-700)', fontWeight: 500 }}>{item}</span>
                  <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>AI</span>
                </div>
              ))}
            </div>
          </DemoTile>
        </div>
      </ShowcaseDemo>
    </ShowcaseSection>

    {/* ── 4. Usage notes ─────────────────────────────────────────────────── */}
    <ShowcaseSection
      title="Usage Notes"
      description="Key layout requirements when integrating UpgradeGateOverlay into a feature widget."
    >
      <ShowcaseDemo title="Layout Requirements">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          {[
            {
              icon: '📐',
              heading: 'position: relative on the container',
              body: 'The overlay uses position: absolute with inset: 0. The nearest positioned ancestor will be its bounding box.',
            },
            {
              icon: '📏',
              heading: 'Set a minimum height',
              body: 'Give the container enough height so the overlay content is not clipped. 220 px is a comfortable minimum for most widgets.',
            },
            {
              icon: '🔒',
              heading: 'Toggle visibility with state',
              body: 'Conditionally render <UpgradeGateOverlay> based on user subscription tier. Pass onClose to allow temporary dismissal.',
            },
            {
              icon: '🎨',
              heading: 'requiredTier drives the visual theme',
              body: "Pro uses an indigo/purple palette; Premium uses amber/gold. You never need to pass colour props manually.",
            },
          ].map((note) => (
            <div
              key={note.heading}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '14px 16px',
                background: 'var(--ui-gray-50)',
                borderRadius: '10px',
                border: '1px solid var(--ui-gray-100)',
              }}
            >
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{note.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--ui-gray-700)', marginBottom: '4px' }}>
                  {note.heading}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ui-gray-500)', lineHeight: 1.55 }}>{note.body}</div>
              </div>
            </div>
          ))}
        </div>
      </ShowcaseDemo>
    </ShowcaseSection>

    {/* ── 5. Props Table ─────────────────────────────────────────────────── */}
    <ShowcaseSection title="Props" description="All props accepted by the UpgradeGateOverlay component.">
      <PropsTable props={UPGRADE_GATE_PROPS} />
    </ShowcaseSection>
  </div>
);

export default UpgradeGateShowcase;
