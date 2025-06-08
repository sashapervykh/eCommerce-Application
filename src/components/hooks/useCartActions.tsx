import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { isProductInCart } from '../../utilities/return-basket-items';

export function useCartActions(productId: string) {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    async function checkIsInCart() {
      try {
        const inCart = await isProductInCart(productId);
        setIsInCart(inCart);
      } catch (error) {
        console.error('Error checking if product is in cart:', error);
        setIsInCart(false);
      }
    }
    void checkIsInCart();
  }, [cartItems, productId]);

  const handleAddToCart = async () => {
    await addToCart(productId);
    setIsInCart(true);
  };

  const handleRemoveFromCart = async () => {
    await removeFromCart(productId);
    setIsInCart(false);
  };

  return { isInCart, handleAddToCart, handleRemoveFromCart };
}
