import { Card, Text, Button } from '@gravity-ui/uikit';
import styles from './style.module.css';
import NavigationButton from '../../components/navigation-button/navigation-button';
import { Routes } from '../../components/navigation-button/type';
import FormLabel from '../../components/form-label/form-label';
import InnerInputButton from '../../components/inner-input-button/inner-input-button';
import { FormProvider, useForm } from 'react-hook-form';
import { schema } from '../../utilities/validation-config/validation-rules';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../api/api';

const onSubmit = async (data: { email: string; password: string }) => {
  const response = await api.getAccessToken(data);
  console.log(response);
};

export default function LoginPage() {
  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;

  return (
    <main className={styles.main}>
      <Card type="container" view="outlined" className={styles.card}>
        <FormProvider {...methods}>
          <form
            onSubmit={(event) => {
              void handleSubmit(onSubmit)(event);
            }}
          >
            <h1 className={styles.h1}>Log Into Your Account</h1>
            <FormLabel zScheme="email" type="text" text="e-mail" />
            <FormLabel zScheme="password" type="password" text="password" InnerButton={InnerInputButton} />
            <Button type="submit" view="action" size="xl" width="max">
              Sign in
            </Button>
            <div className={styles['signup-wrapper']}>
              <Text variant="subheader-1">Don't have an account? Sign up here:</Text>
              <NavigationButton route={Routes.registration} text={'Sign up'} />
            </div>
          </form>
        </FormProvider>
      </Card>
    </main>
  );
}
