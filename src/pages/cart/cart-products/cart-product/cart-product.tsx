import { Card, Skeleton, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { CartItemType } from '../../../../components/hooks/useProducts';
import { AmountController } from './amount-controller/amount-controller';
import { useCart } from '../../../../components/hooks/useCart';

export function CartProduct({ product }: { product: CartItemType }) {
  const { productsWithChangedAmount } = useCart();

  return (
    <Card key={product.id} className={styles['product-wrapper']}>
      <img className={styles.image} src={product.images?.[0].url ?? ''}></img>
      <div className={styles['product-part']}>
        <Text className={`${styles.name} ${styles.line}`} variant="body-2">
          {product.name}
        </Text>
        <Text className={styles.line} variant="body-2">
          <b>Unit price:</b> ${product.price}
        </Text>
      </div>
      <div className={styles['product-part']}>
        <AmountController product={product} />
        <Text className={styles.line} variant="body-2">
          <b>Total:</b>{' '}
          <div className={styles.total}>
            {productsWithChangedAmount[product.id] ? (
              <Skeleton className={styles.total} />
            ) : (
              <> ${product.totalPrice}</>
            )}
          </div>
        </Text>
      </div>
    </Card>
  );
}
