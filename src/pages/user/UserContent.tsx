import { Customer } from '@commercetools/platform-sdk';
import { Card, Button } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { ProfileView } from './ProfileView';
import { ProfileEditForm } from './ProfileEditForm';
import { PasswordChangeForm } from './PasswordChangeForm';

export function UserContent({ userInfo }: { userInfo: Customer }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <Card className={styles['profile-card']}>
      <div className={styles['profile-header']}>
        <h1>User Profile</h1>
        {!isEditingProfile && !isChangingPassword && (
          <div>
            <Button view="action" onClick={() => setIsEditingProfile(true)} className={styles['margin-right']}>
              Edit Profile
            </Button>
            <Button view="normal" onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          </div>
        )}
      </div>

      {!isEditingProfile && !isChangingPassword && <ProfileView userInfo={userInfo} />}
      {isEditingProfile && <ProfileEditForm userInfo={userInfo} onCancel={() => setIsEditingProfile(false)} />}
      {isChangingPassword && <PasswordChangeForm userInfo={userInfo} onCancel={() => setIsChangingPassword(false)} />}
    </Card>
  );
}
