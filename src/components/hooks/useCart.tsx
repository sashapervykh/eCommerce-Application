import { createContext, useContext } from 'react';
import {
  addToCart,
  getBasketItems,
  isProductInCart,
  removeFromCart,
  BasketItem,
} from '../../utilities/return-basket-items';

interface CartContextType {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  isProductInCart: (productId: string) => Promise<boolean>;
  getBasketItems: () => Promise<BasketItem[]>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const addProductToCart = async (productId: string, quantity = 1) => {
    await addToCart(productId, quantity);
  };

  const removeProductFromCart = async (productId: string) => {
    await removeFromCart(productId);
  };

  const checkProductInCart = async (productId: string) => {
    return await isProductInCart(productId);
  };

  const fetchBasketItems = async () => {
    return await getBasketItems();
  };

  const CartContextValue = {
    addToCart: addProductToCart,
    removeFromCart: removeProductFromCart,
    isProductInCart: checkProductInCart,
    getBasketItems: fetchBasketItems,
  };

  return <CartContext.Provider value={CartContextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
