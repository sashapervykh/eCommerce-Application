import { Customer } from '@commercetools/platform-sdk';
import styles from './style.module.css';

export function ProfileView({ userInfo }: { userInfo: Customer }) {
  return (
    <div className={styles['profile-section']}>
      <p>
        <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
      </p>
      <p>
        <strong>Email:</strong> {userInfo.email}
      </p>
      {userInfo.dateOfBirth && (
        <p>
          <strong>Date of Birth:</strong> {new Date(userInfo.dateOfBirth).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
