export function returnCheckedTokenResponse(data: unknown) {
  if (typeof data !== 'object' || !data) throw new Error('Token response has the wrong type');
  if (
    Object.keys(data).length !== 5 ||
    !('access_token' in data) ||
    !('expires_in' in data) ||
    !('scope' in data) ||
    !('refresh_token' in data) ||
    !('token_type' in data) ||
    typeof data.access_token !== 'string' ||
    typeof data.expires_in !== 'number' ||
    typeof data.scope !== 'string' ||
    typeof data.refresh_token !== 'string' ||
    typeof data.token_type !== 'string'
  ) {
    throw new Error('Token response has the wrong type');
  }
  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    scope: data.scope,
    refresh_token: data.refresh_token,
    token_type: data.token_type,
  };
}
