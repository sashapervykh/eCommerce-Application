import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { useAuth } from '../../components/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from './style.module.css';
import { UserContent } from './UserContent';

export function UserPage() {
  const { isAuthenticated, userInfo } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!userInfo) return <div className={styles.loading}>Loading user data...</div>;

  return (
    <PageWrapper title="User Profile">
      <div className={styles.page}>
        <UserContent userInfo={userInfo} />
      </div>
    </PageWrapper>
  );
}
