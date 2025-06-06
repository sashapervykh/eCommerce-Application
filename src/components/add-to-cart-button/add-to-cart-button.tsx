import { Button, useToaster } from '@gravity-ui/uikit';
import { ShoppingCart } from '@gravity-ui/icons';
import { useCartActions } from '../hooks/useCartActions';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import styles from './styles.module.css';

interface AddToCartButtonProps {
  product: ProductInfo;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { isInCart, handleAddToCart, handleRemoveFromCart } = useCartActions(product.id);
  const toaster = useToaster();

  const handleAdd = async () => {
    try {
      await handleAddToCart();
      toaster.add({
        name: 'cart-success',
        content: 'Product added to cart!',
        theme: 'success',
      });
    } catch (_error) {
      toaster.add({
        name: 'cart-error',
        content: 'Failed to add product to cart.',
        theme: 'info',
      });
    }
  };

  const handleRemove = async () => {
    try {
      await handleRemoveFromCart();
      toaster.add({
        name: 'cart-remove-success',
        content: 'Product removed from cart!',
        theme: 'info',
      });
    } catch (_error) {
      toaster.add({
        name: 'cart-remove-error',
        content: 'Failed to remove product from cart.',
        theme: 'info',
      });
    }
  };

  return (
    <>
      {isInCart ? (
        <Button view="outlined" size="l" onClick={handleRemove} className={className ?? styles['add-to-cart-button']}>
          Remove from Cart
        </Button>
      ) : (
        <Button
          view="action"
          size="l"
          onClick={handleAdd}
          disabled={isInCart}
          className={className ?? styles['add-to-cart-button']}
        >
          Add to Cart
          <ShoppingCart width={20} height={20} />
        </Button>
      )}
    </>
  );
}
