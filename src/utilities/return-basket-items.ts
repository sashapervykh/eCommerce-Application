import { LineItem } from '@commercetools/platform-sdk';
import { customerAPI } from '../api/customer-api';
import { getOrCreateAnonymId } from '../utilities/return-anonim-id';
export interface BasketItem {
  productId: string;
  quantity: number;
}

const CART_ID_KEY = 'anonymous_cart_id';

export async function getFullCartInfo() {
  try {
    const response = await customerAPI.apiRoot().me().carts().get().execute();
    const cart = response.body.results[0];
    return cart;
  } catch (error) {
    console.error('Error fetching full cart info:', error);
    return null;
  }
}

export async function getBasketItems(): Promise<BasketItem[]> {
  try {
    let cart;
    if (customerAPI.isAnonymous) {
      const cartId = localStorage.getItem(CART_ID_KEY);
      const anonymousId = getOrCreateAnonymId();

      if (cartId) {
        try {
          const response = await customerAPI.apiRoot().carts().withId({ ID: cartId }).get().execute();
          cart = response.body;
          if (cart.anonymousId !== anonymousId) {
            throw new Error('Cart does not match anonymousId');
          }
        } catch (error) {
          console.error('Invalid cart ID, creating new cart:', error);
          localStorage.removeItem(CART_ID_KEY);
        }
      }

      if (!cart) {
        const response = await customerAPI
          .apiRoot()
          .carts()
          .get({
            queryArgs: {
              where: `anonymousId="${anonymousId}"`,
            },
          })
          .execute();
        cart = response.body.results[0];

        if (response.body.results.length == 0) {
          const createCartResponse = await customerAPI
            .apiRoot()
            .carts()
            .post({
              body: {
                currency: 'USD',
                anonymousId: anonymousId,
              },
            })
            .execute();
          cart = createCartResponse.body;
        }

        localStorage.setItem(CART_ID_KEY, cart.id);
      }
    } else {
      const response = await customerAPI.apiRoot().me().carts().get().execute();
      cart = response.body.results[0];
    }

    if (cart.lineItems.length == 0) {
      return [];
    }

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
    let cart;
    if (customerAPI.isAnonymous) {
      const cartId = localStorage.getItem(CART_ID_KEY);
      const anonymousId = getOrCreateAnonymId();

      if (cartId) {
        try {
          const response = await customerAPI.apiRoot().carts().withId({ ID: cartId }).get().execute();
          cart = response.body;
          if (cart.anonymousId !== anonymousId) {
            throw new Error('Cart does not match anonymous Id');
          }
        } catch (error) {
          console.error('Invalid cart ID, creating new cart:', error);
          localStorage.removeItem(CART_ID_KEY);
        }
      }

      if (!cart) {
        const createCartResponse = await customerAPI
          .apiRoot()
          .carts()
          .post({
            body: {
              currency: 'USD',
              anonymousId: anonymousId,
            },
          })
          .execute();
        cart = createCartResponse.body;
        localStorage.setItem(CART_ID_KEY, cart.id);
      }

      await customerAPI
        .apiRoot()
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
    } else {
      const response = await customerAPI.apiRoot().me().carts().get().execute();
      cart = response.body.results[0];
      if (response.body.results.length == 0) {
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
      }

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
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

export async function removeFromCart(productId: string): Promise<void> {
  try {
    let cart;
    if (customerAPI.isAnonymous) {
      const cartId = localStorage.getItem(CART_ID_KEY);
      const anonymousId = getOrCreateAnonymId();

      if (!cartId) {
        throw new Error('No cart found for anonymous user');
      }
      const response = await customerAPI.apiRoot().carts().withId({ ID: cartId }).get().execute();
      cart = response.body;
      if (cart.anonymousId !== anonymousId) {
        throw new Error('Cart does not match anonymousId');
      }
    } else {
      const response = await customerAPI.apiRoot().me().carts().get().execute();
      cart = response.body.results[0];
    }

    const lineItem = cart.lineItems.find((item: LineItem) => item.productId === productId);
    if (!lineItem) {
      throw new Error('Product not found in cart');
    }

    if (customerAPI.isAnonymous) {
      await customerAPI
        .apiRoot()
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId: lineItem.id,
              },
            ],
          },
        })
        .execute();
    } else {
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
                action: 'removeLineItem',
                lineItemId: lineItem.id,
              },
            ],
          },
        })
        .execute();
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
}

export async function isProductInCart(productId: string): Promise<boolean> {
  const basketItems = await getBasketItems();
  return basketItems.some((item) => item.productId === productId);
}
