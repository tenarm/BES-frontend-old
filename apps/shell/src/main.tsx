import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { initFinanceModule } from '@bes/finance';
import { initSalesModule } from '@bes/sales';
import { initInventoryModule } from '@bes/inventory';
import { initHrModule } from '@bes/hr';
import { initSupplyChainModule } from '@bes/supply-chain';
import { initSettingsModule } from '@bes/settings';

// Initialize modules
initFinanceModule();
initSalesModule();
initInventoryModule();
initHrModule();
initSupplyChainModule();
initSettingsModule();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
