import styles from './styles.module.css';
import { TextInput, Text } from '@gravity-ui/uikit';
import { InputTypes } from './types';
import InnerInputButton from '../inner-input-button/inner-input-button';

export default function FormLabel({
  type,
  text,
  InnerButton,
}: {
  type: InputTypes;
  text: string;
  InnerButton?: typeof InnerInputButton;
}) {
  return (
    <label className={styles.label}>
      <Text variant="subheader-2">Please enter your {text}:</Text>
      <TextInput placeholder={'Enter ' + text} className={styles.input} type={type} size="xl"></TextInput>
      {InnerButton && <InnerButton />}
    </label>
  );
}
