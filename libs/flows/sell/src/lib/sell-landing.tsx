import React, { useEffect, useState } from 'react';
import { Plus, FileText, Truck, FileCheck, CreditCard, TrendingUp } from 'lucide-react';
import { Button, Card, Table, THead, TBody, TR, TH, TD, Badge, Skeleton } from '@bes/shared-ui';
import { useSellStore } from '@bes/modules-sales';
import { fetchQuotations, fetchOrders } from '@bes/modules-sales';
import { fetchInvoices } from '@bes/modules-finance';
import { CreateQuoteStep } from './steps/CreateQuoteStep';
import { ConfirmOrderStep } from './steps/ConfirmOrderStep';
import { ShipOrderStep } from './steps/ShipOrderStep';
import { GenerateInvoiceStep } from './steps/GenerateInvoiceStep';
import { CollectPaymentStep } from './steps/CollectPaymentStep';

// ---- FlowStepper (inline — uses design tokens, not hardcoded values) ----

const STEPS = [
  { id: 'create_quote',      label: 'Create Quote',    icon: <FileText size={14} /> },
  { id: 'confirm_order',     label: 'Confirm Order',   icon: <FileCheck size={14} /> },
  { id: 'ship_order',        label: 'Ship',            icon: <Truck size={14} /> },
  { id: 'generate_invoice',  label: 'Invoice',         icon: <FileCheck size={14} /> },
  { id: 'collect_payment',   label: 'Collect Payment', icon: <CreditCard size={14} /> },
] as const;

type StepId = typeof STEPS[number]['id'];

