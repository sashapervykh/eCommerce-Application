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
      // 1. Получаем свежий токен
      const tokenResponse = await api.getAccessToken({
        email: userInfo.email,
        password: currentPassword,
      });

      if (!isTokenResponse(tokenResponse)) {
        throw new Error('Invalid email or password');
      }

      // 2. Обновляем клиент с новыми credentials
      customerAPI.createAuthenticatedCustomer(tokenResponse.token_type, tokenResponse.access_token);

      // 3. Получаем актуальные данные пользователя (включая version)
      const customerData = await customerAPI.apiRoot().me().get().execute();
      const currentVersion = customerData.body.version; // Используем свежую версию

      // 4. Меняем пароль
      await api.changePassword({
        id: userInfo.id,
        version: currentVersion, // Важно: используем currentVersion, а не userInfo.version
        currentPassword,
        newPassword,
      });

      // 5. Обновляем данные пользователя
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
