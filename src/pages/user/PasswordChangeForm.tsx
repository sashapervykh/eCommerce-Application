import { PasswordInput, Button } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { usePasswordChange } from './usePasswordChange';

export function PasswordChangeForm({
  userInfo,
  onCancel,
}: {
  userInfo: { id: string; version: number };
  onCancel: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { handlePasswordChange, isSubmitting } = usePasswordChange(userInfo);

  const onSubmit = async () => {
    const success = await handlePasswordChange(currentPassword, newPassword, confirmPassword);
    if (success) {
      onCancel();
    }
  };

  return (
    <div className={styles['password-change-section']}>
      <h2>Change Password</h2>
      <PasswordInput
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        label="Current Password"
        size="l"
        className={styles.input}
      />
      <PasswordInput
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        label="New Password"
        size="l"
        className={styles.input}
      />
      <PasswordInput
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        label="Confirm New Password"
        size="l"
        className={styles.input}
      />
      <div className={styles['button-group']}>
        <Button view="normal" onClick={onCancel} className={styles['margin-right']}>
          Cancel
        </Button>
        <Button onClick={onSubmit} view="action" loading={isSubmitting}>
          Change Password
        </Button>
      </div>
    </div>
  );
}
