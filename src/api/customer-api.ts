import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { projectKey } from '../commercetools-sdk';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/ts-client';
import { CustomerRequestProperties } from './types';

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

  createLoggedInCustomer(token_type: string, access_token: string) {
    this.ctpClient = new ClientBuilder()
      .withExistingTokenFlow(`${token_type} ${access_token}`, { force: true })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }

  async getLoggedInCustomerData(properties: CustomerRequestProperties) {
    customerAPI.createLoggedInCustomer(properties.token_type, properties.access_token);
    const customerData = await customerAPI
      .apiRoot()
      .me()
      .login()
      .post({
        body: {
          email: properties.email,
          password: properties.password,
        },
      })
      .execute()
      .then((response) => {
        return response.body;
      });

    return customerData;
  }
}

export const customerAPI = new CustomerAPI();
