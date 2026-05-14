import React from 'react';
import { Table, THead, TBody, TR, TH, TD, Badge } from '@erp/shared-ui';
import { ShowcaseSection, ShowcaseDemo, PropsTable } from './ShowcaseSection';

export const TableShowcase = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ui-gray-900)', marginBottom: '16px' }}>Table</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--ui-gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
        Tables display data in a structured, easy-to-read format.
      </p>

      <ShowcaseSection title="Basic Table">
        <ShowcaseDemo>
          <div style={{ width: '100%' }}>
            <Table>
              <THead>
                <TR>
                  <TH>Invoice</TH>
                  <TH>Status</TH>
                  <TH>Method</TH>
                  <TH style={{ textAlign: 'right' }}>Amount</TH>
                </TR>
              </THead>
              <TBody>
                <TR>
                  <TD>INV001</TD>
                  <TD><Badge variant="success">Paid</Badge></TD>
                  <TD>Credit Card</TD>
                  <TD style={{ textAlign: 'right' }}>$250.00</TD>
                </TR>
                <TR>
                  <TD>INV002</TD>
                  <TD><Badge variant="warning">Pending</Badge></TD>
                  <TD>PayPal</TD>
                  <TD style={{ textAlign: 'right' }}>$150.00</TD>
                </TR>
                <TR>
                  <TD>INV003</TD>
                  <TD><Badge variant="error">Unpaid</Badge></TD>
                  <TD>Bank Transfer</TD>
                  <TD style={{ textAlign: 'right' }}>$350.00</TD>
                </TR>
              </TBody>
            </Table>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection title="Components Reference">
        <p style={{ color: 'var(--ui-gray-600)', marginBottom: '16px' }}>
          The table is composed of several sub-components that map directly to HTML table elements: <code>&lt;Table&gt;</code>, <code>&lt;THead&gt;</code>, <code>&lt;TBody&gt;</code>, <code>&lt;TR&gt;</code>, <code>&lt;TH&gt;</code>, <code>&lt;TD&gt;</code>.
        </p>
        <PropsTable props={[
          { name: 'className', type: 'string', description: 'Standard HTML class name.' },
          { name: 'onClick (TR only)', type: '() => void', description: 'Makes the row clickable.' },
          { name: 'style (TH, TD)', type: 'CSSProperties', description: 'Inline styles (e.g., for text alignment).' }
        ]} />
      </ShowcaseSection>
    </div>
  );
};
