import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import styles from './style.module.css';
import { useAuth } from '../../components/hooks/useAuth';

export function HomePage() {
  const { userInfo } = useAuth();

  return (
    <PageWrapper title="Space Real Estate">
      <div className={styles['content-container']}>
        <div className={styles['page-data']}>
          <h1 className={styles['page-title']}>
            {userInfo?.firstName ? `Hello, ${userInfo.firstName}!` : ''} Welcome to Space Real Estate!
          </h1>
          <h3 className={styles['page-data-title']}>
            We will help you spend your money tastefully and with undoubted benefit. Hurry! There are few houses left,
            and the number of people wishing to spend time away from their mother-in-law is constantly growing!
          </h3>
        </div>
      </div>
    </PageWrapper>
  );
}
