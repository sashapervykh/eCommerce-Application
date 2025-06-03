import { PasswordInput, Button } from '@gravity-ui/uikit';
import { usePasswordValidation } from './password-validation';
import { usePasswordChange } from './usePasswordChange';
import styles from './style.module.css';
import { forwardRef } from 'react';

const CustomPasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof PasswordInput>>(
  (props, reference) => <PasswordInput {...props} controlRef={reference} />,
);

export function PasswordChangeForm({
  userInfo,
  onCancel,
}: {
  userInfo: { id: string; version: number; email: string };
  onCancel: () => void;
}) {
  const { handlePasswordChange, isSubmitting } = usePasswordChange(userInfo);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = usePasswordValidation();

  const onSubmit = async (data: { currentPassword: string; newPassword: string }) => {
    const success = await handlePasswordChange(data.currentPassword, data.newPassword);
    if (success) {
      reset();
    }
  };

  return (
    <div className={styles['password-change-section']}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomPasswordInput
          {...register('currentPassword')}
          label="Current Password"
          size="l"
          className={styles.input}
          errorMessage={errors.currentPassword?.message?.trim() ?? undefined}
          validationState={errors.currentPassword?.message ? 'invalid' : undefined}
        />
        <CustomPasswordInput
          {...register('newPassword', {
            onChange: () => trigger('newPassword'),
          })}
          label="New Password"
          size="l"
          className={styles.input}
          errorMessage={errors.newPassword?.message}
          validationState={errors.newPassword ? 'invalid' : undefined}
        />
        <CustomPasswordInput
          {...register('confirmPassword', {
            onChange: () => trigger(['confirmPassword', 'newPassword']),
          })}
          label="Confirm New Password"
          size="l"
          className={styles.input}
          errorMessage={errors.confirmPassword?.message}
          validationState={errors.confirmPassword ? 'invalid' : undefined}
        />
        <div className={styles['button-group']}>
          <Button view="normal" onClick={onCancel} className={styles['margin-right']}>
            Cancel
          </Button>
          <Button type="submit" view="action" loading={isSubmitting} disabled={isSubmitting || !isValid}>
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
}
