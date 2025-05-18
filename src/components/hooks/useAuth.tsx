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
  login: (email: string, password: string) => void;
  refresh: (refresh_token: string) => void;
  register: (userData: UserData) => void;
  logout: () => void;
  serverError: string | null;
  setServerError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<Customer | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response: unknown = await api.getAccessToken({ email, password });
      console.log(response);
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
        localStorage.setItem('refresh_token', response.refresh_token);
        await navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refresh = async (refresh_token: string) => {
    try {
      customerAPI.createCustomerWithRefreshToken(refresh_token);
      const customerData = await customerAPI.apiRoot().me().get().execute();
      setUserInfo(customerData.body);
    } catch (error) {
      console.error(error);
    }
  };

  const register = (userData: UserData) => {
    console.log('Registration with:', userData);
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('refresh_token');
    setUserInfo(null);
  };

  useEffect(() => {
    const refreshWithSavedToken = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        try {
          setUserInfo({} as Customer);
          await refresh(refresh_token);
        } catch {
          setUserInfo(null);
        }
      }
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
  };

  return <AuthContext.Provider value={authContextValue}> {children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
