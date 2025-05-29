import { Button, Icon, IconData } from '@gravity-ui/uikit';
import styles from './styles.module.css';

export function SearchInputButton({ type, icon, onClick }: { type?: 'submit'; icon: IconData; onClick?: () => void }) {
  return (
    <Button type={type} size="l" className={styles.button} onClick={onClick}>
      <Icon data={icon}></Icon>
    </Button>
  );
}
