import { Cart, LineItem, MyCartAddLineItemAction } from '@commercetools/platform-sdk';
import { customerAPI } from '../api/customer-api';
import { getOrCreateAnonymId } from '../utilities/return-anonim-id';
export interface BasketItem {
  productId: string;
  quantity: number;
}

const CART_ID_KEY = 'anonymous_cart_id';

export async function getFullCartInfo(): Promise<Cart | undefined> {
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
          localStorage.setItem(CART_ID_KEY, cart.id);
        }
      }
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
    }

    return cart;
  } catch (error) {
    console.error('Error fetching basket items:', error);
    return;
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
          localStorage.setItem(CART_ID_KEY, cart.id);
        }
      }
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

export async function removeFromCart(productId: string, quantity?: number): Promise<void> {
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
                quantity: quantity,
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
                quantity: quantity,
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

export async function mergeCarts(): Promise<void> {
  try {
    const anonymousCartId = localStorage.getItem(CART_ID_KEY);
    const anonymousId = getOrCreateAnonymId();

    if (!anonymousCartId) {
      return;
    }

    let anonymousCart;
    try {
      const anonymousCartResponse = await customerAPI.apiRoot().carts().withId({ ID: anonymousCartId }).get().execute();
      anonymousCart = anonymousCartResponse.body;
      if (anonymousCart.anonymousId !== anonymousId) {
        console.error('Anonymous cart does not match anonymousId');
        localStorage.removeItem(CART_ID_KEY);
        return;
      }
    } catch (error) {
      console.error('Error fetching anonymous cart:', error);
      localStorage.removeItem(CART_ID_KEY);
      return;
    }

    if (anonymousCart.lineItems.length === 0) {
      localStorage.removeItem(CART_ID_KEY);
      return;
    }

    const response = await customerAPI.apiRoot().me().carts().get().execute();
    const userCart = response.body.results[0];

    const userCartProductIds = userCart.lineItems.map((item: LineItem) => item.productId);
    const addLineItemActions: MyCartAddLineItemAction[] = anonymousCart.lineItems
      .filter((item: LineItem) => !userCartProductIds.includes(item.productId))
      .map((item: LineItem) => ({
        action: 'addLineItem',
        productId: item.productId,
        quantity: item.quantity,
      }));

    if (addLineItemActions.length > 0) {
      await customerAPI
        .apiRoot()
        .me()
        .carts()
        .withId({ ID: userCart.id })
        .post({
          body: {
            version: userCart.version,
            actions: addLineItemActions,
          },
        })
        .execute();
    }
    await customerAPI
      .apiRoot()
      .carts()
      .withId({ ID: anonymousCartId })
      .delete({
        queryArgs: {
          version: anonymousCart.version,
        },
      })
      .execute();

    localStorage.removeItem(CART_ID_KEY);
  } catch (error) {
    console.error('Error merging carts:', error);
    localStorage.removeItem(CART_ID_KEY);
    throw error;
  }
}

export async function deleteCart(cartId: string, version: number) {
  try {
    localStorage.removeItem(CART_ID_KEY);
    await customerAPI
      .apiRoot()
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (error) {
    console.error('Error while deleting the cart:', error);
  }
}

export async function addPromoCodeCart(cartId: string, version: number, promo: string) {
  try {
    await customerAPI
      .apiRoot()
      .carts()
      .withId({ ID: cartId })
      .post({ body: { version: version, actions: [{ action: 'addDiscountCode', code: promo }] } })
      .execute();
  } catch (error) {
    console.error('Error while deleting the cart:', error);
  }
}

export async function checkPromoCodeExistence(key: string) {
  try {
    await customerAPI.apiRoot().discountCodes().withKey({ key: key }).get().execute();
    return true;
  } catch (error) {
    if (typeof error === 'object' && error && 'statusCode' in error && error.statusCode === 404) {
      return false;
    }
    return;
  }
}

export async function getPromoCodeByID(id: string) {
  try {
    const promoInfo = await customerAPI.apiRoot().discountCodes().withId({ ID: id }).get().execute();
    return promoInfo.body.code;
  } catch (error) {
    console.log('error fetching promo code info:', error);
  }
}

export async function removePromoCodeByID(cartId: string, version: number, codeId: string) {
  try {
    await customerAPI
      .apiRoot()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: version,
          actions: [
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: codeId,
              },
            },
          ],
        },
      })
      .execute();
  } catch (error) {
    console.error('Error while removing promo code from the cart:', error);
  }
}
