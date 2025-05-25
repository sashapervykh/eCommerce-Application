import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { useAuth } from '../../components/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Customer } from '@commercetools/platform-sdk';
import { Card, Button, useToaster, PasswordInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { TextInput } from '@gravity-ui/uikit';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../../utilities/validation-config/validation-rules';
import { api } from '../../api/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface UserContentProps {
  userInfo: Customer;
}

function UserContent({ userInfo }: UserContentProps) {
  const { refreshUser } = useAuth();
  const toaster = useToaster();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(
      registrationSchema._def.schema.pick({
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
      }) as z.ZodType<ProfileFormData>,
    ),
    defaultValues: {
      email: userInfo.email,
      firstName: userInfo.firstName ?? '',
      lastName: userInfo.lastName ?? '',
      dateOfBirth: userInfo.dateOfBirth ?? '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      await api.updateCustomer(userInfo.id, userInfo.version, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
      });

      await refreshUser();
      toaster.add({
        name: 'profile-update-success',
        title: 'Profile Updated',
        content: 'Your profile has been successfully updated',
        theme: 'success',
        autoHiding: 5000,
      });
      setIsEditingProfile(false);
      reset(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toaster.add({
        name: 'profile-update-error',
        title: 'Update Failed',
        content: 'Failed to update profile. Please try again.',
        theme: 'danger',
        autoHiding: 5000,
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toaster.add({
        name: 'password-mismatch',
        title: 'Error',
        content: 'New passwords do not match',
        theme: 'danger',
      });
      return;
    }

    try {
      await api.changePassword({
        id: userInfo.id,
        version: userInfo.version,
        currentPassword,
        newPassword,
      });
      await refreshUser();
      toaster.add({
        name: 'password-success',
        title: 'Success',
        content: 'Password updated successfully',
        theme: 'success',
      });
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
      toaster.add({
        name: 'password-error',
        title: 'Error',
        content: 'Failed to change password',
        theme: 'danger',
      });
    }
  };

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

      {!isEditingProfile && !isChangingPassword && (
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
      )}

      {isEditingProfile && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles['profile-section']}>
            <h2>Edit Personal Information</h2>
            <div className={styles['form-row']}>
              <TextInput
                {...register('email')}
                label="Email"
                size="l"
                errorMessage={errors.email?.message}
                validationState={errors.email ? 'invalid' : undefined}
              />
              <TextInput
                {...register('firstName')}
                label="First Name"
                size="l"
                errorMessage={errors.firstName?.message}
                validationState={errors.firstName ? 'invalid' : undefined}
              />
              <TextInput
                {...register('lastName')}
                label="Last Name"
                size="l"
                errorMessage={errors.lastName?.message}
                validationState={errors.lastName ? 'invalid' : undefined}
              />
            </div>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  type="text"
                  label="Date of Birth (YYYY-MM-DD)"
                  size="l"
                  errorMessage={errors.dateOfBirth?.message}
                  validationState={errors.dateOfBirth ? 'invalid' : undefined}
                />
              )}
            />
          </div>
          <div className={styles['button-group']}>
            <Button view="normal" onClick={() => setIsEditingProfile(false)} className={styles['margin-right']}>
              Cancel
            </Button>
            <Button type="submit" view="action">
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {isChangingPassword && (
        <div className={styles['profile-section']}>
          <h2>Change Password</h2>
          <PasswordInput
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            label="Current Password"
            size="l"
          />
          <PasswordInput
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            label="New Password"
            size="l"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            label="Confirm New Password"
            size="l"
          />
          <div className={styles['button-group']}>
            <Button view="normal" onClick={() => setIsChangingPassword(false)} className={styles['margin-right']}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} view="action">
              Change Password
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

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
        <UserContent userInfo={userInfo} />
      </div>
    </PageWrapper>
  );
}
