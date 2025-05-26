import { useState } from 'react';
import { useToaster } from '@gravity-ui/uikit';
import { api } from '../../api/api';
import { useAuth } from '../../components/hooks/useAuth';

export function usePasswordChange(userInfo: { id: string; version: number }) {
  const { refreshUser } = useAuth();
  const toaster = useToaster();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toaster.add({
        name: 'password-mismatch',
        title: 'Error',
        content: 'New passwords do not match',
        theme: 'danger',
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      await api.changePassword({
        id: userInfo.id,
        version: userInfo.version,
        currentPassword,
        newPassword,
      });
      await refreshUser();
      toaster.add({
        name: 'password-success',
        title: 'Success',
        content: 'Password updated successfully',
        theme: 'success',
      });
      return true;
    } catch (_error) {
      toaster.add({
        name: 'password-error',
        title: 'Error',
        content: 'Failed to change password',
        theme: 'danger',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handlePasswordChange, isSubmitting };
}
