import { Skeleton, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';

export function TotalValue({ totalPrice, allProductsShown }: { totalPrice: string; allProductsShown: boolean }) {
  return (
    <div className={styles['total-value-wrapper']}>
      <div className={styles['text-wrapper']}>
        <Text variant="subheader-3">Total order price:</Text>
        {allProductsShown ? (
          <Text variant="subheader-3" className={styles['total-price']}>
            ${totalPrice}
          </Text>
        ) : (
          <Skeleton className={styles.skeleton} />
        )}
      </div>
    </div>
  );
}
