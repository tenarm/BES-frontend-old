import styles from './sales.module.css';
import { Finance } from '@erp/finance';
import { SharedUi } from '@erp/shared-ui';



export function Sales() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Sales!</h1>
      <SharedUi />
      <Finance />
    </div>
  );
}

export default Sales;
