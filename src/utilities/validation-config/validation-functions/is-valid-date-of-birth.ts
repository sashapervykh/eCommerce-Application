import { z } from 'zod';

export function isValidDOB(value: string, context: z.RefinementCtx) {
  const dob = new Date(value);

  if (Number.isNaN(dob.getTime())) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date format',
    });
    return false;
  }

  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  const isAtLeast13 = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 >= 13 : age >= 13;

  if (!isAtLeast13) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'You must be at least 13 years old',
    });
    return false;
  }
}
