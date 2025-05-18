import { Card, Button, Text } from '@gravity-ui/uikit';
import { TextInput, PasswordInput } from '@gravity-ui/uikit';
import { zodResolver } from '@hookform/resolvers/zod';
import FormLabel from '../../components/form-label/form-label';
import { NavigationButton } from '../../components/navigation-button/navigation-button';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Controller, useForm } from 'react-hook-form';
import { api } from '../../api/api';
import { customerAPI } from '../../api/customer-api';
import { schema } from '../../utilities/validation-config/validation-rules';
import { isErrorResponse, isTokenResponse } from '../../utilities/return-checked-token-response';
import { ChangeEvent } from 'react';
import styles from './style.module.css';
import { Routes } from '../../components/navigation-button/type';

const loginSchema = schema.pick({ email: true, password: true });

export function LoginPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response: unknown = await api.getAccessToken(data);
      if (isErrorResponse(response)) {
        console.log(response);
        if (response.statusCode === 400) {
          setError('root', {
            type: 'ServerError',
            message: 'Please check the email and password. The user with this data is not found.',
          });
        } else {
          setError('root', { type: 'ServerError', message: response.error });
        }
      }
      if (isTokenResponse(response)) {
        customerAPI.createAuthenticatedCustomer(response.token_type, response.access_token);
        void customerAPI
          .apiRoot()
          .me()
          .login()
          .post({
            body: {
              email: data.email,
              password: data.password,
            },
          })
          .execute()
          .then((response) => {
            console.log(response.body);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageWrapper title="Login">
      <Card type="container" view="outlined" className={styles.container}>
        <form
          className={styles.form}
          onSubmit={() => {
            void handleSubmit(onSubmit)();
          }}
        >
          <h1 className={styles.h1}>Log into your account</h1>
          {errors.root && (
            <Text variant="subheader-1" className={styles['server-error']} color="danger">
              {errors.root.message}
            </Text>
          )}
          <FormLabel text="">
            <TextInput
              {...register('email', {
                onChange: (event: ChangeEvent) => {
                  clearErrors('root');
                  return event;
                },
              })}
              placeholder="Enter e-mail"
              className={styles.input}
              size="xl"
              errorMessage={errors.email?.message}
              validationState={errors.email ? 'invalid' : errors.root ? 'invalid' : undefined}
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
                    clearErrors('root');
                  }}
                  placeholder="Enter password"
                  className={styles.input}
                  size="xl"
                  errorMessage={fieldState.error?.message}
                  validationState={fieldState.invalid ? 'invalid' : errors.root ? 'invalid' : undefined}
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
