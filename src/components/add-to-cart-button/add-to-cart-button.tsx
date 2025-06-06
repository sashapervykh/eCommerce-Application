import { Button, useToaster } from '@gravity-ui/uikit';
import { ShoppingCart } from '@gravity-ui/icons';
import { useCartActions } from '../hooks/useCartActions';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import { useState } from 'react';
import styles from './styles.module.css';

interface AddToCartButtonProps {
  product: ProductInfo;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { isInCart, handleAddToCart, handleRemoveFromCart } = useCartActions(product.id);
  const [isLoading, setIsLoading] = useState(false);
  const toaster = useToaster();

  const handleAdd = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isInCart ? (
        <Button
          view="outlined"
          size="l"
          onClick={handleRemove}
          className={className ?? styles['add-to-cart-button']}
          loading={isLoading}
        >
          Remove from Cart
        </Button>
      ) : (
        <Button
          view="action"
          size="l"
          onClick={handleAdd}
          disabled={isInCart}
          className={className ?? styles['add-to-cart-button']}
          loading={isLoading}
        >
          Add to Cart
          <ShoppingCart width={20} height={20} />
        </Button>
      )}
    </>
  );
}
