import { Button, Icon } from '@gravity-ui/uikit';
import { Eye, EyeSlash } from '@gravity-ui/icons';
import styles from './styles.module.css';
import { useState } from 'react';

export default function InnerInputButton({ onClickFunction }: { onClickFunction: () => void }) {
  const [visible, setVisible] = useState(false);

  return (
    <Button
      size="l"
      view="flat-secondary"
      onClick={() => {
        onClickFunction();
        setVisible((previous) => !previous);
      }}
      className={styles.button}
    >
      <Icon data={visible ? EyeSlash : Eye} className={styles.icon}></Icon>
    </Button>
  );
}
