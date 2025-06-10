import { Button } from '@gravity-ui/uikit';
import { CircleMinus, CirclePlus } from '@gravity-ui/icons';
import { CartItemType } from '../../../../../components/hooks/useProducts';
import styles from './styles.module.css';

export function AmountController({ product }: { product: CartItemType }) {
  return (
    <form className={styles['amount-form']}>
      <Button className={styles['amount-button']} view="flat">
        <CircleMinus className={styles.icon} />
      </Button>
      <label className={styles['amount-label']}>
        <input className={styles['amount-input']} value={product.quantity.toString()}></input>
      </label>
      <Button className={styles['amount-button']} view="flat">
        <CirclePlus className={styles.icon} />
      </Button>
    </form>
  );
}
