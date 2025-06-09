import { useEffect, useState } from 'react';
import { CartItemType, useProducts } from '../../../components/hooks/useProducts';
import { Spin, Text } from '@gravity-ui/uikit';
import { useCart } from '../../../components/hooks/useCart';
import styles from './styles.module.css';
import { CartProduct } from './cart-product';

export function CartProducts() {
  const { productsInCartAmount } = useCart();
  const { cartItems, fetchCartItems, getProductByID } = useProducts();
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
          setCartProductsData((previous) => [...(previous ?? []), productData]);
        }
      }
    };

    void fetchAllProducts();
  }, [cartItems]);

  if (productsInCartAmount === 0) return <Text>No product added to the order</Text>;

  if (!cartProductsData) return <Spin className={styles.spinner}></Spin>;

  return (
    <>
      {cartProductsData.map((item) => (
        <CartProduct key={item.id} product={item} />
      ))}
    </>
  );
}
