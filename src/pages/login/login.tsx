import { Card, Text, Button } from '@gravity-ui/uikit';
import { TextInput, PasswordInput } from '@gravity-ui/uikit';
import styles from './style.module.css';
import NavigationButton from '../../components/navigation-button/navigation-button';
import { Routes } from '../../components/navigation-button/type';
import FormLabel from '../../components/form-label/form-label';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../api/api';
import { customerAPI } from '../../api/customer-api';
import { schema } from '../../utilities/validation-config/validation-rules';
const loginSchema = schema.pick({ email: true, password: true });

const onSubmit = async (data: { email: string; password: string }) => {
  try {
    const response = await api.getAccessToken(data);
    if (response.access_token) customerAPI.createAuthenticatedCustomer(response.token_type, response.access_token);
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
  } catch (error) {
    console.error(error);
  }
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  return (
    <main className={styles.main}>
      <Card type="container" view="outlined" className={styles.container}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
        >
          <h1 className={styles.h1}>Log into your account</h1>
          <FormLabel text="">
            <TextInput
              {...register('email')}
              placeholder="Enter e-mail"
              className={styles.input}
              size="xl"
              errorMessage={errors.email?.message}
              validationState={errors.email ? 'invalid' : undefined}
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
                  onChange={field.onChange}
                  placeholder="Enter password"
                  className={styles.input}
                  size="xl"
                  errorMessage={fieldState.error?.message}
                  validationState={fieldState.invalid ? 'invalid' : undefined}
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
    </main>
  );
}
