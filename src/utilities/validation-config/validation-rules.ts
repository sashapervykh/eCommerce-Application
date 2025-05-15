import { z } from 'zod';
import { isValidPassword } from './validation-functions/is-valid-password';
import { isValidDOB } from './validation-functions/is-valid-date-of-birth';
import { isValidPostalCode } from './validation-functions/is-valid-postal-code';

const customErrorMap: z.ZodErrorMap = (issue, context) => {
  if (issue.code === z.ZodIssueCode.invalid_string && issue.validation === 'email') {
    return { message: 'Email must be well formatted (i.e. include @ and domain and not contain whitespaces)' };
  }

  if (issue.path.includes('firstName') || issue.path.includes('lastName') || issue.path.includes('city')) {
    if (issue.code === z.ZodIssueCode.too_small) {
      return { message: 'This field is required' };
    }
    if (issue.code === z.ZodIssueCode.invalid_string && issue.validation === 'regex') {
      return { message: 'Field must contain only characters and no special characters or numbers' };
    }
  }

  if (
    issue.path.includes('country') &&
    (issue.code === z.ZodIssueCode.invalid_enum_value || issue.code === z.ZodIssueCode.too_small)
  ) {
    return { message: 'Please select a valid country (United States or Canada)' };
  }

  return { message: context.defaultError };
};

z.setErrorMap(customErrorMap);

export const schema = z.object({
  email: z.string().email(),
  password: z.string().superRefine(isValidPassword),
  firstName: z.string().regex(/^[A-Za-zА-я]+$/),
  lastName: z.string().regex(/^[A-Za-zА-я]+$/),
  dateOfBirth: z.string().min(1, 'Date is required').superRefine(isValidDOB),
  street: z.string().min(1, 'Street is required'),
  city: z.string().regex(/^[A-Za-zА-я]+$/),
  country: z.enum(['US', 'CA']),
  postalCode: z.string().min(1, 'Postal code is required').superRefine(isValidPostalCode),
});
