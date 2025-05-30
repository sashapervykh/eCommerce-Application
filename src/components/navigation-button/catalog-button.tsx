import { useState, useRef } from 'react';
import { Button } from '@gravity-ui/uikit';
import { ChevronDownWide } from '@gravity-ui/icons';
import { useNavigate } from 'react-router-dom';
import styles from './catalog-button.module.css';

interface MenuItem {
  text: string;
  action: () => void;
  items?: MenuItem[];
}

export function CatalogMenuButton({ items, catalogRoute }: { items: MenuItem[]; catalogRoute: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonReference = useRef<HTMLButtonElement>(null);
  const menuReference = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const openMenu = () => {
    setIsOpen(true);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    void navigate(catalogRoute);
    setIsOpen(false);
  };

  return (
    <div className={styles['catalog-menu-container']} onMouseEnter={openMenu}>
      <Button
        view="action"
        onClick={handleClick}
        ref={buttonReference}
        aria-expanded={isOpen}
        aria-controls="catalog-menu"
        aria-label="Catalog menu, press Enter to open or click to go to catalog"
        tabIndex={0}
        className={styles['nav-button']}
      >
        Catalog
        <ChevronDownWide className={styles['chevron-icon']} />
      </Button>
      {isOpen && (
        <div id="catalog-menu" ref={menuReference} className={styles['catalog-menu']}>
          <ul className={styles['menu-list']}>
            {items.map((item, index) => (
              <li key={index} className={styles['menu-item']}>
                <button
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
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
                            setIsOpen(false);
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
