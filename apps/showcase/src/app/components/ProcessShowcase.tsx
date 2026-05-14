import React from 'react';
import { Timeline, ProcessPipeline, PendingAction } from '@erp/shared-ui';
import type { ProcessDefinition, ProcessEvent, AuditEntry } from '@erp/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

const dummyDefinition: ProcessDefinition = {
  processId: 'sales_order',
  label: 'Sales Order Fulfillment',
  entity: 'order',
  steps: [
    { id: 'draft', label: 'Draft', type: 'direct', statusEvent: 'draft.completed' },
    { id: 'payment', label: 'Payment', type: 'sequence', dependsOn: ['draft'], statusEvent: 'payment.completed' },
    { id: 'fulfillment', label: 'Fulfillment', type: 'sequence', dependsOn: ['payment'], statusEvent: 'fulfillment.active' },
    { id: 'shipping', label: 'Shipping', type: 'sequence', dependsOn: ['fulfillment'], statusEvent: 'shipping.shipped' },
    { id: 'delivered', label: 'Delivered', type: 'sequence', dependsOn: ['shipping'], statusEvent: 'order.delivered' }
  ]
};

const dummyEvents: ProcessEvent[] = [
  { eventKey: 'draft.completed', occurredAt: '2026-05-10T10:00:00Z', actor: 'System', actorType: 'system' },
  { eventKey: 'payment.completed', occurredAt: '2026-05-10T11:30:00Z', actor: 'John Doe', actorType: 'user' },
  { eventKey: 'fulfillment.active', occurredAt: '2026-05-11T09:00:00Z', actor: 'Warehouse Bot', actorType: 'system' }
];

const dummyTimelineEntries: AuditEntry[] = [
  { id: '1', event_id: 'ev1', parent_audit_id: null, correlation_id: 'corr1', changes: {}, action: 'CREATE', module: 'Sales', description: 'System generated the order.', actor_type: 'system', actor_id: 'sys1', actor_name: 'System', entity_type: 'order', entity_id: 'ORD-001', created_at: '2026-05-10T10:00:00Z' },
  { id: '2', event_id: 'ev2', parent_audit_id: null, correlation_id: 'corr1', changes: {}, action: 'UPDATE', module: 'Finance', description: 'Credit card payment approved.', actor_type: 'user', actor_id: 'u1', actor_name: 'John Doe', entity_type: 'order', entity_id: 'ORD-001', created_at: '2026-05-10T11:30:00Z' },
  { id: '3', event_id: 'ev3', parent_audit_id: null, correlation_id: 'corr1', changes: {}, action: 'UPDATE', module: 'Inventory', description: 'Inventory reserved for order.', actor_type: 'system', actor_id: 'sys2', actor_name: 'Warehouse Bot', entity_type: 'order', entity_id: 'ORD-001', created_at: '2026-05-11T09:00:00Z' },
];

export const ProcessShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Process Transparency</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Components to visualize business processes, audit trails, and required actions.
      </p>

      <ShowcaseSection title="Process Pipeline">
        <ShowcaseDemo>
          <div style={{ width: '100%', padding: '20px' }}>
            <ProcessPipeline definition={dummyDefinition} events={dummyEvents} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Timeline (Activity Stream)">
        <ShowcaseDemo>
          <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--ui-gray-50)', padding: '20px', borderRadius: '8px' }}>
            <Timeline data={null} entries={dummyTimelineEntries} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Pending Action">
        <ShowcaseDemo>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <PendingAction 
              label="Manager Approval Required" 
              meta="This order exceeds the standard credit limit. Please review and approve."
              actionLabel="Approve Order"
              onAction={() => alert('Approved')}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Process Pipeline Props">
        <PropsTable props={[
          { name: 'definition', type: 'ProcessDefinition', description: 'The sequential steps in the process pipeline.' },
          { name: 'events', type: 'ProcessEvent[]', description: 'The events to determine step status.' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
