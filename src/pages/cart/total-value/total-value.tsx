import { Skeleton, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { useCart } from '../../../components/hooks/useCart';
import { formatPrice } from '../../../utilities/format-price';

export function TotalValue({ allProductsShown }: { allProductsShown: boolean }) {
  const { cartPageData } = useCart();
  return (
    <div className={styles['total-value-wrapper']}>
      <div className={styles['text-wrapper']}>
        <Text variant="subheader-3">Total order price:</Text>
        {allProductsShown ? (
          <>
            {' '}
            {cartPageData?.isDiscountApplied ? (
              <div>
                <Text variant="subheader-3" className={styles['discounted-price']}>
                  ${formatPrice(cartPageData.totalCartPrice)}
                </Text>
                <Text variant="subheader-3" className={styles['full-price']}>
                  ${formatPrice(cartPageData.fullCartPrice)}
                </Text>
              </div>
            ) : (
              <Text variant="subheader-3" className={styles['total-price']}>
                ${formatPrice(cartPageData?.totalCartPrice)}
              </Text>
            )}
          </>
        ) : (
          <Skeleton className={styles.skeleton} />
        )}
      </div>
    </div>
  );
}
