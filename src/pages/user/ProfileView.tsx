import { Customer } from '@commercetools/platform-sdk';
import styles from '../style.module.css';

export function ProfileView({ userInfo }: { userInfo: Customer }) {
  return (
    <div className={styles['profile-section']}>
      <h2>Personal Information</h2>
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
