import { useState, useEffect } from 'react';

import { useCart } from '../../components/hooks/useCart';

export function useCartActions(productId: string) {
  const { addToCart, isProductInCart, removeFromCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const checkCart = async () => {
      const inCart = await isProductInCart(productId);
      setIsInCart(inCart);
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

  return { isInCart, handleAddToCart, handleRemoveFromCart };
}
