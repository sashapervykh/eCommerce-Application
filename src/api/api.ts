import { projectKey } from '../commercetools-sdk';

interface CustomerResponse {
  id: string;
  version: number;
}

class API {
  authLink = `https://auth.us-central1.gcp.commercetools.com/oauth/${projectKey}/customers/token`;
  tokenLink = `https://auth.us-central1.gcp.commercetools.com/oauth/token`;
  apiLink = `https://api.us-central1.gcp.commercetools.com/${projectKey}/customers`;

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
    const token = await this.getClientCredentialsToken();
    const actions = [];
    if (data.email) {
      actions.push({
        action: 'changeEmail',
        email: data.email,
      });
    }
    if (data.firstName) actions.push({ action: 'setFirstName', firstName: data.firstName });
    if (data.lastName) actions.push({ action: 'setLastName', lastName: data.lastName });
    if (data.dateOfBirth) actions.push({ action: 'setDateOfBirth', dateOfBirth: data.dateOfBirth });

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
        action: 'setDefaultShippingAddress',
        addressId: data.defaultShippingAddress.toString(),
      });
    }

    if (data.defaultBillingAddress !== undefined) {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressId: data.defaultBillingAddress.toString(),
      });
    }

    const response = await fetch(`${this.apiLink}/${customerId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        actions,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
  }

  async changePassword(data: {
    id: string;
    version: number;
    currentPassword: string;
    newPassword: string;
  }): Promise<CustomerResponse> {
    const token = await this.getClientCredentialsToken();
    const response = await fetch(`${this.apiLink}/password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Password change failed: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
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
    const token = await this.getClientCredentialsToken();

    const response = await fetch(`${this.apiLink}/${customerId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        actions: [
          {
            action: 'addAddress',
            address,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add address: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
  }

  async updateAddress(
    customerId: string,
    version: number,
    addressId: string,
    address: Partial<{
      streetName: string;
      city: string;
      country: string;
      postalCode: string;
    }>,
  ): Promise<CustomerResponse> {
    const token = await this.getClientCredentialsToken();

    const response = await fetch(`${this.apiLink}/${customerId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        actions: [
          {
            action: 'changeAddress',
            addressId,
            address,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update address: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
  }

  async removeAddress(customerId: string, version: number, addressId: string): Promise<CustomerResponse> {
    const token = await this.getClientCredentialsToken();

    const response = await fetch(`${this.apiLink}/${customerId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        actions: [
          {
            action: 'removeAddress',
            addressId,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove address: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
  }

  async setDefaultShippingAddress(customerId: string, version: number, addressId: string): Promise<CustomerResponse> {
    const token = await this.getClientCredentialsToken();

    const response = await fetch(`${this.apiLink}/${customerId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        actions: [
          {
            action: 'setDefaultShippingAddress',
            addressId,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set default shipping address: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
  }

  async setDefaultBillingAddress(customerId: string, version: number, addressId: string): Promise<CustomerResponse> {
    const token = await this.getClientCredentialsToken();

    const response = await fetch(`${this.apiLink}/${customerId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        actions: [
          {
            action: 'setDefaultBillingAddress',
            addressId,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set default billing address: ${response.statusText}`);
    }

    return (await response.json()) as CustomerResponse;
  }
}

export const api = new API();
