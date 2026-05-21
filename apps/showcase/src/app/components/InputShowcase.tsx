import React, { useState } from 'react';
import { Input, Button } from '@bes/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable, PageHeader, CodeSnippet } from './ShowcaseSection';

export const InputShowcase = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader
        title="Input"
        description="The Input component is the foundation for all form data entry. It supports labels, helper text, error states, icons, and full accessibility."
        badge="Shared UI"
      />

      <ShowcaseSection title="Basic Inputs" description="Standard text inputs with labels and helper text.">
        <ShowcaseDemo title="With label and helper text">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '440px' }}>
            <Input label="Company Name" placeholder="e.g. Acme Corporation" helperText="This will appear on all invoices and reports." />
            <Input label="Tax Identification Number" placeholder="e.g. 27AAPFU0939F1ZV" />
            <Input label="Email Address" type="email" placeholder="user@company.com" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="States" description="Inputs reflect validation, error, and disabled states.">
        <ShowcaseDemo title="Validation states">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '440px' }}>
            <Input label="Invoice Number" value="INV-0042" helperText="Automatically generated from your sequence settings." readOnly />
            <Input
              label="Amount (USD)"
              type="number"
              placeholder="0.00"
              error="Amount cannot be negative."
            />
            <Input label="Approval Code" placeholder="Enter code" disabled helperText="Requires Finance Manager role." />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Interactive Search">
        <ShowcaseDemo title="Live filter example">
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <Input
              label="Search Ledger Entries"
              placeholder="Filter by description, account, or amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              helperText={search ? `Filtering for: "${search}"` : 'Type to filter the ledger.'}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Usage">
        <CodeSnippet code={`import { Input } from '@bes/shared-ui';

// Basic
<Input label="Company Name" placeholder="Acme Corp" />

// With error
<Input label="Amount" error="Value cannot be negative." />

// Disabled
<Input label="Approval Code" disabled />`} />
      </ShowcaseSection>

      <ShowcaseSection title="Props Reference">
        <PropsTable props={[
          { name: 'label', type: 'string', description: 'Label displayed above the input field.' },
          { name: 'helperText', type: 'string', description: 'Subtext below the input; overridden by error.' },
          { name: 'error', type: 'string', description: 'Error message displayed in red. Sets aria-invalid.' },
          { name: 'placeholder', type: 'string', description: 'Placeholder text when the input is empty.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input field.' },
          { name: 'readOnly', type: 'boolean', default: 'false', description: 'Makes the field read-only.' },
        ]} />
      </ShowcaseSection>
    </div>
  );
};
