import { useEffect, useState } from 'react';
import { CartItemType, useProducts } from '../../../components/hooks/useProducts';
import { Skeleton, Spin, Text } from '@gravity-ui/uikit';
import { useCart } from '../../../components/hooks/useCart';
import styles from './styles.module.css';
import { CartProduct } from './cart-product/cart-product';

export function CartProducts() {
  const { productsInCartAmount } = useCart();
  const { cartItems, fetchCartItems, getProductByID, isCartLoading } = useProducts();
  const [cartProductsData, setCartProductsData] = useState<CartItemType[] | undefined>();

  useEffect(() => {
    void fetchCartItems();
    console.log(1);
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) return;
    console.log(cartItems);
    setCartProductsData([]);

    const fetchAllProducts = async () => {
      for (const item of cartItems) {
        const productData = await getProductByID(item);
        if (productData) {
          setCartProductsData((previous) => {
            if (!previous) return [productData];
            const isIncluded = previous.find((product) => product.id === productData.id);
            return isIncluded ? previous : [...previous, productData];
          });
        }
      }
    };

    void fetchAllProducts();
  }, [cartItems]);

  if (productsInCartAmount === 0) return <Text variant="body-3">No product added to the order</Text>;

  if (isCartLoading || !cartProductsData) return <Spin className={styles.spinner}></Spin>;

  return (
    <div className={styles['product-list']}>
      {cartItems.map((_, index) => {
        return cartProductsData[index] ? (
          <CartProduct key={index} product={cartProductsData[index]} />
        ) : (
          <Skeleton key={index} className={styles.skeleton} />
        );
      })}
    </div>
  );
}
