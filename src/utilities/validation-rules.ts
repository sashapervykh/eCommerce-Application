import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, context) => {
  if (issue.code === z.ZodIssueCode.invalid_string && issue.validation === 'email') {
    return { message: 'Email must not contain spaces and must be well formatted (i.e. include @ and domain)' };
  }

  return { message: context.defaultError };
};

z.setErrorMap(customErrorMap);

export const schema = z.object({
  email: z.string().email(),
});
