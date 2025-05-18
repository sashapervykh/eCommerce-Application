import { Button } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import styles from './header-navigation.module.css';
import type { NavigationButtonConfig } from './types';

interface HeaderNavigationProperties {
  buttons: NavigationButtonConfig[];
  className?: string;
}

export const HeaderNavigation = ({ buttons }: HeaderNavigationProperties) => {
  const navigate = useNavigate();

  const handleButtonClick = async (button: NavigationButtonConfig) => {
    if (button.onClick) {
      (button.onClick as () => void)();
    } else {
      try {
        await navigate(button.route);
      } catch (error) {
        console.error('Navigation failed:', error);
      }
    }
  };

  return (
    <>
      {buttons
        .filter((button) => button.visible)
        .map((button, index) => (
          <Button
            key={index}
            view={button.view ?? 'action'}
            size={button.size ?? 'm'}
            onClick={() => handleButtonClick(button)}
            className={styles.button}
          >
            {button.text}
          </Button>
        ))}
    </>
  );
};
