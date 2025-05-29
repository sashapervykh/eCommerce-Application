import { useState } from 'react';
import { useToaster } from '@gravity-ui/uikit';
import { api } from '../../api/api';
import { customerAPI } from '../../api/customer-api';
import { isTokenResponse } from '../../utilities/return-checked-token-response';
import { useAuth } from '../../components/hooks/useAuth';

export function usePasswordChange(userInfo: { id: string; version: number; email: string }) {
  const { refreshUser } = useAuth();
  const toaster = useToaster();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    setIsSubmitting(true);
    try {
      const tokenResponse = await api.getAccessToken({
        email: userInfo.email,
        password: currentPassword,
      });

      if (!isTokenResponse(tokenResponse)) {
        throw new Error('Invalid email or password');
      }

      customerAPI.createAuthenticatedCustomer(tokenResponse.token_type, tokenResponse.access_token);

      const customerData = await customerAPI.apiRoot().me().get().execute();
      const currentVersion = customerData.body.version;

      await api.changePassword({
        id: userInfo.id,
        version: currentVersion,
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
    } catch (error: unknown) {
      console.error('Password change error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to change password. Please check your current password.';
      toaster.add({
        name: 'password-error',
        title: 'Error',
        content: errorMessage,
        theme: 'danger',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handlePasswordChange, isSubmitting };
}
