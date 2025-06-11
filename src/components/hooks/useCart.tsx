import { createContext, useContext, useState } from 'react';
import {
  addToCart,
  removeFromCart,
  getBasketItems,
  isProductInCart,
  BasketItem,
} from '../../utilities/return-basket-items';

type ChangingType = Record<string, boolean>;

interface CartContextType {
  productsInCartAmount: number | undefined;
  updateProductsInCartAmount: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, quantity?: number) => Promise<void>;
  isProductInCart: (productId: string) => Promise<boolean>;
  getBasketItems: () => Promise<BasketItem[]>;
  removingProducts: ChangingType;
  setRemovingProducts: React.Dispatch<React.SetStateAction<ChangingType>>;
  isAmountChanging: ChangingType;
  setIsAmountChanging: React.Dispatch<React.SetStateAction<ChangingType>>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInCartAmount, setProductsInCartAmount] = useState<number | undefined>(undefined);
  const [removingProducts, setRemovingProducts] = useState<ChangingType>({});
  const [isAmountChanging, setIsAmountChanging] = useState<ChangingType>({});

  const updateProductsInCartAmount = async () => {
    const cart = await getBasketItems();
    setProductsInCartAmount(cart.length);
  };

  const addProductToCart = async (productId: string, quantity = 1) => {
    await addToCart(productId, quantity);
    await updateProductsInCartAmount();
  };

  const removeProductFromCart = async (productId: string, quantity?: number) => {
    await removeFromCart(productId, quantity);
    await updateProductsInCartAmount();
  };

  const checkProductInCart = async (productId: string) => {
    return await isProductInCart(productId);
  };

  const CartContextValue = {
    addToCart: addProductToCart,
    removeFromCart: removeProductFromCart,
    isProductInCart: checkProductInCart,
    getBasketItems: getBasketItems,
    updateProductsInCartAmount: updateProductsInCartAmount,
    productsInCartAmount: productsInCartAmount,
    removingProducts,
    setRemovingProducts,
    isAmountChanging,
    setIsAmountChanging,
  };

  return <CartContext.Provider value={CartContextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
