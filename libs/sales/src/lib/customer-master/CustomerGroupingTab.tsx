import React from 'react';
import {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Button
} from '@bes/shared-ui';
import styles from './customer-master.module.css';

export const CustomerGroupingTab: React.FC = () => {
  const groups = [
    { id: '1', name: 'Wholesale Accounts', code: 'WHOLESALE', customerCount: 14 },
    { id: '2', name: 'Retail Customers', code: 'RETAIL', customerCount: 42 },
    { id: '3', name: 'Key Accounts (Enterprise)', code: 'ENTERPRISE', customerCount: 5 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-lg)' }}>
      <div className={styles.searchBar}>
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Customer Groups</h3>
        <Button variant="secondary">+ Create Group</Button>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Group Name</TH>
            <TH>Group Code</TH>
            <TH style={{ textAlign: 'right' }}>Active Customers</TH>
          </TR>
        </THead>
        <TBody>
          {groups.map((g) => (
            <TR key={g.id}>
              <TD style={{ fontWeight: 'var(--ui-weight-semibold)' }}>{g.name}</TD>
              <TD><code>{g.code}</code></TD>
              <TD style={{ textAlign: 'right' }}>{g.customerCount}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
};
