import { Button } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    void navigate('/login');
  };

  if (isAuthenticated) {
    return (
      <Button view="action" onClick={onLogout}>
        Log Out
      </Button>
    );
  }

  return (
    <>
      <Button view="action" onClick={() => navigate('/login')}>
        Sign In
      </Button>
      <Button view="action" onClick={() => navigate('/registration')}>
        Sign Up
      </Button>
    </>
  );
};
