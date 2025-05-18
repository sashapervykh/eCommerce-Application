import { Navigate } from 'react-router-dom'; // Note 1
import { useAuth } from '../../components/hooks/useAuth';
import { LoginPage } from './login';

export const CommonRoutes = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" /> : <LoginPage />;
};
