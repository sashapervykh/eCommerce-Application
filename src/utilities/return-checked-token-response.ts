import { z } from 'zod';

const TokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
});

const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  errors: z.array(z.object({ code: z.string(), message: z.string() })),
  error: z.string(),
  error_description: z.string().optional(),
});

export function isTokenResponse(data: unknown): data is z.infer<typeof TokenResponseSchema> {
  try {
    TokenResponseSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function isErrorResponse(data: unknown): data is z.infer<typeof ErrorResponseSchema> {
  try {
    ErrorResponseSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
