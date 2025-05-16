import { z } from 'zod';

export const isValidPostalCode = (data: { postalCode: string; country?: string }, context: z.RefinementCtx) => {
  const { postalCode, country } = data;

  if (!postalCode) {
    return;
  }

  const isUS = /^\d{5}$/.test(postalCode);
  const isCA = /^[a-z]\d[a-z][ -]?\d[a-z]\d$/i.test(postalCode);

  if (country === undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'You should select your country first',
      path: ['postalCode'],
    });
  }

  if (country === 'US' && !isUS) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Postal code must be in format: 12345',
      path: ['postalCode'],
    });
  } else if (country === 'CA' && !isCA) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Postal code must be in format: A1A 1A1',
      path: ['postalCode'],
    });
  }
};
