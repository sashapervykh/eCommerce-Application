import { useEffect, useState } from 'react';
import { CartItemType } from '../../../components/hooks/useProducts';
import { Button, Spin, Text } from '@gravity-ui/uikit';
import { useCart } from '../../../components/hooks/useCart';
import styles from './styles.module.css';
import { CartProduct } from './cart-product/cart-product';
import { useNavigate } from 'react-router-dom';
import { TotalValue } from '../total-value/total-value';
import { formatPrice } from '../../../utilities/format-price';

export function CartProducts() {
  const navigate = useNavigate();
  const {
    cartPageData,
    removingProducts,
    setRemovingProducts,
    productsWithChangedAmount,
    setProductsWithChangedAmount,
    isCartPageLoading,
    getCartPageData,
    isCartDeleting,
  } = useCart();
  const [cartProductsData, setCartProductsData] = useState<CartItemType[] | undefined>();
  const [totalPrice, setTotalPrice] = useState<number | undefined>(undefined);
  const isChangeInTheBasket =
    Object.values(removingProducts).some(Boolean) || Object.values(productsWithChangedAmount).some(Boolean);

  useEffect(() => {
    void getCartPageData();
  }, []);

  useEffect(() => {
    if (!cartPageData) return;
    setTotalPrice(cartPageData.totalCartPrice);
    setCartProductsData(cartPageData.cartProducts);

    Object.keys(removingProducts)
      .filter((key) => !cartPageData.cartProducts.find((element) => element.id === key))
      .forEach((key) => {
        removingProducts[key] = false;
        setRemovingProducts(removingProducts);
      });

    Object.keys(productsWithChangedAmount).forEach((key) => {
      const changedProduct = cartPageData.cartProducts.find((product) => product.id === key);
      if (!changedProduct || changedProduct.quantity === productsWithChangedAmount[key]) {
        productsWithChangedAmount[key] = false;
        setProductsWithChangedAmount(productsWithChangedAmount);
      }
    });
  }, [cartPageData]);

  if ((isCartPageLoading && !isChangeInTheBasket) || (isCartDeleting && !isChangeInTheBasket) || !cartProductsData)
    return <Spin className={styles.spinner}></Spin>;

  if (cartProductsData.length === 0)
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

  return (
    <div className={styles['product-list']}>
      {cartProductsData.map((cartProduct, index) => {
        return <CartProduct key={cartProduct.id} product={cartProductsData[index]} />;
      })}
      <TotalValue
        totalPrice={totalPrice ? formatPrice(totalPrice) : 'Calculating...'}
        allProductsShown={Boolean(totalPrice) && !isChangeInTheBasket}
      />
    </div>
  );
}
