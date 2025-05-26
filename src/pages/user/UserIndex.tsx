import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { useAuth } from '../../components/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from './style.module.css';
import { ProfileTabs } from './ProfileTabs';

export function UserPage() {
  const { isAuthenticated, userInfo } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!userInfo) {
    return <div>Loading user data...</div>;
  }

  return (
    <PageWrapper title="User Profile">
      <div className={styles.page}>
        <ProfileTabs userInfo={userInfo} />
      </div>
    </PageWrapper>
  );
}
