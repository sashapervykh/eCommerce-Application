import { Card, Text } from '@gravity-ui/uikit';
import { CartItemType } from '../../../components/hooks/useProducts';
import styles from './styles.module.css';

export function CartProduct({ product }: { product: CartItemType }) {
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
        <Text className={styles.line} variant="body-2">
          <b>Amount:</b> {product.quantity}
        </Text>
        <Text className={styles.line} variant="body-2">
          <b>Price:</b> ${product.price}
        </Text>
      </div>
    </Card>
  );
}
