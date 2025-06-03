import { createContext, useContext, useEffect, useState } from 'react';
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

interface AuthContextType {
  userInfo: Customer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, preventRedirect?: boolean) => Promise<void>;
  refresh: (refresh_token: string) => void;
  register: (userData: UserData) => void;
  logout: () => void;
  serverError: string | null;
  setServerError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<Customer | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const refreshUser = async () => {
    try {
      const customerData = await customerAPI.apiRoot().me().get().execute();
      setUserInfo(customerData.body);
    } catch (error: unknown) {
      if (error instanceof Error && 'statusCode' in error && error.statusCode === 401) {
        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token) {
          try {
            await refresh(refresh_token);
            return;
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
          }
        }
        logout();
      }
      console.error('Failed to refresh user data:', error);
    }
  };

  const login = async (email: string, password: string, preventRedirect = false): Promise<void> => {
    try {
      const response: unknown = await api.getAccessToken({ email, password });

      if (isErrorResponse(response)) {
        if (response.statusCode === 400) {
          setServerError('Please check the email and password. The user with this data is not found.');
        } else {
          setServerError(response.error);
        }
        return;
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
        localStorage.setItem('refresh_token', response.refresh_token);

        if (!preventRedirect) {
          await navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const refresh = async (refresh_token: string) => {
    try {
      customerAPI.createCustomerWithRefreshToken(refresh_token);
      const customerData = await customerAPI.apiRoot().me().get().execute();
      setUserInfo(customerData.body);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = (userData: UserData) => {
    console.log('Registration with:', userData);
  };

  const logout = () => {
    customerAPI.createAnonymCustomer();
    localStorage.removeItem('refresh_token');
    setUserInfo(null);
  };

  useEffect(() => {
    const refreshWithSavedToken = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        try {
          await refresh(refresh_token);
        } catch {
          setUserInfo(null);
        }
      } else {
        customerAPI.createAnonymCustomer();
      }
      setIsLoading(false);
    };
    void refreshWithSavedToken();
  }, []);

  const authContextValue = {
    isAuthenticated: !!userInfo,
    userInfo,
    login,
    register,
    refresh,
    logout,
    serverError,
    setServerError,
    isLoading,
    refreshUser,
  };

  return <AuthContext.Provider value={authContextValue}> {children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
