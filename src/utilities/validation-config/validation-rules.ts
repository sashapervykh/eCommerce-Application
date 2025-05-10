import { z } from 'zod';
import { isValidPassword } from './validation-functions/is-valid-password';

const customErrorMap: z.ZodErrorMap = (issue, context) => {
  if (issue.code === z.ZodIssueCode.invalid_string && issue.validation === 'email') {
    return { message: 'Email must be well formatted (i.e. include @ and domain and not contain whitespaces)' };
  }

  return { message: context.defaultError };
};

z.setErrorMap(customErrorMap);

export const schema = z.object({
  email: z.string().email(),
  password: z.string().superRefine(isValidPassword),
});
