import styles from './shared-ui.module.css';

export function SharedUi() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to SharedUi!</h1>
    </div>
  );
}

export * from './rbac';
export * from './layout/layout';
export default SharedUi;
