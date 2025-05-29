import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isValidPassword } from '../../utilities/validation-config/validation-functions/is-valid-password';

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, ' '),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .superRefine((value, context) => {
        if (value.length > 0) {
          isValidPassword(value, context);
        }
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine((data, context) => {
    if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword'],
      });
    }
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export function usePasswordValidation() {
  return useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onChange',
    shouldFocusError: true,
  });
}
