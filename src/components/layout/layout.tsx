import { Outlet } from 'react-router-dom';
import { Button, Loader } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import styles from './layout.module.css';
import { AuthButtons } from './auth-buttons';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { text: 'Home', route: '/' },
  { text: 'Catalog', route: '/catalog' },
  { text: 'About', route: '/about-us' },
];

export function MainLayout() {
  const navigate = useNavigate();

  const { isLoading } = useAuth();

  return isLoading ? (
    <div>
      <Loader size="l" className={styles.loader} />
    </div>
  ) : (
    <div className={styles['app-container']}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h2 className={styles.logo}>Space Real Estate</h2>
          <nav className={styles.navigation}>
            {navLinks.map((link) => (
              <Button key={link.text} view="action" onClick={() => navigate(link.route)}>
                {link.text}
              </Button>
            ))}
          </nav>
          <div className={styles.user}>
            <AuthButtons />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
