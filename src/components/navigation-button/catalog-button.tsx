import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';
import { ChevronDownWide } from '@gravity-ui/icons';
import { useNavigate } from 'react-router-dom';
import styles from './catalog-button.module.css';

interface MenuItem {
  text: string;
  action: () => void;
  items?: MenuItem[];
}

export function CatalogMenuButton({
  items,
  catalogRoute,
  setIsMenuOpen,
}: {
  items: MenuItem[];
  catalogRoute: string;
  setIsMenuOpen: (value: boolean) => void;
}) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  const openMenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const handleTextClick = (event: React.MouseEvent) => {
    event.preventDefault();
    void navigate(catalogRoute);
  };

  const handleIconClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSubmenuOpen(false);

    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname, setIsMenuOpen]);

  return (
    <div className={styles['catalog-menu-container']} onMouseEnter={openMenu}>
      {isMobile() ? (
        <div className={styles['button-group']}>
          <Button view="action" onClick={handleTextClick} className={styles['nav-button']}>
            Catalog
          </Button>
          <Button view="action" onClick={handleIconClick} className={styles['icon-button']}>
            <ChevronDownWide className={styles['chevron-icon']} />
          </Button>
        </div>
      ) : (
        <Button view="action" onClick={handleTextClick} className={styles['nav-button']}>
          Catalog
          <ChevronDownWide className={styles['chevron-icon']} />
        </Button>
      )}
      {isSubmenuOpen && (
        <div className={styles['catalog-menu']}>
          <ul className={styles['menu-list']}>
            {items.map((item, index) => (
              <li key={index} className={styles['menu-item']}>
                <button
                  onClick={() => {
                    item.action();
                  }}
                  className={styles['menu-item-button']}
                >
                  {item.text}
                </button>
                {Array.isArray(item.items) && item.items.length > 0 && (
                  <ul className={styles['submenu-list']}>
                    {item.items.map((subItem: MenuItem, subIndex: number) => (
                      <li key={subIndex} className={styles['submenu-item']}>
                        <button
                          onClick={() => {
                            subItem.action();
                          }}
                          className={styles['menu-item-button']}
                        >
                          {subItem.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
