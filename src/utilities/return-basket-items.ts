import { LineItem } from '@commercetools/platform-sdk';
import { customerAPI } from '../api/customer-api';

export interface BasketItem {
  productId: string;
  quantity: number;
}

export async function getBasketItems(): Promise<BasketItem[]> {
  try {
    const response = await customerAPI.apiRoot().me().carts().get().execute();

    const cart = response.body.results[0];

    return cart.lineItems.map((item: LineItem) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error('Error fetching basket items:', error);
    return [];
  }
}

export async function addToCart(productId: string, quantity = 1): Promise<void> {
  try {
    const response = await customerAPI.apiRoot().me().carts().get().execute();

    let cart = response.body.results[0];

    const createCartResponse = await customerAPI
      .apiRoot()
      .me()
      .carts()
      .post({
        body: {
          currency: 'USD',
        },
      })
      .execute();
    cart = createCartResponse.body;

    await customerAPI
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              quantity,
            },
          ],
        },
      })
      .execute();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

export async function isProductInCart(productId: string): Promise<boolean> {
  const basketItems = await getBasketItems();
  return basketItems.some((item) => item.productId === productId);
}
