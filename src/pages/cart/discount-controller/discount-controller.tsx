import { Button, TextInput } from '@gravity-ui/uikit';
import styles from './styles.module.css';

export function DiscountController() {
  return (
    <div className={styles['discount-wrapper']}>
      <Button view="action">Apply</Button>
      <TextInput placeholder="Enter the promo code" />
    </div>
  );
}
