import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Loader, Menu } from '@gravity-ui/uikit';
import { Xmark } from '@gravity-ui/icons';
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
  console.log('Menu icon:', Menu);
  console.log('Xmark icon:', Xmark);
  const navigate = useNavigate();
  const { isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest(`.${styles.burger}, .${styles['mobile-menu']}`)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  if (isLoading) {
    return (
      <div>
        <Loader size="l" className={styles.loader} />
      </div>
    );
  }

  return (
    <div className={styles['app-container']}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h2 className={styles.logo} onClick={() => void navigate('/')} style={{ cursor: 'pointer' }}>
            Space Real Estate
          </h2>

          <button
            className={`${styles.burger} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.646 3.646a.5.5 0 0 1 .708 0L8 7.293l3.646-3.647a.5.5 0 0 1 .708.708L8.707 8l3.647 3.646a.5.5 0 0 1-.708.708L8 8.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 8 3.646 4.354a.5.5 0 0 1 0-.708z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>
            )}
          </button>

          <nav className={styles['nav-links']}>
            {navLinks.map((link) => (
              <Button key={link.text} view="action" onClick={() => void navigate(link.route)}>
                {link.text}
              </Button>
            ))}
          </nav>

          <div className={styles.user}>
            <AuthButtons />
          </div>
        </div>

        <div className={`${styles['mobile-menu']} ${isMenuOpen ? styles.open : ''}`}>
          {navLinks.map((link) => (
            <Button
              key={link.text}
              view="action"
              onClick={() => {
                void navigate(link.route);
                setIsMenuOpen(false);
              }}
              width="max"
            >
              {link.text}
            </Button>
          ))}
          <div className={styles['mobile-auth-buttons']}>
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
