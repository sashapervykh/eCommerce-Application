import { createContext, useContext, useState } from 'react';
import {
  addToCart,
  removeFromCart,
  getBasketItems,
  isProductInCart,
  BasketItem,
  getFullCartInfo,
  deleteCart,
  addPromoCodeCart,
  checkPromoCodeExistence,
  getPromoCodeByID,
  removePromoCodeByID,
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
  fullPrice?: number;
  images?: Image[];
  quantity: number;
  fullProductPrice?: number;
}
export interface CartPageDataType {
  id: string;
  version: number;
  code: string | undefined;
  codeId: string | undefined;
  isDiscountApplied: boolean;
  totalCartPrice: number;
  cartProducts: CartProductType[];
  fullCartPrice: number;
}

interface CartContextType {
  productsInCartAmount: number | undefined;
  updateProductsInCartAmount: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, quantity?: number) => Promise<void>;
  isProductInCart: (productId: string) => Promise<boolean>;
  getBasketItems: () => Promise<BasketItem[]>;
  removingProducts: RemovingType;
  setRemovingProducts: React.Dispatch<React.SetStateAction<RemovingType>>;
  productsWithChangedAmount: ChangingType;
  setProductsWithChangedAmount: React.Dispatch<React.SetStateAction<ChangingType>>;
  getCartPageData: () => Promise<void>;
  cartPageData: CartPageDataType | undefined;
  setCartPageData: React.Dispatch<React.SetStateAction<CartPageDataType | undefined>>;
  isCartPageLoading: boolean;
  isCartDeleting: boolean;
  clearCart: (id: string, version: number) => Promise<void>;
  addPromoCode: (cartId: string, version: number, key: string) => Promise<string | undefined>;
  removePromoCode: (cartId: string, version: number, codeId: string) => Promise<void>;
  isDiscountInProcess: boolean;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInCartAmount, setProductsInCartAmount] = useState<number | undefined>(undefined);
  const [removingProducts, setRemovingProducts] = useState<RemovingType>({});
  const [productsWithChangedAmount, setProductsWithChangedAmount] = useState<ChangingType>({});
  const [cartPageData, setCartPageData] = useState<CartPageDataType | undefined>(undefined);
  const [isCartPageLoading, setIsCartPageLoading] = useState(false);
  const [isCartDeleting, setIsCartDeleting] = useState(false);
  const [isDiscountInProcess, setIsDiscountInProcess] = useState(false);

  const getCartPageData = async () => {
    setIsCartPageLoading(true);
    try {
      const cart = await getFullCartInfo();
      if (!cart) throw new Error('Cart data is not received');
      console.log(cart);
      const isDiscountApplied = cart.discountCodes[0] ? true : false;
      let code: string | undefined;
      let id: string | undefined;
      if (isDiscountApplied) {
        code = await getPromoCodeByID(cart.discountCodes[0].discountCode.id);
        id = cart.discountCodes[0].discountCode.id;
      }
      let totalPriceBeforeDiscount = 0;

      setCartPageData({
        id: cart.id,
        version: cart.version,
        isDiscountApplied: isDiscountApplied,
        code: code,
        codeId: id,
        totalCartPrice: cart.totalPrice.centAmount,
        cartProducts: cart.lineItems.map((item) => {
          const discountedPrice = item.price.discounted?.value.centAmount;
          const promoPrice: number | undefined = item.discountedPricePerQuantity[0]?.discountedPrice.value.centAmount;
          const price = item.price.value.centAmount;
          let currentPrice: number | undefined;
          let fullPrice: number | undefined;

          if (promoPrice) {
            currentPrice = promoPrice;
            fullPrice = price;
          } else {
            currentPrice = discountedPrice ?? price;
            fullPrice = currentPrice === price ? undefined : price;
          }
          if (fullPrice) {
            totalPriceBeforeDiscount += fullPrice * item.quantity;
          } else {
            totalPriceBeforeDiscount += currentPrice * item.quantity;
          }

          return {
            quantity: item.quantity,
            name: item.name['en-US'],
            id: item.productId,
            price: formatPrice(currentPrice),
            fullPrice: fullPrice,
            images: item.variant.images,
            totalPrice: formatPrice(item.totalPrice.centAmount),
            fullProductPrice: fullPrice ? fullPrice * item.quantity : undefined,
          };
        }),
        fullCartPrice: totalPriceBeforeDiscount,
      });
      setIsCartPageLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setIsCartPageLoading(false);
    }
  };

  const updateProductsInCartAmount = async () => {
    const cart = await getBasketItems();
    setProductsInCartAmount(cart.length);
  };

  const addPromoCode = async (cartId: string, version: number, promo: string) => {
    const isPromoExist = await checkPromoCodeExistence(promo);
    if (isPromoExist) {
      setIsDiscountInProcess(true);
      await addPromoCodeCart(cartId, version, promo);
      await getCartPageData();
      setIsDiscountInProcess(false);
      return;
    } else if (isPromoExist === false) {
      setIsDiscountInProcess(false);
      return 'This code does not exist';
    } else {
      setIsDiscountInProcess(false);
      return 'The promo code was not applied. Please try again';
    }
  };

  const removePromoCode = async (cartId: string, version: number, codeId: string) => {
    setIsDiscountInProcess(true);
    await removePromoCodeByID(cartId, version, codeId);
    await getCartPageData();
    setIsDiscountInProcess(false);
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

  const clearCart = async (cartId: string, version: number) => {
    try {
      setIsCartDeleting(true);
      await deleteCart(cartId, version);

      await getCartPageData();
      setIsCartDeleting(false);
    } catch (error) {
      console.error('Error while deleting the cart:', error);
    }
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
    productsWithChangedAmount,
    setProductsWithChangedAmount,
    getCartPageData,
    cartPageData,
    setCartPageData,
    isCartPageLoading,
    isCartDeleting,
    clearCart,
    addPromoCode,
    removePromoCode,
    isDiscountInProcess,
  };

  return <CartContext.Provider value={CartContextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
