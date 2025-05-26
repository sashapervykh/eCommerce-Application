import { Button, Icon, IconData } from '@gravity-ui/uikit';
import styles from './styles.module.css';

export function SearchInputButton({ icon }: { key: string; icon: IconData }) {
  return (
    <Button size="l" className={styles.button}>
      <Icon data={icon}></Icon>
    </Button>
  );
}
