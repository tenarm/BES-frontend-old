import styles from './sales.module.css';
import { Finance } from '@bes/finance';
import { SharedUi } from '@bes/shared-ui';



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
