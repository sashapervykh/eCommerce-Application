import { projectKey, ctpClient } from '../commercetools-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

interface CustomerResponse {
  id: string;
  version: number;
}

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});

class API {
  authLink = `https://auth.us-central1.gcp.commercetools.com/oauth/${projectKey}/customers/token`;
  tokenLink = `https://auth.us-central1.gcp.commercetools.com/oauth/token`;
  apiLink = `https://api.us-central1.gcp.commercetools.com/${projectKey}/customers`;

  // Оставляем без изменений методы для регистрации
  async getAccessToken(data: { email: string; password: string }) {
    const response = await fetch(this.authLink, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: data.email,
        password: data.password,
        scope: `manage_project:${projectKey}`,
      }),
    });

    const result: unknown = await response.json();
    return result;
  }

  async getClientCredentialsToken() {
    const response = await fetch(this.tokenLink, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: `manage_project:${projectKey}`,
      }),
    });

    const result: unknown = await response.json();

    if (
      typeof result === 'object' &&
      result !== null &&
      'access_token' in result &&
      typeof result.access_token === 'string'
    ) {
      return result.access_token;
    }

    throw new Error('Failed to obtain access token: ' + JSON.stringify(result));
  }

  async createCustomer(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: {
      key: string;
      streetName: string;
      city: string;
      country: string;
      postalCode: string;
    }[];
    shippingAddresses: number[];
    billingAddresses: number[];
    defaultBillingAddress?: number;
    defaultShippingAddress?: number;
  }) {
    const token = await this.getClientCredentialsToken();

    const response = await fetch(this.apiLink, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: unknown = await response.json();
    console.log('API response → for CrossCheck Testing:', result);
    return result;
  }

  // Новые методы с использованием SDK
  async updateCustomer(
    customerId: string,
    version: number,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      addresses?: {
        action: 'addAddress' | 'changeAddress' | 'removeAddress';
        addressId?: string;
        address?: {
          key: string;
          streetName: string;
          city: string;
          country: string;
          postalCode: string;
        };
      }[];
      defaultShippingAddress?: number;
      defaultBillingAddress?: number;
    },
  ): Promise<CustomerResponse> {
    const actions = [];
    if (data.email) {
      actions.push({
        action: 'changeEmail' as const,
        email: data.email,
      });
    }
    if (data.firstName) actions.push({ action: 'setFirstName' as const, firstName: data.firstName });
    if (data.lastName) actions.push({ action: 'setLastName' as const, lastName: data.lastName });
    if (data.dateOfBirth) actions.push({ action: 'setDateOfBirth' as const, dateOfBirth: data.dateOfBirth });

    if (data.addresses) {
      data.addresses.forEach((address) => {
        if (address.action === 'addAddress' && address.address) {
          actions.push({
            action: 'addAddress',
            address: address.address,
          });
        }
      });
    }

    if (data.defaultShippingAddress !== undefined) {
      actions.push({
        action: 'setDefaultShippingAddress' as const,
        addressId: data.defaultShippingAddress.toString(),
      });
    }

    if (data.defaultBillingAddress !== undefined) {
      actions.push({
        action: 'setDefaultBillingAddress' as const,
        addressId: data.defaultBillingAddress.toString(),
      });
    }

    return apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async changePassword(data: {
    id: string;
    version: number;
    currentPassword: string;
    newPassword: string;
  }): Promise<CustomerResponse> {
    return apiRoot
      .customers()
      .password()
      .post({
        body: data,
      })
      .execute()
      .then((response) => response.body);
  }

  async addAddress(
    customerId: string,
    version: number,
    address: {
      key: string;
      streetName: string;
      city: string;
      country: string;
      postalCode: string;
    },
  ): Promise<CustomerResponse> {
    return apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addAddress' as const,
              address,
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async updateAddress(
    customerId: string,
    version: number,
    addressId: string,
    address: {
      streetName?: string;
      city?: string;
      country: string;
      postalCode?: string;
    },
  ): Promise<CustomerResponse> {
    return apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'changeAddress',
              addressId,
              address,
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async removeAddress(customerId: string, version: number, addressId: string): Promise<CustomerResponse> {
    return apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'removeAddress',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async setDefaultShippingAddress(customerId: string, version: number, addressId: string): Promise<CustomerResponse> {
    return apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'setDefaultShippingAddress',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
  }

  async setDefaultBillingAddress(customerId: string, version: number, addressId: string): Promise<CustomerResponse> {
    return apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'setDefaultBillingAddress',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((response) => response.body);
  }
}

export const api = new API();
