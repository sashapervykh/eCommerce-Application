import { z } from 'zod';

export function isValidPassword(value: string, context: z.RefinementCtx) {
  const messages = [];
  const missedSymbols = [];

  if (value.length < 8) {
    messages.push('Password must be at least 8 characters long.');
  }

  if (value.includes(' ')) {
    messages.push('Password must not contain whitespaces.');
  }

  if (!/[AB]/.test(value)) {
    missedSymbols.push(`1 uppercase letter`);
  }

  if (!/[ab]/.test(value)) {
    missedSymbols.push(`1 lowercase letter`);
  }

  if (!/\d/.test(value)) {
    missedSymbols.push(`1 digit`);
  }

  if (missedSymbols.length > 0) {
    messages.push(`Password shall contain at least ${missedSymbols.join(', ')}.`);
  }

  if (messages.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: messages.join(' '),
    });
  }
}
