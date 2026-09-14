import React from 'react';
import { Timeline, ProcessPipeline, PendingAction } from '@bes/shared-ui';
import type { ProcessDefinition, ProcessEvent, AuditEntry } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const dummyDefinition: ProcessDefinition = {
  processId: 'sales_order',
  label: 'Sales Order Fulfillment',
  entity: 'order',
  steps: [
    { id: 'draft', label: 'Draft', type: 'direct', statusEvent: 'draft.completed' },
    { id: 'payment', label: 'Payment', type: 'sequence', dependsOn: ['draft'], statusEvent: 'payment.completed' },
    { id: 'fulfillment', label: 'Fulfillment', type: 'sequence', dependsOn: ['payment'], statusEvent: 'fulfillment.active' },
    { id: 'shipping', label: 'Shipping', type: 'sequence', dependsOn: ['fulfillment'], statusEvent: 'shipping.shipped' },
    { id: 'delivered', label: 'Delivered', type: 'sequence', dependsOn: ['shipping'], statusEvent: 'order.delivered' },
  ],
};

const dummyEvents: ProcessEvent[] = [
  { eventKey: 'draft.completed', occurredAt: '2026-05-10T10:00:00Z', actor: 'System', actorType: 'system' },
  { eventKey: 'payment.completed', occurredAt: '2026-05-10T11:30:00Z', actor: 'John Doe', actorType: 'user' },
  { eventKey: 'fulfillment.active', occurredAt: '2026-05-11T09:00:00Z', actor: 'Warehouse Bot', actorType: 'system' },
];

const dummyTimelineEntries: AuditEntry[] = [
  {
    id: '1', event_id: 'ev1', parent_audit_id: null, correlation_id: 'corr1', changes: {},
    action: 'CREATE', module: 'Sales', description: 'System generated the order.',
    actor_type: 'system', actor_id: 'sys1', actor_name: 'System',
    entity_type: 'order', entity_id: 'ORD-001', created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: '2', event_id: 'ev2', parent_audit_id: null, correlation_id: 'corr1', changes: {},
    action: 'UPDATE', module: 'Finance', description: 'Credit card payment approved.',
    actor_type: 'user', actor_id: 'u1', actor_name: 'John Doe',
    entity_type: 'order', entity_id: 'ORD-001', created_at: '2026-05-10T11:30:00Z',
  },
  {
    id: '3', event_id: 'ev3', parent_audit_id: null, correlation_id: 'corr1', changes: {},
    action: 'UPDATE', module: 'Inventory', description: 'Inventory reserved for order.',
    actor_type: 'system', actor_id: 'sys2', actor_name: 'Warehouse Bot',
    entity_type: 'order', entity_id: 'ORD-001', created_at: '2026-05-11T09:00:00Z',
  },
];

// ─── Code Examples ────────────────────────────────────────────────────────────

const dynamicLoadingSnippet = `// Process definitions are loaded dynamically from the backend.
// No static PROCESS_DEFINITIONS array — definitions are module-specific.
//
// Endpoint: GET /api/v1/audit/processes?module={module}

const { data } = useQuery({
  queryKey: ['processes', module],
  queryFn: () =>
    fetch(\`/api/v1/audit/processes?module=\${module}\`)
      .then(res => res.json()),
});

// Then render the pipeline:
return (
  <ProcessPipeline
    definition={data.definition}
    events={data.events}
  />
);`;

const pendingActionSnippet = `<PendingAction
  label="Manager Approval Required"
  meta="This order exceeds the standard credit limit. Please review and approve."
  actionLabel="Approve Order"
  onAction={() => handleApprove(orderId)}
/>`;

// ─── Component ────────────────────────────────────────────────────────────────

export const ProcessShowcase = () => {
  return (
    <div>
      <PageHeader
        title="Process Transparency"
        badge="Audit & Workflow"
        description="Components to visualize business processes, audit trails, and required actions. Process definitions are loaded dynamically from the backend — there is no static registry."
      />

      {/* ── Process Pipeline ── */}
      <ShowcaseSection
        title="Process Pipeline"
        description="Displays a linear step-by-step process with status derived from recorded events. Each step is marked completed, active, or pending automatically."
      >
        <ShowcaseDemo title="Sales Order Fulfillment" subtitle="3 of 5 steps completed">
          <div style={{ width: '100%', padding: '20px' }}>
            <ProcessPipeline definition={dummyDefinition} events={dummyEvents} />
          </div>
        </ShowcaseDemo>

        <ShowcaseSection title="Dynamic Process Loading" description="Process definitions are NOT hard-coded. They are fetched per module from the API endpoint /api/v1/audit/processes?module={module} and passed directly to ProcessPipeline.">
          <CodeSnippet code={dynamicLoadingSnippet} />
        </ShowcaseSection>
      </ShowcaseSection>

      {/* ── Timeline ── */}
      <ShowcaseSection
        title="Timeline (Activity Stream)"
        description="Renders a chronological list of AuditEntry records. Ideal for showing the full history of an entity."
      >
        <ShowcaseDemo title="Order ORD-001 — Audit Trail">
          <div style={{ width: '100%', maxWidth: '620px', backgroundColor: 'var(--ui-gray-50)', padding: '20px', borderRadius: '8px' }}>
            <Timeline data={null} entries={dummyTimelineEntries} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Pending Action ── */}
      <ShowcaseSection
        title="Pending Action"
        description="A call-to-action block surfaced when a process step requires human intervention before it can proceed."
      >
        <ShowcaseDemo title="Approval Gate">
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <PendingAction
              label="Manager Approval Required"
              meta="This order exceeds the standard credit limit. Please review and approve."
              actionLabel="Approve Order"
              onAction={() => alert('Approved')}
            />
          </div>
        </ShowcaseDemo>
        <CodeSnippet code={pendingActionSnippet} />
      </ShowcaseSection>

      {/* ── Props Reference ── */}
      <ShowcaseSection title="ProcessPipeline — Props Reference">
        <PropsTable
          props={[
            { name: 'definition', type: 'ProcessDefinition', required: true, description: 'The process definition describing sequential steps. Fetched from /api/v1/audit/processes?module={module}.' },
            { name: 'events', type: 'ProcessEvent[]', required: true, description: 'Recorded process events used to determine the completion status of each step.' },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="PendingAction — Props Reference">
        <PropsTable
          props={[
            { name: 'label', type: 'string', required: true, description: 'The primary heading of the action block.' },
            { name: 'meta', type: 'string', description: 'Supporting description text shown beneath the label.' },
            { name: 'actionLabel', type: 'string', required: true, description: 'Label for the CTA button.' },
            { name: 'onAction', type: '() => void', required: true, description: 'Callback fired when the CTA button is clicked.' },
          ]}
        />
      </ShowcaseSection>
    </div>
  );
};
