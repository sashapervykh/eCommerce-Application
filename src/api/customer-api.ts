import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { projectKey } from '../commercetools-sdk';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/ts-client';

class CustomerAPI {
  ctpClient: Client | undefined;
  httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.us-central1.gcp.commercetools.com',
    httpClient: fetch,
  };

  apiRoot() {
    const apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey });
    return apiRoot;
  }

  createAuthenticatedCustomer(token_type: string, access_token: string) {
    this.ctpClient = new ClientBuilder()
      .withExistingTokenFlow(`${token_type} ${access_token}`, { force: true })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }
}

export const customerAPI = new CustomerAPI();
