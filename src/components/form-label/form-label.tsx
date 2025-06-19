import { Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { ReactNode } from 'react';

interface FormLabelProperties {
  text: string;
  children: ReactNode;
}

export default function FormLabel({ text, children }: FormLabelProperties) {
  return (
    <label className={styles.label}>
      <Text variant="subheader-2">{text}</Text>
      {children}
    </label>
  );
}
