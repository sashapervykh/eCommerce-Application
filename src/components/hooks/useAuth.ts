import { useState } from 'react';
import { Customer } from '@commercetools/platform-sdk';

interface UserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const mockUser: Customer = {
  id: 'mock-user-id',
  version: 1,
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  email: 'mock@example.com',
  firstName: 'Mock',
  lastName: 'User',
  addresses: [],
  isEmailVerified: false,
  authenticationMode: 'Password',
  stores: [],
  customerNumber: 'mock-001',
  shippingAddressIds: [],
  billingAddressIds: [],
  customerGroupAssignments: [],
};

export const useAuth = () => {
  const [userInfo, setUserInfo] = useState<Customer | null>(null);

  const login = async (email: string, password: string) => {
    console.log('Login attempt with:', email, password);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUserInfo(mockUser);
        resolve();
      }, 500);
    });
  };

  const register = async (userData: UserData) => {
    console.log('Registration with:', userData);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUserInfo({
          ...mockUser,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    console.log('Logging out...');
    setUserInfo(null);
    return Promise.resolve();
  };

  return {
    isAuthenticated: !!userInfo,
    userInfo,
    login,
    register,
    logout,
  };
};
