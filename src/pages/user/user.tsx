import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Button } from '@gravity-ui/uikit';
import { useAuth } from '../../components/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Customer } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';

function UserContent({ userInfo }: { userInfo: Customer | null }) {
  return (
    <div>
      <h1>User Profile</h1>
      {userInfo && (
        <div>
          <p>
            Welcome, {userInfo.firstName} {userInfo.lastName}
          </p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}
    </div>
  );
}

export function UserPage() {
  const { isAuthenticated, userInfo } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageWrapper title="User Profile">
      <div>
        <Button view="outlined">Moon</Button>
      </div>
      <UserContent userInfo={userInfo} />
    </PageWrapper>
  );
}
