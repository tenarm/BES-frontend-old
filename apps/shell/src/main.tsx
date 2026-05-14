import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { initFinanceModule } from '@bes/finance';
import { initSalesModule } from '@bes/sales';

// Initialize modules
initFinanceModule();
initSalesModule();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
