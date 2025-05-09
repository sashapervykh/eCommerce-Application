import styles from './styles.module.css';
import { TextInput, Text } from '@gravity-ui/uikit';
import { InputTypes } from './types';
import InnerInputButton from '../inner-input-button/inner-input-button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '../../utilities/validation-rules';

export default function FormLabel({
  type,
  text,
  InnerButton,
}: {
  type: InputTypes;
  text: string;
  InnerButton?: typeof InnerInputButton;
}) {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return (
    <label className={styles.label}>
      <Text variant="subheader-2">Please enter your {text}:</Text>
      <TextInput
        placeholder={'Enter ' + text}
        className={styles.input}
        type={type}
        size="xl"
        {...register('email')}
        errorMessage={errors.email?.message}
        validationState={errors.email ? 'invalid' : undefined}
      ></TextInput>
      {InnerButton && <InnerButton />}
    </label>
  );
}
