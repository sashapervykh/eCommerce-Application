import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';

export function useCartActions(productId: string) {
  const { addToCart, isProductInCart, removeFromCart, cartItems } = useProducts();
  const [isInCart, setIsInCart] = useState(isProductInCart(productId));

  useEffect(() => {
    setIsInCart(isProductInCart(productId));
  }, [cartItems, productId, isProductInCart]);

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
