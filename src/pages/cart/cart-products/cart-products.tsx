import { useEffect, useState } from 'react';
import { CartItemType, useProducts } from '../../../components/hooks/useProducts';
import { Button, Skeleton, Spin, Text } from '@gravity-ui/uikit';
import { useCart } from '../../../components/hooks/useCart';
import styles from './styles.module.css';
import { CartProduct } from './cart-product/cart-product';
import { useNavigate } from 'react-router-dom';
import { TotalValue } from '../total-value/total-value';
import { formatPrice } from '../../../utilities/format-price';

export function CartProducts() {
  const navigate = useNavigate();
  const {
    productsInCartAmount,
    removingProducts,
    setRemovingProducts,
    productsWithChangedAmount,
    setProductsWithChangedAmount,
    getTotalPrice,
  } = useCart();
  const { cartItems, fetchCartItems, getProductByID, isCartLoading } = useProducts();
  const [cartProductsData, setCartProductsData] = useState<CartItemType[] | undefined>();
  const [totalPrice, setTotalPrice] = useState<number | undefined>(undefined);
  const isChangeInTheBasket =
    !Object.values(removingProducts).some(Boolean) && !Object.values(productsWithChangedAmount).some(Boolean);

  useEffect(() => {
    void fetchCartItems();
  }, []);

  useEffect(() => {
    const result: CartItemType[] = [];
    const changingInProcess =
      Object.values(removingProducts).some(Boolean) || Object.values(productsWithChangedAmount).some(Boolean);

    if (cartItems.length === 0) return;
    if (!changingInProcess) setCartProductsData([]);

    const fetchAllProducts = async () => {
      for (const item of cartItems) {
        const productData = await getProductByID(item);
        if (!productData) continue;
        if (!changingInProcess) {
          setCartProductsData((previous) => {
            if (!previous) return [productData];
            const isIncluded = previous.find((product) => product.id === productData.id);
            return isIncluded ? previous : [...previous, productData];
          });
        }
        if (changingInProcess) {
          result.push(productData);
        }
      }
      if (changingInProcess) {
        setCartProductsData(result);
        Object.keys(removingProducts)
          .filter((key) => !result.find((element) => element.id === key))
          .forEach((key) => {
            removingProducts[key] = false;
            setRemovingProducts(removingProducts);
          });
        Object.keys(productsWithChangedAmount).forEach((key) => {
          const changedProduct = result.find((product) => product.id === key);

          if (!changedProduct) {
            productsWithChangedAmount[key] = false;
            setProductsWithChangedAmount(productsWithChangedAmount);
            return;
          }

          if (changedProduct.quantity === productsWithChangedAmount[key]) {
            productsWithChangedAmount[key] = false;
            setProductsWithChangedAmount(productsWithChangedAmount);
          }
        });
      }
      const total = await getTotalPrice();
      setTotalPrice(total);
    };

    void fetchAllProducts();
  }, [cartItems]);

  if (productsInCartAmount === 0)
    return (
      <>
        <div className={styles['empty-cart']}>
          <Text variant="body-3">No product added to the order</Text>
          <Button
            view="action"
            className={styles['catalog-button']}
            onClick={async () => {
              await navigate('/catalog');
            }}
          >
            Go to catalog
          </Button>
        </div>
      </>
    );

  if ((isCartLoading && isChangeInTheBasket) || !cartProductsData) return <Spin className={styles.spinner}></Spin>;

  return (
    <div className={styles['product-list']}>
      {cartItems.map((cartItem, index) => {
        return cartProductsData[index] ? (
          <CartProduct key={cartItem.productId} product={cartProductsData[index]} />
        ) : (
          <Skeleton key={cartItem.productId} className={styles.skeleton} />
        );
      })}
      <TotalValue
        totalPrice={totalPrice ? formatPrice(totalPrice) : 'Calculating...'}
        allProductsShown={Boolean(totalPrice) && cartItems.length === cartProductsData.length && isChangeInTheBasket}
      />
    </div>
  );
}
