import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { projectKey } from '../commercetools-sdk';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/ts-client';
import { getOrCreateAnonymId } from '../utilities/return-anonim-id';

class CustomerAPI {
  ctpClient: Client | undefined;
  httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.us-central1.gcp.commercetools.com',
    httpClient: fetch,
  };

  isAnonymous = true;

  constructor() {
    this.createAnonymCustomer();
  }

  apiRoot() {
    if (!this.ctpClient) {
      throw new Error('Client is not initialized');
    }
    return createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey });
  }

  createAnonymCustomer() {
    this.isAnonymous = true;
    getOrCreateAnonymId();

    this.ctpClient = new ClientBuilder()
      .withAnonymousSessionFlow({
        host: 'https://auth.us-central1.gcp.commercetools.com/',
        projectKey: projectKey,
        credentials: { clientId: import.meta.env.VITE_CLIENT_ID, clientSecret: import.meta.env.VITE_CLIENT_SECRET },
      })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }

  createAuthenticatedCustomer(token_type: string, access_token: string) {
    this.isAnonymous = false;
    this.ctpClient = new ClientBuilder()
      .withExistingTokenFlow(`${token_type} ${access_token}`, { force: true })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }

  createCustomerWithRefreshToken(refresh_token: string) {
    this.isAnonymous = false;
    this.ctpClient = new ClientBuilder()
      .withRefreshTokenFlow({
        host: 'https://auth.us-central1.gcp.commercetools.com/',
        projectKey: projectKey,
        credentials: { clientId: import.meta.env.VITE_CLIENT_ID, clientSecret: import.meta.env.VITE_CLIENT_SECRET },
        refreshToken: refresh_token,
      })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }

  createClientWithPasswordFlow(email: string, password: string) {
    this.isAnonymous = false;
    this.ctpClient = new ClientBuilder()
      .withPasswordFlow({
        host: 'https://auth.us-central1.gcp.commercetools.com/',
        projectKey: projectKey,
        credentials: {
          clientId: import.meta.env.VITE_CLIENT_ID,
          clientSecret: import.meta.env.VITE_CLIENT_SECRET,
          user: {
            username: email,
            password: password,
          },
        },
      })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }
}

export const customerAPI = new CustomerAPI();
