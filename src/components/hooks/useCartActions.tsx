import { useState, useEffect } from 'react';

import { useCart } from '../../components/hooks/useCart';

export function useCartActions(productId: string) {
  const { addToCart, isProductInCart, removeFromCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [isCartCheckLoading, setIsCartCheckLoading] = useState(true);

  useEffect(() => {
    const checkCart = async () => {
      setIsCartCheckLoading(true);
      try {
        const inCart = await isProductInCart(productId);
        setIsInCart(inCart);
      } catch (error) {
        console.error('Error checking cart status:', error);
      } finally {
        setIsCartCheckLoading(false);
      }
    };
    void checkCart();
  }, [productId, isProductInCart]);

  const handleAddToCart = async () => {
    await addToCart(productId);
    setIsInCart(true);
  };

  const handleRemoveFromCart = async () => {
    await removeFromCart(productId);
    setIsInCart(false);
  };

  return { isInCart, handleAddToCart, handleRemoveFromCart, isCartCheckLoading };
}
