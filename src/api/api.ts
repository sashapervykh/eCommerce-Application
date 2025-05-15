import { projectKey } from '../commercetools-sdk';
import { returnCheckedTokenResponse } from '../utilities/return-checked-token-response';

class API {
  authLink = `https://auth.us-central1.gcp.commercetools.com/oauth/${projectKey}/customers/token`;

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
        scope: `manage_project:space-real-estate`,
      }),
    });

    const result: unknown = await response.json();

    return returnCheckedTokenResponse(result);
  }
}

export const api = new API();