const FlowStepper: React.FC<{ activeStep: string }> = ({ activeStep }) => {
  const currentIdx = STEPS.findIndex((s) => s.id === activeStep);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', background: 'white',
      border: '1px solid var(--wp-stone-200)', borderRadius: 12,
      padding: '14px 24px', marginBottom: 28,
      boxShadow: 'var(--wp-shadow-sm)', overflowX: 'auto', gap: 8,
    }}>
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;
        return (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                background: isCompleted ? 'var(--wp-primary)' : isActive ? 'var(--wp-accent-muted)' : 'transparent',
                border: isCompleted ? 'none' : isActive ? '2px solid var(--wp-accent)' : '2px solid var(--wp-stone-300)',
                color: isCompleted ? 'white' : isActive ? 'var(--wp-accent)' : 'var(--wp-stone-400)',
              }}>
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span style={{
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--wp-stone-900)' : 'var(--wp-stone-500)',
                fontFamily: 'var(--wp-font-display)',
              }}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{ height: 1, flex: 1, minWidth: 16, background: isCompleted ? 'var(--wp-primary)' : 'var(--wp-stone-200)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---- Landing Page --------------------------------------------------------

const SellDashboard: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ openQuotes: 0, pendingOrders: 0, revenue: '0.0000' });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [quotes, orders, invoices] = await Promise.all([
        fetchQuotations(), fetchOrders(), fetchInvoices(),
      ]);
      setMetrics({
        openQuotes: quotes.filter((q) => q.status === 'draft' || q.status === 'active').length,
        pendingOrders: orders.filter((o) => o.status === 'confirmed').length,
        revenue: invoices
          .filter((i) => i.status === 'paid' || i.status === 'partially_paid')
          .reduce((sum, i) => sum + parseFloat(i.total_amount || '0'), 0)
          .toFixed(4),
      });
      const combined = [
        ...quotes.map((q) => ({ ...q, type: 'Quote', date: q.created_at, ref: q.ref_number })),
        ...orders.map((o) => ({ ...o, type: 'Order', date: o.created_at, ref: o.ref_number })),
        ...invoices.map((i) => ({ ...i, type: 'Invoice', date: i.created_at, ref: i.ref_number })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
      setActivities(combined);
      setLoading(false);
    };
    load();
  }, []);

  const metricCards = [
    { id: 'sell-metric-quotes', icon: <FileText size={22} />, label: 'Open Quotes', value: metrics.openQuotes },
    { id: 'sell-metric-orders', icon: <FileCheck size={22} />, label: 'Pending Orders', value: metrics.pendingOrders },
    { id: 'sell-metric-revenue', icon: <TrendingUp size={22} />, label: 'Revenue (Paid)', value: `$${metrics.revenue}` },
  ];

  return (
    <div style={{ padding: 28, fontFamily: 'var(--wp-font-body)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
            Sell
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--wp-stone-500)', fontSize: 14 }}>
            End-to-end sales pipeline from quotation to payment collection.
          </p>
        </div>
        <Button id="start-sell-btn" variant="primary" onClick={onStart}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Start New Sell
        </Button>
      </header>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 36 }}>
        {metricCards.map((m) => (
          <Card key={m.id} id={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-stone-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {m.label}
                </span>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--wp-font-display)', marginTop: 8, color: 'var(--wp-stone-900)' }}>
                  {loading ? '—' : m.value}
                </div>
              </div>
              <div style={{ background: 'var(--wp-stone-100)', padding: 12, borderRadius: 12, color: 'var(--wp-stone-600)' }}>
                {m.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--wp-stone-900)' }}>
        Recent Activity
      </h2>
      <Card style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map((n) => <Skeleton key={n} style={{ height: 44, borderRadius: 6 }} />)}
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH style={{ fontWeight: 700, color: 'var(--wp-stone-600)', textTransform: 'uppercase', fontSize: 11 }}>Type</TH>
                <TH style={{ fontWeight: 700, color: 'var(--wp-stone-600)', textTransform: 'uppercase', fontSize: 11 }}>Reference</TH>
                <TH style={{ fontWeight: 700, color: 'var(--wp-stone-600)', textTransform: 'uppercase', fontSize: 11 }}>Status</TH>
                <TH style={{ fontWeight: 700, color: 'var(--wp-stone-600)', textTransform: 'uppercase', fontSize: 11 }}>Date</TH>
              </TR>
            </THead>
            <TBody>
              {activities.length === 0 ? (
                <TR>
                  <TD colSpan={4} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--wp-stone-400)', fontSize: 14 }}>
                    No activity yet — start your first Sell workflow above.
                  </TD>
                </TR>
              ) : activities.map((a, idx) => (
                <TR key={idx}>
                  <TD><Badge variant="default">{a.type}</Badge></TD>
                  <TD style={{ fontWeight: 600, fontFamily: 'var(--wp-font-display)', color: 'var(--wp-accent)' }}>{a.ref || '—'}</TD>
                  <TD style={{ textTransform: 'capitalize', fontSize: 13, color: 'var(--wp-stone-600)' }}>{a.status?.replace('_', ' ')}</TD>
                  <TD style={{ fontSize: 13, color: 'var(--wp-stone-400)' }}>{new Date(a.date).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

// ---- Main Export — Flow Router ------------------------------------------

/**
 * SellLanding — Root component registered as `Flow_Sell` in ComponentRegistry.
 *
 * This is now a THIN ORCHESTRATOR (~200 lines).
 * All step UI lives in ./steps/*Step.tsx.
 * All state lives in @bes/modules-sales useSellStore.
 * All API calls live in @bes/modules-sales/api and @bes/modules-finance/api.
 */
export default function SellLanding() {
  const { activeStep, setActiveStep, recoverDraft } = useSellStore();

  // Recover any draft saved during a previous session
  useEffect(() => {
    recoverDraft();
  }, []);

  const goToLanding = () => setActiveStep('landing');

  const stepProps = {
    onNext: () => {/* step components call setActiveStep directly via store */},
    onBack: () => {/* step components call setActiveStep directly via store */},
    onComplete: goToLanding,
  };

  // Landing page — no stepper shown
  if (activeStep === 'landing') {
    return <SellDashboard onStart={() => setActiveStep('create_quote')} />;
  }

  // Flow view — stepper + step content
  return (
    <div style={{ padding: 28, fontFamily: 'var(--wp-font-body)' }}>
      {/* Stepper header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--wp-font-display)', fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--wp-stone-900)' }}>
          Sell Workflow
        </h1>
        <button
          onClick={goToLanding}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--wp-stone-500)', fontSize: 13, fontWeight: 500,
          }}
        >
          ← Back to Sell
        </button>
      </div>

      <FlowStepper activeStep={activeStep} />

      {/* Step content — components handle their own back/next via useSellStore */}
      {activeStep === 'create_quote' && (
        <CreateQuoteStep onNext={stepProps.onNext} />
      )}
      {activeStep === 'confirm_order' && (
        <ConfirmOrderStep
          onNext={stepProps.onNext}
          onBack={() => setActiveStep('create_quote')}
        />
      )}
      {activeStep === 'ship_order' && (
        <ShipOrderStep
          onNext={stepProps.onNext}
          onBack={() => setActiveStep('confirm_order')}
        />
      )}
      {activeStep === 'generate_invoice' && (
        <GenerateInvoiceStep
          onNext={stepProps.onNext}
          onBack={() => setActiveStep('ship_order')}
        />
      )}
      {activeStep === 'collect_payment' && (
        <CollectPaymentStep
          onBack={() => setActiveStep('generate_invoice')}
          onComplete={goToLanding}
        />
      )}
    </div>
  );
}
