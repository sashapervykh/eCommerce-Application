import { useState } from 'react';
import { Customer } from '@commercetools/platform-sdk';
import { api } from '../../api/api';
import { isErrorResponse, isTokenResponse } from '../../utilities/return-checked-token-response';
import { customerAPI } from '../../api/customer-api';
import { useNavigate } from 'react-router-dom';

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
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response: unknown = await api.getAccessToken({ email, password });
      if (isErrorResponse(response)) {
        if (response.statusCode === 400) {
          setServerError('Please check the email and password. The user with this data is not found.');
        } else {
          setServerError(response.error);
        }
      }
      if (isTokenResponse(response)) {
        customerAPI.createAuthenticatedCustomer(response.token_type, response.access_token);
        const customerData = await customerAPI
          .apiRoot()
          .me()
          .login()
          .post({
            body: {
              email: email,
              password: password,
            },
          })
          .execute();
        setUserInfo(customerData.body.customer);
        console.log(userInfo);
        await navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
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
    serverError,
    setServerError,
  };
};
