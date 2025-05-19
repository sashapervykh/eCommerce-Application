import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import styles from './style.module.css';
import { useAuth } from '../../components/hooks/useAuth';

export function HomePage() {
  const { userInfo } = useAuth();

  return (
    <PageWrapper title="Space Real Estate">
      <div className={styles['content-container']}>
        <h1 className={styles['page-title']}>
          {userInfo?.firstName ? `Hello, ${userInfo.firstName}!` : ''} Welcome to Space Real Estate
        </h1>

        <div className={styles['data-preview']}>
          <h2 className={styles['data-preview-title']}>We are in process of building our shop...</h2>
        </div>
      </div>
    </PageWrapper>
  );
}
