import { projectKey } from '../commercetools-sdk';

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

    const requestBody = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      addresses: data.addresses,
      shippingAddresses: data.shippingAddresses,
      billingAddresses: data.billingAddresses,
      defaultShippingAddress: data.defaultShippingAddress,
      defaultBillingAddress: data.defaultBillingAddress,
    };

    const response = await fetch(this.apiLink, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result: unknown = await response.json();
    console.log('API response → for CrossCheck Testing:', result);
    return result;
  }
}

export const api = new API();
