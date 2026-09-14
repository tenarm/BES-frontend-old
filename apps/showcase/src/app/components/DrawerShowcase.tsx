import React, { useState } from 'react';
import { Drawer, Button, Input, Badge } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const DrawerShowcase = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Drawer"
        description="Drawers slide in from the right edge of the screen, providing a focused context for forms, details, or filters without replacing the current view."
        badge="Shared UI"
      />

      <ShowcaseSection title="Basic Drawer" description="A simple drawer with a title and footer actions.">
        <ShowcaseDemo title="Open / Close">
          <Button onClick={() => setIsBasicOpen(true)}>Open Basic Drawer</Button>
        </ShowcaseDemo>

        <Drawer
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="View Transaction Details"
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsBasicOpen(false)}>Close</Button>
              <Button variant="primary" onClick={() => setIsBasicOpen(false)}>Post Entry</Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--ui-gray-700)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ui-gray-100)' }}>
              <span>Transaction ID</span><strong>TXN-00492</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ui-gray-100)' }}>
              <span>Module</span><strong>Finance / GL</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ui-gray-100)' }}>
              <span>Amount</span><strong>$24,500.00</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ui-gray-100)' }}>
              <span>Status</span><Badge variant="warning">Pending Approval</Badge>
            </div>
            <div style={{ padding: '10px 0' }}>
              <div style={{ marginBottom: '4px' }}>Notes</div>
              <p style={{ margin: 0, color: 'var(--ui-gray-500)', lineHeight: 1.6 }}>
                Quarterly cost center reconciliation for the Engineering department. All line items verified against purchase orders.
              </p>
            </div>
          </div>
        </Drawer>
      </ShowcaseSection>

      <ShowcaseSection title="Form Drawer" description="Drawers are ideal for inline form editing without navigating away.">
        <ShowcaseDemo title="Edit Vendor Details">
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>Edit Vendor</Button>
        </ShowcaseDemo>

        <Drawer
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Edit Vendor Details"
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setIsFormOpen(false)}>Save Changes</Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Vendor Name" defaultValue="Acme Supplies Ltd." />
            <Input label="Email" defaultValue="billing@acme.com" type="email" />
            <Input label="Tax ID" defaultValue="27AAPFU0939F1ZV" />
            <Input label="Payment Terms" defaultValue="Net 30" />
          </div>
        </Drawer>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Drawer, Button } from '@bes/shared-ui';

const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open</Button>

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Record"
  footer={<Button onClick={() => setIsOpen(false)}>Save</Button>}
>
  <p>Drawer content goes here.</p>
</Drawer>`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'isOpen', type: 'boolean', required: true, description: 'Controls whether the drawer is visible.' },
          { name: 'onClose', type: '() => void', required: true, description: 'Callback called when the drawer requests to close.' },
          { name: 'title', type: 'string', description: 'Title displayed in the drawer header.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Main scrollable content of the drawer.' },
          { name: 'footer', type: 'ReactNode', description: 'Sticky footer for actions (e.g., Save, Cancel).' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
