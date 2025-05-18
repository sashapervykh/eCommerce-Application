import { Navigate } from 'react-router-dom'; // Note 1
import { useAuth } from '../hooks/useAuth';

export const CommonRoutes = ({ child }: { child: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return <>{isAuthenticated ? <Navigate to="/" /> : child}</>;
};
