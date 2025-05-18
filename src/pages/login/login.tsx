import { Card, Button, Text } from '@gravity-ui/uikit';
import { TextInput, PasswordInput } from '@gravity-ui/uikit';
import { zodResolver } from '@hookform/resolvers/zod';
import FormLabel from '../../components/form-label/form-label';
import { NavigationButton } from '../../components/navigation-button/navigation-button';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Controller, useForm } from 'react-hook-form';
import { schema } from '../../utilities/validation-config/validation-rules';
import { ChangeEvent } from 'react';
import styles from './style.module.css';
import { Routes } from '../../components/navigation-button/type';
import { useAuth } from '../../components/hooks/useAuth';

const loginSchema = schema.pick({ email: true, password: true });

export function LoginPage() {
  const { serverError, login, setServerError, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    try {
      login(data.email, data.password);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(isAuthenticated);
  return (
    <PageWrapper title="Login">
      <Card type="container" view="outlined" className={styles.container}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(onSubmit)();
          }}
        >
          <h1 className={styles.h1}>Log into your account</h1>
          {serverError && (
            <Text variant="subheader-1" className={styles['server-error']} color="danger">
              {serverError}
            </Text>
          )}
          <FormLabel text="">
            <TextInput
              {...register('email', {
                onChange: (event: ChangeEvent) => {
                  setServerError(null);
                  return event;
                },
              })}
              placeholder="Enter e-mail"
              className={styles.input}
              size="xl"
              errorMessage={errors.email?.message}
              validationState={errors.email || serverError ? 'invalid' : undefined}
            />
          </FormLabel>
          <FormLabel text="">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  controlRef={field.ref}
                  value={field.value || ''}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    field.onChange(event);
                    setServerError(null);
                  }}
                  placeholder="Enter password"
                  className={styles.input}
                  size="xl"
                  errorMessage={fieldState.error?.message}
                  validationState={fieldState.invalid || serverError ? 'invalid' : undefined}
                  autoComplete="true"
                />
              )}
            />
          </FormLabel>
          <Button type="submit" view="action" size="xl" width="max">
            Sign in
          </Button>
          <div className={styles['signup-wrapper']}>
            <Text variant="subheader-1">Don't have an account? Sign up here:</Text>
            <NavigationButton route={Routes.registration} text="Sign up" />
          </div>
        </form>
      </Card>
    </PageWrapper>
  );
}
