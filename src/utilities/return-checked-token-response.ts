import { z } from 'zod';

const TokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
});

export function returnCheckedTokenResponse(data: unknown) {
  try {
    return TokenResponseSchema.parse(data);
  } catch (error) {
    console.error('Error parsing token response:', error);
    throw new Error('Invalid token response');
  }
}
