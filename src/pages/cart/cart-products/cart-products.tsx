import { useEffect, useState } from 'react';
import { CartItemType, useProducts } from '../../../components/hooks/useProducts';
import { Skeleton, Spin, Text } from '@gravity-ui/uikit';
import { useCart } from '../../../components/hooks/useCart';
import styles from './styles.module.css';
import { CartProduct } from './cart-product/cart-product';

export function CartProducts() {
  const { productsInCartAmount, removingProducts, setRemovingProducts } = useCart();
  const { cartItems, fetchCartItems, getProductByID, isCartLoading } = useProducts();
  const [cartProductsData, setCartProductsData] = useState<CartItemType[] | undefined>();

  useEffect(() => {
    void fetchCartItems();
  }, []);

  useEffect(() => {
    const result: CartItemType[] = [];
    const removingInProcess = Object.values(removingProducts).some(Boolean);

    if (cartItems.length === 0) return;
    if (!removingInProcess) setCartProductsData([]);

    const fetchAllProducts = async () => {
      for (const item of cartItems) {
        const productData = await getProductByID(item);
        if (!productData) continue;
        if (!removingInProcess) {
          setCartProductsData((previous) => {
            if (!previous) return [productData];
            const isIncluded = previous.find((product) => product.id === productData.id);
            return isIncluded ? previous : [...previous, productData];
          });
        }
        if (removingInProcess) {
          result.push(productData);
          console.log('isRemoving');
        }
      }
      if (removingInProcess) {
        setCartProductsData(result);
        Object.keys(removingProducts)
          .filter((key) => !result.find((element) => element.id === key))
          .forEach((key) => {
            removingProducts[key] = false;
            setRemovingProducts(removingProducts);
          });
      }
    };

    void fetchAllProducts();
  }, [cartItems]);

  if (productsInCartAmount === 0) return <Text variant="body-3">No product added to the order</Text>;

  if ((isCartLoading && !Object.values(removingProducts).some(Boolean)) || !cartProductsData)
    return <Spin className={styles.spinner}></Spin>;

  return (
    <div className={styles['product-list']}>
      {cartItems.map((cartItem, index) => {
        return cartProductsData[index] ? (
          <CartProduct key={cartItem.productId} product={cartProductsData[index]} />
        ) : (
          <Skeleton key={cartItem.productId} className={styles.skeleton} />
        );
      })}
    </div>
  );
}
