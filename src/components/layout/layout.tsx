import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Loader } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import styles from './layout.module.css';
import { AuthButtons } from './auth-buttons';
import { CatalogMenuButton } from '../navigation-button/catalog-button';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { catalogItems } from '../../utilities/return-catalog-items';
import { Footer } from '../footer/footer';
import { CartButton } from '../cart-button/cart-button';

const navLinks = [
  { text: 'Home', route: '/' },
  { text: 'Catalog', route: '/catalog' },
  { text: 'About', route: '/about-us' },
];

export function MainLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isLoading } = useAuth();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const catalogMenuItems = catalogItems(categories, navigate);

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

  if (isLoading || categoriesLoading) {
    return (
      <div>
        <Loader size="l" className={styles.loader} />
      </div>
    );
  }

  if (categoriesError) {
    return <div className={styles.error}>Error loading categories: {categoriesError}</div>;
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
            {navLinks.map((link) =>
              link.route === '/catalog' ? (
                <CatalogMenuButton
                  key={link.route}
                  items={catalogMenuItems}
                  catalogRoute={link.route}
                  setIsMenuOpen={setIsMenuOpen}
                />
              ) : (
                <Button key={link.route} view="action" onClick={() => void navigate(link.route)}>
                  {link.text}
                </Button>
              ),
            )}
            {!isAuthenticated && <CartButton buttonSize={'m'} buttonWidth={undefined} />}
          </nav>
          <div className={styles.user}>
            <AuthButtons />
          </div>
        </div>

        <div className={`${styles['mobile-menu']} ${isMenuOpen ? styles.open : ''}`}>
          {navLinks.map((link) =>
            link.route === '/catalog' ? (
              <CatalogMenuButton
                key={link.route}
                items={catalogMenuItems}
                catalogRoute={link.route}
                setIsMenuOpen={setIsMenuOpen}
              />
            ) : (
              <Button
                key={link.route}
                view="action"
                onClick={() => {
                  void navigate(link.route);
                  setIsMenuOpen(false);
                }}
                width="max"
              >
                {link.text}
              </Button>
            ),
          )}
          {!isAuthenticated && <CartButton buttonSize={'m'} buttonWidth={undefined} />}
          <div className={styles['mobile-auth-buttons']}>
            <AuthButtons />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
