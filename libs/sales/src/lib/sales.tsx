import styles from './sales.module.css';
import { SharedUi } from '@bes/shared-ui';



export function Sales() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Sales!</h1>
      <SharedUi />
    </div>
  );
}

export default Sales;
