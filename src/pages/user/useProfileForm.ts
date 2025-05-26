import { useState } from 'react';
import { useToaster } from '@gravity-ui/uikit';
import { Customer } from '@commercetools/platform-sdk';
import { api } from '../../api/api';
import { useAuth } from '../../components/hooks/useAuth';

export function useProfileForm(userInfo: Customer) {
  const { refreshUser } = useAuth();
  const toaster = useToaster();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { email: string; firstName: string; lastName: string; dateOfBirth: string }) => {
    setIsSubmitting(true);
    try {
      await api.updateCustomer(userInfo.id, userInfo.version, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
      });

      await refreshUser();
      toaster.add({
        name: 'profile-update-success',
        title: 'Profile Updated',
        content: 'Your profile has been successfully updated',
        theme: 'success',
      });
      return true;
    } catch (_error) {
      toaster.add({
        name: 'profile-update-error',
        title: 'Update Failed',
        content: 'Failed to update profile. Please try again.',
        theme: 'danger',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
