import styles from './styles.module.css';
import { TextInput, Text } from '@gravity-ui/uikit';
import { InputTypes } from './types';
import InnerInputButton from '../inner-input-button/inner-input-button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '../../utilities/validation-config/validation-rules';
import { useState } from 'react';

export default function FormLabel({
  type,
  text,
  zScheme,
  InnerButton,
}: {
  type: InputTypes;
  text: string;
  zScheme?: 'email' | 'password';
  InnerButton?: typeof InnerInputButton;
}) {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [inputType, setInputType] = useState<InputTypes>(type);

  return (
    <label className={styles.label}>
      <Text variant="subheader-2">Please enter your {text}:</Text>
      <TextInput
        placeholder={'Enter ' + text}
        className={styles.input}
        type={inputType}
        size="xl"
        {...(zScheme && register(zScheme))}
        errorMessage={zScheme && typeof errors[zScheme]?.message === 'string' ? errors[zScheme].message : ''}
        validationState={zScheme && errors[zScheme] ? 'invalid' : undefined}
        autoComplete={zScheme === 'password' ? true : false}
      ></TextInput>
      {InnerButton && (
        <InnerButton
          onClickFunction={() => {
            setInputType((previous) => (previous === 'password' ? 'text' : 'password'));
          }}
        />
      )}
    </label>
  );
}
