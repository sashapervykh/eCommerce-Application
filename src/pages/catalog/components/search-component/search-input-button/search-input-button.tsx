import { Button, Icon, IconData } from '@gravity-ui/uikit';
import styles from './styles.module.css';

export function SearchInputButton({ type, icon }: { type?: 'submit'; key: string; icon: IconData }) {
  return (
    <Button type={type} size="l" className={styles.button}>
      <Icon data={icon}></Icon>
    </Button>
  );
}
