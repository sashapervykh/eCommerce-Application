import { createContext, useContext, useState } from 'react';
import {
  addToCart,
  removeFromCart,
  getBasketItems,
  isProductInCart,
  BasketItem,
  getFullCartInfo,
} from '../../utilities/return-basket-items';
import { formatPrice } from '../../utilities/format-price';
import { Image } from '@commercetools/platform-sdk';

type RemovingType = Record<string, boolean>;
type ChangingType = Record<string, boolean | number>;
export interface CartProductType {
  id: string;
  name: string;
  price: string;
  totalPrice: string;
  fullPrice?: string;
  images?: Image[];
  quantity: number;
}
export interface CartPageDataType {
  totalCartPrice: number;
  cartProducts: CartProductType[];
}

interface CartContextType {
  productsInCartAmount: number | undefined;
  updateProductsInCartAmount: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, quantity?: number) => Promise<void>;
  isProductInCart: (productId: string) => Promise<boolean>;
  getBasketItems: () => Promise<BasketItem[]>;
  getTotalPrice: () => Promise<number | undefined>;
  removingProducts: RemovingType;
  setRemovingProducts: React.Dispatch<React.SetStateAction<RemovingType>>;
  productsWithChangedAmount: ChangingType;
  setProductsWithChangedAmount: React.Dispatch<React.SetStateAction<ChangingType>>;
  getCartPageData: () => Promise<void>;
  cartPageData: CartPageDataType | undefined;
  setCartPageData: React.Dispatch<React.SetStateAction<CartPageDataType | undefined>>;
  isCartPageLoading: boolean;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInCartAmount, setProductsInCartAmount] = useState<number | undefined>(undefined);
  const [removingProducts, setRemovingProducts] = useState<RemovingType>({});
  const [productsWithChangedAmount, setProductsWithChangedAmount] = useState<ChangingType>({});
  const [cartPageData, setCartPageData] = useState<CartPageDataType | undefined>(undefined);
  const [isCartPageLoading, setIsCartPageLoading] = useState(false);

  const getCartPageData = async () => {
    setIsCartPageLoading(true);
    try {
      const cart = await getFullCartInfo();
      if (!cart) throw new Error('Cart data is not received');
      setCartPageData({
        totalCartPrice: cart.totalPrice.centAmount,
        cartProducts: cart.lineItems.map((item) => {
          const discountedPrice = item.price.discounted?.value.centAmount;
          const price = item.price.value.centAmount;
          let currentPrice: number | undefined;
          let fullPrice: number | undefined;

          if (discountedPrice) {
            currentPrice = discountedPrice;
            fullPrice = price;
          } else {
            currentPrice = price;
          }
          return {
            quantity: item.quantity,
            name: item.name['en-US'],
            id: item.productId,
            price: formatPrice(currentPrice),
            fullPrice: formatPrice(fullPrice),
            images: item.variant.images,
            totalPrice: formatPrice(item.totalPrice.centAmount),
          };
        }),
      });
      setIsCartPageLoading(false);
    } catch (error) {
      console.log('Error fetching cart data:', error);
      setIsCartPageLoading(false);
    }
  };

  const getTotalPrice = async () => {
    const cart = await getFullCartInfo();
    if (!cart) return;
    return cart.totalPrice.centAmount;
  };

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
    getTotalPrice,
    updateProductsInCartAmount: updateProductsInCartAmount,
    productsInCartAmount: productsInCartAmount,
    removingProducts,
    setRemovingProducts,
    productsWithChangedAmount,
    setProductsWithChangedAmount,
    getCartPageData,
    cartPageData,
    setCartPageData,
    isCartPageLoading,
  };

  return <CartContext.Provider value={CartContextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
