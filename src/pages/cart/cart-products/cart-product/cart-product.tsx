import { Button, Card, Skeleton, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { AmountController } from './amount-controller/amount-controller';
import { CartProductType, useCart } from '../../../../components/hooks/useCart';
import { TrashBin } from '@gravity-ui/icons';
import { useState } from 'react';
import { RemovedProduct } from '../../../../components/removing-message/removing-message';
import { formatPrice } from '../../../../utilities/format-price';

export function CartProduct({ product }: { product: CartProductType }) {
  const { productsWithChangedAmount, removeFromCart, setRemovingProducts, cartPageData } = useCart();
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
      <div className={styles['part-wrapper']}>
        <div className={styles['product-part']}>
          <div className={`${styles.name} ${styles.line}`}>
            <Text className={`${styles.name} ${styles.line}`} variant="body-2">
              {product.name}
            </Text>
          </div>
          <Text className={styles.line} variant="body-2">
            <b>Unit price:</b>{' '}
            {cartPageData?.isDiscountApplied && product.fullPrice ? (
              <div>
                <div className={styles['discounted-price']}>${product.price}</div>{' '}
                <div className={styles['full-price']}>${formatPrice(product.fullPrice)}</div>{' '}
              </div>
            ) : (
              <div>${product.price}</div>
            )}
          </Text>
        </div>
        <div className={styles['product-part']}>
          <AmountController product={product} />
          <div className={styles.line}>
            <Text variant="body-2">
              <b>Total:</b>{' '}
            </Text>
            <div className={styles['total-wrapper']}>
              {productsWithChangedAmount[product.id] ? (
                <Skeleton className={styles.total} />
              ) : (
                <>
                  {cartPageData?.isDiscountApplied && product.fullPrice ? (
                    <div className={styles['total-prices']}>
                      <Text variant="body-2" className={styles['discounted-price']}>
                        ${product.totalPrice}
                      </Text>{' '}
                      <Text variant="body-2" className={styles['full-price']}>
                        ${formatPrice(product.fullProductPrice)}
                      </Text>{' '}
                    </div>
                  ) : (
                    <div>${product.totalPrice}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles['product-part']}>
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
        </div>
      </div>
    </Card>
  );
}
