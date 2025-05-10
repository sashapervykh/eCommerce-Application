import { Card, Text } from '@gravity-ui/uikit';
import styles from './style.module.css';
import NavigationButton from '../../components/navigation-button/navigation-button';
import { Routes } from '../../components/navigation-button/type';
import FormLabel from '../../components/form-label/form-label';
import InnerInputButton from '../../components/inner-input-button/inner-input-button';

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <Card type="container" view="outlined" style={{ padding: '40px' }}>
        <form>
          <h1 className={styles.h1}>Log Into Your Account</h1>
          <FormLabel zScheme="email" type="text" text="e-mail" />
          <FormLabel zScheme="password" type="password" text="password" InnerButton={InnerInputButton} />
          <NavigationButton route={Routes.main} text={'To main'} />
          <div style={{ marginTop: '15px' }}>
            <Text variant="subheader-1">Don't have an account? Sign up here:</Text>
            <NavigationButton route={Routes.registration} text={'Sign up'} />
          </div>
        </form>
      </Card>
    </main>
  );
}
