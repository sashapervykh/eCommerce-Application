import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  addToCart,
  removeFromCart,
  getBasketItems,
  isProductInCart,
  BasketItem,
} from '../../utilities/return-basket-items';

interface CartContextType {
  productsInCartAmount: number | undefined;
  updateProductsInCartAmount: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  isProductInCart: (productId: string) => Promise<boolean>;
  getBasketItems: () => Promise<BasketItem[]>;
  fetchCartItems: () => Promise<void>;
  cartItems: BasketItem[];
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInCartAmount, setProductsInCartAmount] = useState<number | undefined>(undefined);

  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<BasketItem[]>([]);

  const fetchCartItems = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const items = await getBasketItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCartItems();
  }, [fetchCartItems]);

  const updateProductsInCartAmount = async () => {
    const cart = await getBasketItems();
    setProductsInCartAmount(cart.length);
  };

  const addProductToCart = async (productId: string, quantity = 1) => {
    await addToCart(productId, quantity);
    await updateProductsInCartAmount();
  };

  const removeProductFromCart = async (productId: string) => {
    await removeFromCart(productId);
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
    fetchCartItems: fetchCartItems,
    isCartLoading,
    cartItems,
  };

  return <CartContext.Provider value={CartContextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
