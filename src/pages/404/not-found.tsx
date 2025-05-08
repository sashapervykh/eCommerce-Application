import { Card } from '@gravity-ui/uikit';
import styles from './style.module.css';
import NavigationButton from '../../components/navigation-button/navigation-button';
import { Routes } from '../../components/navigation-button/type';
import Lottie from 'lottie-react';
import animationData from './animation.json';
import { useLocation } from 'react-router';

export default function NotFoundPage() {
  const location = useLocation();
  return (
    <main className={styles.main}>
      <Card type="container" view="outlined" style={{ padding: '40px' }}>
        <div>
          <h1 className={styles.h1}>Page Not Found</h1>
          <p>The path {location.pathname} does not exist</p>
          <Lottie animationData={animationData} loop={true} style={{ width: '100%', margin: '0 auto' }} />
          <NavigationButton route={Routes.main} text={'To main'} />
        </div>
      </Card>
    </main>
  );
}
