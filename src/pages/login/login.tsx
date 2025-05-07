import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, TextInput, Card, Text, Icon } from '@gravity-ui/uikit';
import { Eye } from '@gravity-ui/icons';
import styles from './style.module.css';

export default function LoginPage() {
  const navigate: NavigateFunction = useNavigate();

  return (
    <main className={styles.main}>
      <Card type="container" view="outlined" style={{ padding: '40px' }}>
        <form>
          <h1 className={styles.h1}>Log Into Your Account</h1>
          <label className={styles.label}>
            <Text variant="subheader-2">Please enter your e-mail:</Text>
            <TextInput placeholder="Enter e-mail" className={styles.input} type="email" size="xl"></TextInput>
          </label>
          <label className={styles.label}>
            <Text variant="subheader-2">Please enter your password:</Text>
            <TextInput className={styles.input} placeholder="Enter password" type="password" size="xl" />
            <Button size="l" view="flat-secondary" style={{ position: 'absolute', right: '1%', bottom: '22%' }}>
              <Icon data={Eye} width="75%" height="75%"></Icon>
            </Button>
          </label>
          <Button
            view="action"
            size="xl"
            onClick={() => {
              void navigate('/');
            }}
            width="max"
          >
            To main
          </Button>
          <div style={{ marginTop: '15px' }}>
            <Text variant="subheader-1">Don't have an account? Sign up here:</Text>
            <Button
              view="action"
              size="xl"
              onClick={() => {
                void navigate('/');
              }}
              width="max"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
