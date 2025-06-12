import { Card, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { CartProducts } from './cart-products/cart-products';

export function CartPage() {
  return (
    <>
      <Card className={styles['cart-content']}>
        <Text className={styles['cart-title']} variant="subheader-3">
          Your order
        </Text>
        <CartProducts />
      </Card>
    </>
  );
}
