import { z } from 'zod';

export function isValidPostalCode(value: string, context: z.RefinementCtx) {
  const isUS = /^\d{5}$/.test(value);
  const isCA = /^[a-z]\d[a-z][ -]?\d[a-z]\d$/i.test(value);

  if (!isUS && !isCA) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Postal code must be: 12345 (US) or A1A 1A1 (Canada)',
    });
    return false;
  }
}
