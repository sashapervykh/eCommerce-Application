import { useState } from 'react';
import { useToaster } from '@gravity-ui/uikit';
import { api } from '../../api/api';
import { customerAPI } from '../../api/customer-api';
import { isTokenResponse } from '../../utilities/return-checked-token-response';

export function usePasswordChange(userInfo: { id: string; version: number; email: string }) {
  const toaster = useToaster();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    setIsSubmitting(true);
    try {
      // 1. Получаем токен с текущим паролем
      const tokenResponse = await api.getAccessToken({
        email: userInfo.email,
        password: currentPassword,
      });

      if (!isTokenResponse(tokenResponse)) throw new Error('Invalid token response');

      // 2. Обновляем клиент с новыми учетными данными
      customerAPI.createAuthenticatedCustomer(tokenResponse.token_type, tokenResponse.access_token);

      // 3. Меняем пароль
      await api.changePassword({
        id: userInfo.id,
        version: userInfo.version,
        currentPassword,
        newPassword,
      });

      // 4. Получаем новый токен с новым паролем
      const newTokenResponse = await api.getAccessToken({
        email: userInfo.email,
        password: newPassword,
      });

      if (!isTokenResponse(newTokenResponse)) throw new Error('Invalid token response after password change');

      // 5. Обновляем клиент и сохраняем refresh token
      customerAPI.createAuthenticatedCustomer(newTokenResponse.token_type, newTokenResponse.access_token);
      localStorage.setItem('refresh_token', newTokenResponse.refresh_token);

      toaster.add({
        name: 'password-success',
        title: 'Success',
        content: 'Password updated successfully',
        theme: 'success',
      });
      return true;
    } catch (error) {
      console.error('Password change error:', error);
      toaster.add({
        name: 'password-error',
        title: 'Error',
        content: 'Failed to change password. Please check your current password.',
        theme: 'danger',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handlePasswordChange, isSubmitting };
}
