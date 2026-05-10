import { ChartOfAccounts } from './coa/coa-tree';

export function FinanceRoutes() {
  return (
    <div style={{ padding: 'var(--ui-spacing-xl)', textAlign: 'center', color: 'var(--ui-gray-400)', border: '1px dashed var(--ui-gray-200)', borderRadius: 'var(--ui-radius-lg)', margin: 'var(--ui-spacing-lg)' }}>
      <h3 style={{ color: 'var(--ui-gray-600)' }}>Finance Dashboard</h3>
      <p>Financial overview, KPIs, and reports will be displayed here.</p>
    </div>
  );
}
