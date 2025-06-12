import { Button, Card, Skeleton, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { CartItemType } from '../../../../components/hooks/useProducts';
import { AmountController } from './amount-controller/amount-controller';
import { useCart } from '../../../../components/hooks/useCart';
import { TrashBin } from '@gravity-ui/icons';
import { useState } from 'react';
import { RemovedProduct } from '../../../../components/removing-message/removing-message';

export function CartProduct({ product }: { product: CartItemType }) {
  const { productsWithChangedAmount, removeFromCart, setRemovingProducts } = useCart();
  const { getCartPageData } = useCart();

  const { removingProducts } = useCart();
  const [isRemoving, setIsRemoving] = useState<boolean | undefined>(removingProducts[product.id]);

  const handleRemoveClick = async () => {
    setIsRemoving(true);
    setRemovingProducts((previous) => {
      previous[product.id] = true;
      return previous;
    });

    await removeFromCart(product.id);
    await getCartPageData();
  };

  return (
    <Card key={product.id} className={styles['product-wrapper']}>
      {isRemoving && <RemovedProduct />}
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
      <Button
        view="action"
        className={styles['remove-button']}
        onClick={async () => {
          await handleRemoveClick();
        }}
      >
        <div className={styles['remove-container']}>
          <div>Remove</div> <TrashBin className={styles['remove-icon']} />
        </div>
      </Button>
    </Card>
  );
}
