import styles from './styles.module.css';
import { Text } from '@gravity-ui/uikit';

export function RemovedProduct() {
  return (
    <div className={styles['removing-wrapper']}>
      <Text className={styles['removing-message']} variant="body-3">
        Removing from cart...
      </Text>
    </div>
  );
}
